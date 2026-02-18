import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { existsSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
    });

    const formattedProjects = projects.map(project => {
      // Check for video file
      const videoFilename = `${project.image.split('/').pop()?.replace(/\.[^/.]+$/, '')}.mp4`;
      const videoPath = join(process.cwd(), 'public', 'projects', 'videos', videoFilename);
      const hasVideo = existsSync(videoPath);

      return {
        ...project,
        tags: JSON.parse(project.tags),
        video: hasVideo ? `/projects/videos/${videoFilename}` : null,
      };
    });

    return NextResponse.json(formattedProjects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
