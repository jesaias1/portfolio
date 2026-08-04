import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { encodeProjectMetadata } from '@/lib/project-metadata';
import { cleanMediaReference, isSafeMediaReference } from '@/lib/media-reference';

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = await context.params;
    const data = await req.json();
    const image = cleanMediaReference(data.image);
    const video = cleanMediaReference(data.video);

    if (!isSafeMediaReference(image, true) || !isSafeMediaReference(video)) {
      return NextResponse.json({ error: 'Invalid project media path' }, { status: 400 });
    }
    
    const values = {
      title: data.title,
      description: data.description,
      longDesc: data.longDesc,
      image,
      tags: JSON.stringify(encodeProjectMetadata({ ...data, video })),
      link: data.link,
      github: data.github,
      featured: data.featured,
      order: data.order,
    };

    const project = await prisma.project.upsert({
      where: { id: params.id },
      update: values,
      create: { id: params.id, ...values },
    });

    return NextResponse.json({
      ...project,
      tags: data.tags,
      status: data.status || 'Project',
      visible: data.visible !== false,
      video: video || null,
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = await context.params;
    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
