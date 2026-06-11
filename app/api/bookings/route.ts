import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

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
  const date = searchParams.get('date');

  if (!date) return NextResponse.json({ success: false, error: 'Date is required' }, { status: 400 });

  // 1. Get timings for this day
  const timings = getStoreTimings();
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  let dayTiming = timings?.default?.[dayOfWeek];
  if (timings?.scheduled?.[date]) {
    dayTiming = timings.scheduled[date];
  }

  if (!dayTiming || !dayTiming.isOpen) {
    return NextResponse.json({ success: true, slots: [] });
  }

  // 2. Fetch existing bookings for this date
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('time')
    .eq('date', date);

  if (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500 });
  }

  const bookedTimes = new Set(bookings.map(b => b.time));

  // 3. Generate slots (30 min intervals)
  const slots = [];
  let currentTime = new Date(`${date}T${dayTiming.open}`);
  const closeTime = new Date(`${date}T${dayTiming.close}`);

  while (currentTime < closeTime) {
    const timeString = currentTime.toTimeString().substring(0, 5); // HH:MM
    if (!bookedTimes.has(timeString)) {
      slots.push(timeString);
    }
    currentTime = new Date(currentTime.getTime() + 30 * 60000); // add 30 mins
  }

  return NextResponse.json({ success: true, slots });
}

export async function POST(request: Request) {
  try {
    const { date, time, serviceId, phone } = await request.json();

    if (!date || !time || !phone) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Insert booking
    const { error } = await supabase
      .from('bookings')
      .insert([{ date, time, service_id: serviceId, phone }]);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
