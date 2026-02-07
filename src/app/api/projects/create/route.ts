import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    
    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        longDesc: data.longDesc,
        image: data.image,
        tags: JSON.stringify(data.tags),
        link: data.link,
        github: data.github,
        featured: data.featured || false,
        order: data.order || 0,
      },
    });

    return NextResponse.json({
      ...project,
      tags: JSON.parse(project.tags),
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
