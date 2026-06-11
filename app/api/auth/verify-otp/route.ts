import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_for_development_only'
);

export async function POST(request: Request) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json({ success: false, error: 'Phone and OTP are required' }, { status: 400 });
    }

    // Check against Supabase
    const { data, error } = await supabase
      .from('otps')
      .select('*')
      .eq('phone', phone)
      .eq('otp', otp)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: 'Invalid or expired OTP' }, { status: 401 });
    }

    // Optional: Mark OTP as used by deleting it
    await supabase.from('otps').delete().eq('id', data.id);

    // Create a session cookie
    const token = await new SignJWT({ phone, role: 'user' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d')
      .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set('user_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return NextResponse.json({ success: true, message: 'Logged in successfully' });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
