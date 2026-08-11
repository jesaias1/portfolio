import type { Metadata } from 'next';

export const SITE_URL = 'https://www.jesaias.dk';

export function createProjectMetadata({
  title,
  description,
  path,
  image,
  imageWidth,
  imageHeight,
  imageAlt,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  keywords: string[];
}): Metadata {
  const canonical = `${SITE_URL}${path}`;

  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonical,
      siteName: 'Linas Jesaias - Creative Product Builder',
      title,
      description,
      images: [
        {
          url: image,
          secureUrl: image.startsWith('http') ? image : `${SITE_URL}${image}`,
          type: image.endsWith('.png') ? 'image/png' : 'image/jpeg',
          width: imageWidth,
          height: imageHeight,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
