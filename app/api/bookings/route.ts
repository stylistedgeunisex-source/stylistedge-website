import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

const defaultDailyTiming = { open: '09:00', close: '17:00', isOpen: true };
const defaultWeeklyTimings: Record<string, typeof defaultDailyTiming> = {
  monday: { ...defaultDailyTiming },
  tuesday: { ...defaultDailyTiming },
  wednesday: { ...defaultDailyTiming },
  thursday: { ...defaultDailyTiming },
  friday: { ...defaultDailyTiming },
  saturday: { ...defaultDailyTiming },
  sunday: { ...defaultDailyTiming, isOpen: false },
};

// Helper to parse date string (handles DD/MM/YYYY and YYYY-MM-DD)
function parseDate(dateStr: string): Date {
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }
  if (dateStr.includes('-')) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(dateStr);
}

// Helper to convert any date format to YYYY-MM-DD (for DB query/insert)
function formatToYYYYMMDD(dateStr: string): string {
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return dateStr;
}

// Helper to convert YYYY-MM-DD to DD/MM/YYYY
function formatToDDMMYYYY(dateStr: string): string {
  if (!dateStr) return '';
  if (dateStr.includes('/')) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

// Helper to get timings from database.json
function getStoreTimings() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'database.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return data.timings;
  } catch (error) {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get('date');
  const phone = searchParams.get('phone');

  // If phone is provided, return active bookings for that phone (for manage)
  if (phone) {
    const todayStr = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('phone', phone)
      .gte('date', todayStr) // Only upcoming or today
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      return NextResponse.json({ success: false, error: 'Failed to fetch your bookings' }, { status: 500 });
    }

    // Format all dates to DD/MM/YYYY before sending to client
    const formattedData = data.map(b => ({
      ...b,
      date: formatToDDMMYYYY(b.date)
    }));

    return NextResponse.json({ success: true, bookings: formattedData });
  }

  if (!dateParam) return NextResponse.json({ success: false, error: 'Date or Phone is required' }, { status: 400 });

  const dateObj = parseDate(dateParam);
  if (isNaN(dateObj.getTime())) {
    return NextResponse.json({ success: false, error: 'Invalid date format' }, { status: 400 });
  }

  const dbDateStr = formatToYYYYMMDD(dateParam);
  const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  // 1. Get timings for this day
  const timings = getStoreTimings();
  let dayTiming = timings?.default?.[dayOfWeek] || defaultWeeklyTimings[dayOfWeek];
  
  if (timings?.scheduled?.[dbDateStr]) {
    dayTiming = timings.scheduled[dbDateStr];
  }

  if (!dayTiming || !dayTiming.isOpen) {
    return NextResponse.json({ success: true, slots: [] });
  }

  // 2. Fetch existing bookings for this date to count slots
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('time')
    .eq('date', dbDateStr);

  if (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500 });
  }

  // Count bookings per time slot
  const slotCounts: Record<string, number> = {};
  for (const b of bookings) {
    slotCounts[b.time] = (slotCounts[b.time] || 0) + 1;
  }

  // 3. Generate slots (30 min intervals)
  const slots = [];
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const dateBase = `${year}-${month}-${day}`;

  let currentTime = new Date(`${dateBase}T${dayTiming.open}`);
  const closeTime = new Date(`${dateBase}T${dayTiming.close}`);

  while (currentTime < closeTime) {
    const timeString = currentTime.toTimeString().substring(0, 5); // HH:MM
    // Add slot if bookings at this time are less than 2
    if ((slotCounts[timeString] || 0) < 2) {
      slots.push(timeString);
    }
    currentTime = new Date(currentTime.getTime() + 30 * 60000); // add 30 mins
  }

  return NextResponse.json({ success: true, slots });
}

export async function POST(request: Request) {
  try {
    const { date, time, name, phone, gender, serviceId = 'general' } = await request.json();

    if (!date || !time || !name || !phone || !gender) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const dbDateStr = formatToYYYYMMDD(date);

    // Double check availability (max 2)
    const { count, error: countError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('date', dbDateStr)
      .eq('time', time);

    if (countError) throw countError;
    
    if (count !== null && count >= 2) {
      return NextResponse.json({ success: false, error: 'Time slot is fully booked' }, { status: 400 });
    }

    // Insert booking
    const { error } = await supabase
      .from('bookings')
      .insert([{ date: dbDateStr, time, name, phone, gender, service_id: serviceId }]);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const phone = searchParams.get('phone');

    if (!id || !phone) {
      return NextResponse.json({ success: false, error: 'Missing id or phone' }, { status: 400 });
    }

    // Delete booking where id and phone match (basic security)
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)
      .eq('phone', phone);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
