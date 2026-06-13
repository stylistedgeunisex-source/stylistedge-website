import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase.from('bookings').select('*').limit(1);

    if (error) {
      return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
    }

    const firstRow = data && data.length > 0 ? data[0] : null;
    return NextResponse.json({ status: 'ok', firstRow });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }
}