import type { Metadata } from "next";
import "./audio.css";

export const metadata: Metadata = {
  title: "Jesaias Audio - Music Software",
  description:
    "Independent music software for drawing, performing and discovering new ideas. Home of MIDIUM and ABYX.",
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
        url: "/audio/products/midium-screenshot.png",
        width: 1200,
        height: 760,
        alt: "MIDIUM music software interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jesaias Audio",
    description: "Tools that make music feel playable.",
    images: ["/audio/products/midium-screenshot.png"],
  },
};

export default function AudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
