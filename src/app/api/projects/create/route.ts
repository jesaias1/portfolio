import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { encodeProjectMetadata } from '@/lib/project-metadata';
import { cleanMediaReference, isSafeMediaReference } from '@/lib/media-reference';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const image = cleanMediaReference(data.image);
    const video = cleanMediaReference(data.video);

    if (!isSafeMediaReference(image, true) || !isSafeMediaReference(video)) {
      return NextResponse.json({ error: 'Invalid project media path' }, { status: 400 });
    }
    
    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        longDesc: data.longDesc,
        image,
        tags: JSON.stringify(encodeProjectMetadata({ ...data, video })),
        link: data.link,
        github: data.github,
        featured: data.featured || false,
        order: data.order || 0,
      },
    });

    return NextResponse.json({
      ...project,
      tags: data.tags,
      status: data.status || 'Project',
      visible: data.visible !== false,
      video: video || null,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
