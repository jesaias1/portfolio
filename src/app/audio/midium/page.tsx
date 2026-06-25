import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AudioProductPage } from "@/components/audio/AudioProductPage";
import { getAudioProduct } from "@/data/audio-products";

const product = getAudioProduct("midium");

export const metadata: Metadata = {
  title: "MIDIUM - Jesaias Audio",
  description:
    "Draw MIDI and shape ideas directly with MIDIUM, a VST3 visual MIDI instrument with a Windows standalone app.",
  alternates: {
    canonical: "/audio/midium",
  },
  openGraph: {
    title: "MIDIUM - Draw MIDI. Shape ideas directly.",
    description:
      "A VST3 visual MIDI instrument with a Windows standalone app for creating melodies, basslines, drums and patterns by drawing.",
    url: "https://jesaias.dk/audio/midium",
    images: [
      {
        url: "/audio/products/midium-screenshot.png",
        width: 1200,
        height: 760,
        alt: "MIDIUM interface screenshot",
      },
    ],
  },
};

export default function MidiumPage() {
  if (!product) notFound();

  return <AudioProductPage product={product} />;
}
