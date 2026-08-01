import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fallbackProjects } from '@/data/projects';

import { existsSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
    });

    const formattedProjects = projects.map(project => {
      // Check for video file
      // Derive filename from title: "Ordbomben" -> "ordbomben.mp4", "dump.media" -> "dump-media.mp4"
      const sanitizedTitle = project.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const videoFilename = `${sanitizedTitle}.mp4`;
      const videoPath = join(process.cwd(), 'public', 'projects', 'videos', videoFilename);
      const hasVideo = existsSync(videoPath);

      return {
        ...project,
        tags: JSON.parse(project.tags),
        video: hasVideo ? `/projects/videos/${videoFilename}` : null,
      };
    });

    const locallyAddedProjects = fallbackProjects.filter(
      (fallbackProject) =>
        !formattedProjects.some(
          (project) =>
            project.id === fallbackProject.id ||
            project.title.toLowerCase() === fallbackProject.title.toLowerCase()
        )
    );

    return NextResponse.json([...locallyAddedProjects, ...formattedProjects]);
  } catch {
    // The public portfolio remains usable in local previews and during a
    // temporary database outage. This catalog includes new projects such as ORVO.
    return NextResponse.json(fallbackProjects);
  }
}
