import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_for_development_only'
);

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await jwtVerify(token, JWT_SECRET);

    const todayStr = new Date().toLocaleDateString('en-CA', {
      timeZone: 'Asia/Kolkata'
    });
    
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .gte('date', todayStr)
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Filter out past times for today's bookings
    const timeToMinutes = (timeStr: string) => {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (hours === 12) hours = 0;
      if (modifier === 'PM') hours += 12;
      return hours * 60 + minutes;
    };

    const now = new Date();
    const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const currentMinutes = istTime.getHours() * 60 + istTime.getMinutes();

    const upcomingBookings = bookings.filter(b => {
      if (b.date === todayStr) {
        return timeToMinutes(b.time) > currentMinutes;
      }
      return true;
    });

    // Helper to convert YYYY-MM-DD to DD/MM/YYYY
    const formatToDDMMYYYY = (dateStr: string): string => {
      if (!dateStr) return '';
      if (dateStr.includes('/')) return dateStr;
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    };

    const formattedBookings = upcomingBookings.map(b => ({
      ...b,
      date: formatToDDMMYYYY(b.date)
    }));

    return NextResponse.json({ success: true, bookings: formattedBookings });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
}
