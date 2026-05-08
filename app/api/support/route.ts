import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Grabbing the data from your Supabase table record
    const { name, whatsapp, subject } = body.record;

    await resend.emails.send({
      from: 'noOrSpace Support <onboarding@resend.dev>',
      to: 'nooralhodahmed@gmail.com',
      subject: `New Support Request: ${name}`,
      html: `
        <div style="font-family: sans-serif; direction: rtl; text-align: right;">
          <h1 style="color: #1A1F2B;">طلب دعم جديد</h1>
          <p><strong>الاسم:</strong> ${name}</p>
          <p><strong>رقم الواتساب:</strong> ${whatsapp}</p>
          <p><strong>الموضوع:</strong> ${subject}</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Email notification sent' });
  } catch (error) {
    console.error("Email Error:", error);
    return NextResponse.json({ error: 'Failed to send email alert' }, { status: 500 });
  }
}