import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    const contact = await prisma.contact.findFirst();

    if (!contact) {
      return NextResponse.json({ error: 'Contact info not found' }, { status: 404 });
    }

    return NextResponse.json(contact);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch contact data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (
      !name ||
      !email ||
      !message ||
      name.length > 100 ||
      email.length > 254 ||
      message.length > 5000 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json({ error: 'Invalid contact form submission' }, { status: 400 });
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const contactToEmail = process.env.CONTACT_TO_EMAIL;

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
        subject: `New Message from Portfolio: ${name}`,
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
      return NextResponse.json({ success: true, message: 'Message sent via email' });
    }

    return NextResponse.json(
      { error: 'Contact form is temporarily unavailable' },
      { status: 503 }
    );
  } catch (error) {
    console.error('Contact form request failed', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
