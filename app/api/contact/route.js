import { NextResponse } from 'next/server';

// This route sends contact-form submissions by email using Resend's HTTP API
// directly via fetch — no SDK/dependency needed. To go live:
//
// 1. Create a free account at https://resend.com and verify a sending domain
//    (or use their shared onboarding@resend.dev sender for testing).
// 2. Create an API key and set these environment variables (e.g. in
//    .env.local, or your hosting provider's dashboard):
//
//      RESEND_API_KEY=re_xxxxxxxxxxxx
//      CONTACT_TO_EMAIL=editorial@jpsc-publisher.org
//      RESEND_FROM_EMAIL=J-PSC Website <onboarding@resend.dev>
//
// Until RESEND_API_KEY is set, this route returns a clear "not configured"
// error instead of failing silently, so the contact form can show the
// person a fallback (direct email / WhatsApp) instead of a broken submit.

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }

  const { name, email, subject, message } = body || {};

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || 'editorial@jpsc-publisher.org';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'J-PSC Website <onboarding@resend.dev>';

  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: 'not_configured' },
      { status: 503 }
    );
  }

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `[J-PSC Contact] ${subject}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });

    if (!resendResponse.ok) {
      const errText = await resendResponse.text();
      console.error('Resend API error:', resendResponse.status, errText);
      return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact form send error:', err);
    return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 });
  }
}
