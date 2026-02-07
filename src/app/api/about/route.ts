import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const about = await prisma.about.findFirst();

    if (!about) {
      return NextResponse.json({ error: 'About section not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...about,
      skills: JSON.parse(about.skills),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch about data' }, { status: 500 });
  }
}
