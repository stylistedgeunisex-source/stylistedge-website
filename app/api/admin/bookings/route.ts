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

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .order('date', { ascending: false })
      .order('time', { ascending: true });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

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

    const formattedBookings = bookings.map(b => ({
      ...b,
      date: formatToDDMMYYYY(b.date)
    }));

    return NextResponse.json({ success: true, bookings: formattedBookings });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
}
