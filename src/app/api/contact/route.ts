import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Log to console (simulating email sending/database save)
    console.log('--- NEW CONTACT FORM SUBMISSION ---');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
    console.log('-----------------------------------');

    // In the future: Save to database or send via Email service (Resend/SendGrid)
    
    return NextResponse.json({ success: true, message: 'Message received' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
