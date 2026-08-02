import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fallbackProjects, type PortfolioProject } from '@/data/projects';
import { decodeProjectMetadata } from '@/lib/project-metadata';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

import { existsSync } from 'fs';
import { join } from 'path';

export async function GET(request: Request) {
  const requestedMode = new URL(request.url).searchParams;
  const wantsPrivateCatalogue = requestedMode.has('admin') || requestedMode.has('preview');
  const session = wantsPrivateCatalogue
    ? await getServerSession(authOptions).catch(() => null)
    : null;
  const includeHidden = Boolean(session);

  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
    });

    const formattedProjects: PortfolioProject[] = projects.map(project => {
      // Check for video file
      // Derive filename from title: "Ordbomben" -> "ordbomben.mp4", "dump.media" -> "dump-media.mp4"
      const sanitizedTitle = project.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const videoFilename = `${sanitizedTitle}.mp4`;
      const videoPath = join(process.cwd(), 'public', 'projects', 'videos', videoFilename);
      const hasVideo = existsSync(videoPath);

      const metadata = decodeProjectMetadata(JSON.parse(project.tags), project.title, project.id);

      return {
        ...project,
        longDesc: project.longDesc ?? undefined,
        link: project.link ?? undefined,
        github: project.github ?? undefined,
        tags: metadata.tags,
        status: metadata.status,
        visible: metadata.visible,
        video: metadata.video ?? (hasVideo ? `/projects/videos/${videoFilename}` : null),
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

    return catalogueResponse([...locallyAddedProjects, ...formattedProjects], includeHidden);
  } catch {
    // The public portfolio remains usable in local previews and during a
    // temporary database outage. This catalog includes new projects such as ORVO.
    return catalogueResponse(fallbackProjects, includeHidden);
  }
}

function catalogueResponse(projects: typeof fallbackProjects, includeHidden: boolean) {
  const catalogue = includeHidden ? projects : projects.filter((project) => project.visible !== false);
  return NextResponse.json(catalogue, {
    headers: {
      'Cache-Control': includeHidden ? 'private, no-store' : 'public, max-age=60, stale-while-revalidate=300',
      'X-Portfolio-Preview': String(includeHidden),
    },
  });
}
