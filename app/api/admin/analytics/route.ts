import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch all bookings: phone, name
    const { data, error } = await supabase
      .from('bookings')
      .select('phone, name');

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Aggregate by phone number — pick the first name seen, count bookings
    const map = new Map<string, { name: string; count: number }>();
    for (const row of data) {
      if (!row.phone) continue;
      if (map.has(row.phone)) {
        map.get(row.phone)!.count += 1;
      } else {
        map.set(row.phone, { name: row.name || 'Unknown', count: 1 });
      }
    }

    // Sort by count desc, take top 5
    const top5 = Array.from(map.entries())
      .map(([phone, { name, count }]) => ({ phone, name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({ success: true, top5 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
