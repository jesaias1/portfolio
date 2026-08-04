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
    
    const existing = await prisma.about.findFirst({ select: { id: true } });
    const values = {
      title: data.title || 'About Jesaias',
      content: data.content || '',
      image: data.image || '/headshot.jpg',
      skills: JSON.stringify(data.skills || []),
    };
    const about = existing
      ? await prisma.about.update({ where: { id: existing.id }, data: values })
      : await prisma.about.create({ data: { id: 'main', ...values } });

    return NextResponse.json({
      ...about,
      skills: JSON.parse(about.skills),
    });
  } catch (error) {
    console.error('Error updating about:', error);
    return NextResponse.json({ error: 'Failed to update about section' }, { status: 500 });
  }
}
