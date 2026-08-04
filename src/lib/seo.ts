import type { Metadata } from 'next';

export const SITE_URL = 'https://jesaias.dk';

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
      siteName: 'Jesaias — Creative Developer',
      title,
      description,
      images: [{ url: image, width: imageWidth, height: imageHeight, alt: imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
