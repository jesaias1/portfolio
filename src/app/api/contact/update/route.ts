import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    
    const existing = await prisma.contact.findFirst({ select: { id: true } });
    const values = {
      email: data.email || 'contact@jesaias.dk',
      github: data.github || null,
      linkedin: data.linkedin || null,
      twitter: data.twitter || null,
      resume: data.resume || null,
    };
    const contact = existing
      ? await prisma.contact.update({ where: { id: existing.id }, data: values })
      : await prisma.contact.create({ data: { id: 'main', ...values } });

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: 'Failed to update contact info' }, { status: 500 });
  }
}
