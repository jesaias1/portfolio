import type { Metadata } from "next";
import "./audio.css";

export const metadata: Metadata = {
  title: "Jesaias Audio - Windows Music Software",
  description:
    "Independent Windows music software for drawing, performing and discovering new ideas. Home of MIDIUM and ABYX.",
  alternates: {
    canonical: "/audio",
  },
  openGraph: {
    title: "Jesaias Audio",
    description:
      "Tools that make music feel playable. Independent Windows music software by Jesaias.",
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
    description: "Tools that make music feel playable on Windows.",
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
