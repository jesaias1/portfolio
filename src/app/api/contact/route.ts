import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { checkContactRateLimit } from '@/lib/rate-limit';

const CONTACT_EMAIL = 'linasjesaias@gmail.com';
const LEGACY_CONTACT_EMAIL = 'contact@jesaias.dk';

function publicContactEmail(email?: string | null) {
  return !email || email === LEGACY_CONTACT_EMAIL ? CONTACT_EMAIL : email;
}

export async function GET() {
  try {
    const contact = await prisma.contact.findFirst();

    if (!contact) {
      return NextResponse.json({
        id: 'main',
        email: CONTACT_EMAIL,
        github: 'https://github.com/jesaias1',
        linkedin: 'https://www.linkedin.com/in/jesaias/',
      });
    }

    return NextResponse.json({ ...contact, email: publicContactEmail(contact.email) });
  } catch {
    return NextResponse.json({
      id: 'main',
      email: CONTACT_EMAIL,
      github: 'https://github.com/jesaias1',
      linkedin: 'https://www.linkedin.com/in/jesaias/',
    });
  }
}

export async function POST(request: Request) {
  const startedAt = Date.now();
  const requestId = request.headers.get('x-vercel-id');
  const route = '/api/contact';
  const log = (level: 'info' | 'error', message: string, status: number) => {
    const payload = { level, message, route, status, requestId, durationMs: Date.now() - startedAt };
    if (level === 'error') console.error(JSON.stringify(payload));
    else console.log(JSON.stringify(payload));
  };

  try {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    if (origin && host && new URL(origin).host !== host) {
      log('error', 'Contact request rejected by origin check', 403);
      return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
    }

    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > 20_000) {
      log('error', 'Contact payload exceeded size limit', 413);
      return NextResponse.json({ error: 'Request too large' }, { status: 413 });
    }

    const clientKey =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      requestId ||
      'local';
    const rateLimit = checkContactRateLimit(clientKey);
    if (!rateLimit.allowed) {
      log('error', 'Contact rate limit exceeded', 429);
      return NextResponse.json(
        { error: 'Too many messages. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } }
      );
    }

    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const website = typeof body.website === 'string' ? body.website.trim() : '';
    const formStartedAt = typeof body.startedAt === 'number' ? body.startedAt : 0;
    const formAge = Date.now() - formStartedAt;

    if (
      website ||
      formAge < 1500 ||
      formAge > 2 * 60 * 60 * 1000 ||
      !name ||
      !email ||
      !message ||
      name.length > 100 ||
      email.length > 254 ||
      message.length > 5000 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      log('error', 'Contact validation rejected submission', 400);
      return NextResponse.json({ error: 'Invalid contact form submission' }, { status: 400 });
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const configuredContactEmail = process.env.CONTACT_TO_EMAIL?.trim();
    const contactToEmail = publicContactEmail(configuredContactEmail);

    if (emailUser && emailPass && contactToEmail) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      const esc = (s: string) =>
        s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      const mailOptions = {
        from: emailUser,
        to: contactToEmail,
        replyTo: email,
        subject: `New Message from Portfolio: ${name.replace(/[\r\n]+/g, ' ')}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <h3>New Message from Portfolio</h3>
          <p><strong>Name:</strong> ${esc(name)}</p>
          <p><strong>Email:</strong> ${esc(email)}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #4ddbff;">
            ${esc(message).replace(/\n/g, '<br>')}
          </blockquote>
        `,
      };

      await transporter.sendMail(mailOptions);
      log('info', 'Contact message sent', 200);
      return NextResponse.json({ success: true, message: 'Message sent via email' });
    }

    log('error', 'Contact email transport is not configured', 503);
    return NextResponse.json(
      { error: 'Contact form is temporarily unavailable' },
      { status: 503 }
    );
  } catch (error) {
    console.error(JSON.stringify({
      level: 'error',
      message: 'Contact form request failed',
      route,
      requestId,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    }));
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
