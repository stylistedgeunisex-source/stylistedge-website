import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper to generate a 6 digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // Store in Supabase
    const { error: dbError } = await supabase
      .from('otps')
      .insert([{ phone, otp, expires_at: expiresAt }]);

    if (dbError) {
      console.error('DB Error:', dbError);
      return NextResponse.json({ success: false, error: 'Failed to generate OTP' }, { status: 500 });
    }

    // Send via Meta Cloud API
    const metaApiUrl = `https://graph.facebook.com/v17.0/${process.env.META_PHONE_NUMBER_ID}/messages`;
    
    const response = await fetch(metaApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone,
        type: 'template',
        template: {
          name: 'otp_template', // Requires an approved template in Meta Dashboard
          language: {
            code: 'en_US'
          },
          components: [
            {
              type: 'body',
              parameters: [
                {
                  type: 'text',
                  text: otp
                }
              ]
            },
            {
              type: 'button',
              sub_type: 'url',
              index: '0',
              parameters: [
                {
                  type: 'text',
                  text: otp
                }
              ]
            }
          ]
        }
      })
    });

    const metaData = await response.json();

    if (!response.ok) {
      console.error('Meta API Error:', metaData);
      return NextResponse.json({ success: false, error: 'Failed to send WhatsApp message' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'OTP sent' });

  } catch (error) {
    console.error('OTP Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
