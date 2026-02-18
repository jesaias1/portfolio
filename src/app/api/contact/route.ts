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
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contact data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    console.log('--- NEW CONTACT FORM SUBMISSION ---');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
    console.log('-----------------------------------');

    // Check for environment variables
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address (your app email)
        to: 'sunglazzez@gmail.com',   // Receiver address (hardcoded as requested)
        replyTo: email,               // Reply to the user's email
        subject: `New Message from Portfolio: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <h3>New Message from Portfolio</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #4ddbff;">
            ${message.replace(/\n/g, '<br>')}
          </blockquote>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully via Nodemailer');
      return NextResponse.json({ success: true, message: 'Message sent via email' });
    } else {
      console.log('Email credentials missing (EMAIL_USER/EMAIL_PASS). Logged to console only.');
      return NextResponse.json({ success: true, message: 'Message logged (email not configured)' });
    }

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
