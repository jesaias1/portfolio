import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const about = await prisma.about.findFirst();

    if (!about) {
      return NextResponse.json({
        id: 'main',
        title: 'About Jesaias',
        content: '',
        image: '/headshot.jpg',
        skills: [],
      });
    }

    return NextResponse.json({
      ...about,
      skills: JSON.parse(about.skills),
    });
  } catch {
    return NextResponse.json({
      id: 'main',
      title: 'About Jesaias',
      content: '',
      image: '/headshot.jpg',
      skills: [],
    });
  }
}
