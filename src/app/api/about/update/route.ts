import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    
    const about = await prisma.about.update({
      where: { id: '1' },
      data: {
        title: data.title,
        content: data.content,
        image: data.image,
        skills: JSON.stringify(data.skills),
      },
    });

    return NextResponse.json({
      ...about,
      skills: JSON.parse(about.skills),
    });
  } catch (error) {
    console.error('Error updating about:', error);
    return NextResponse.json({ error: 'Failed to update about section' }, { status: 500 });
  }
}
