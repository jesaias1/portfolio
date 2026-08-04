export const projectStatuses = [
  'Live',
  'Beta',
  'In development',
  'Under maintenance',
  'Concept',
  'Archived',
] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

const metadataPrefix = '__portfolio:';

type ProjectMetadata = {
  tags: string[];
  status: ProjectStatus | 'Project';
  visible: boolean;
  video?: string;
};

const legacyPolicy = (title: string, id = '') => {
  const key = `${title} ${id}`.toLowerCase();
  if (key.includes('stickman') || key.includes('stick fighting')) {
    return { visible: false, status: 'Archived' as const };
  }
  if (key.includes('ordbomben') || key.includes('dump') || key.includes('moonana')) {
    return { visible: true, status: 'Under maintenance' as const };
  }
  if (key.includes('orvo')) return { visible: true, status: 'In development' as const };
  if (key.includes('midium') || key.includes('abyx')) return { visible: true, status: 'Beta' as const };
  if (key.includes('kvizy') || key.includes('lettus')) return { visible: true, status: 'Live' as const };
  return { visible: true, status: undefined };
};

export function decodeProjectMetadata(rawTags: string[], title: string, id = ''): ProjectMetadata {
  const policy = legacyPolicy(title, id);
  const tags: string[] = [];
  let status: ProjectMetadata['status'] | undefined;
  let visible: boolean | undefined;
  let video: string | undefined;

  for (const tag of rawTags) {
    if (!tag.startsWith(metadataPrefix)) {
      tags.push(tag);
      continue;
    }

    const [key, encodedValue = ''] = tag.slice(metadataPrefix.length).split('=', 2);
    const value = safeDecode(encodedValue);
    if (key === 'status' && [...projectStatuses, 'Project'].includes(value as ProjectStatus)) {
      status = value as ProjectMetadata['status'];
    }
    if (key === 'visible') visible = value !== 'false';
    if (key === 'video') video = value || undefined;
  }

  return {
    tags,
    status: status ?? policy.status ?? 'Project',
    visible: visible ?? policy.visible,
    video,
  };
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function encodeProjectMetadata({
  tags,
  status,
  visible,
  video,
}: {
  tags: string[];
  status?: string;
  visible?: boolean;
  video?: string;
}) {
  const cleanTags = tags.filter((tag) => !tag.startsWith(metadataPrefix));
  return [
    ...cleanTags,
    `${metadataPrefix}status=${encodeURIComponent(status || 'Project')}`,
    `${metadataPrefix}visible=${String(visible !== false)}`,
    ...(video?.trim() ? [`${metadataPrefix}video=${encodeURIComponent(video.trim())}`] : []),
  ];
}
