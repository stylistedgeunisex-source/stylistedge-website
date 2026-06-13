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

    const now = new Date();
    const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const todayStr = istTime.toLocaleDateString('en-CA');
    const currentMinutes = istTime.getHours() * 60 + istTime.getMinutes();
    
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*');

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const timeToMinutes = (timeStr: string) => {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (hours === 12) hours = 0;
      if (modifier === 'PM') hours += 12;
      return hours * 60 + minutes;
    };

    const upcomingBookings: any[] = [];
    const pastBookings: any[] = [];

    bookings.forEach(b => {
      let isUpcoming = false;
      if (b.date > todayStr) {
        isUpcoming = true;
      } else if (b.date === todayStr) {
        isUpcoming = timeToMinutes(b.time) > currentMinutes;
      }

      if (isUpcoming) {
        upcomingBookings.push(b);
      } else {
        pastBookings.push(b);
      }
    });

    const sortBookings = (arr: any[], ascending: boolean) => {
      return arr.sort((a, b) => {
        const dateDiff = a.date.localeCompare(b.date);
        if (dateDiff !== 0) return ascending ? dateDiff : -dateDiff;
        const timeDiff = timeToMinutes(a.time) - timeToMinutes(b.time);
        return ascending ? timeDiff : -timeDiff;
      });
    };

    const sortedUpcoming = sortBookings(upcomingBookings, true);
    const sortedPast = sortBookings(pastBookings, false);

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

    const formatBookings = (arr: any[]) => arr.map(b => ({
      ...b,
      date: formatToDDMMYYYY(b.date)
    }));

    return NextResponse.json({ 
      success: true, 
      upcomingBookings: formatBookings(sortedUpcoming),
      pastBookings: formatBookings(sortedPast)
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
}
