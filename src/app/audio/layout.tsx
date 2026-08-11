import type { Metadata } from "next";
import "./audio.css";

export const metadata: Metadata = {
  title: "Jesaias Audio - Music Software",
  description:
    "Independent music software for drawing, performing and discovering new ideas. Home of ORVO, MIDIUM and ABYX.",
  alternates: {
    canonical: "/audio",
  },
  openGraph: {
    title: "Jesaias Audio",
    description:
      "Tools that make music feel playable. Independent music software by Jesaias.",
    url: "https://jesaias.dk/audio",
    siteName: "Jesaias Audio",
    images: [
      {
        url: "/og-audio-2026.png",
        width: 1200,
        height: 630,
        alt: "Jesaias Audio social preview with ORVO, MIDIUM and ABYX product mockups",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jesaias Audio",
    description: "Tools that make music feel playable.",
    images: ["/og-audio-2026.png"],
  },
};

export default function AudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
