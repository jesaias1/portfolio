import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AudioProductPage } from "@/components/audio/AudioProductPage";
import { getAudioProduct } from "@/data/audio-products";
import { createProjectMetadata } from "@/lib/seo";

const product = getAudioProduct("midium");

export const metadata: Metadata = createProjectMetadata({
  title: "MIDIUM — Visual MIDI Instrument by Jesaias",
  description:
    "Draw MIDI and shape ideas directly with MIDIUM, a VST3 visual MIDI instrument with a Windows standalone app.",
  path: "/audio/midium",
  image: "/audio/products/midium-screenshot.png",
  imageWidth: 1200,
  imageHeight: 760,
  imageAlt: "MIDIUM visual MIDI instrument interface",
  keywords: ["MIDIUM", "VST3", "MIDI generator", "visual MIDI", "JUCE", "music software"],
});

export default function MidiumPage() {
  if (!product) notFound();

  return <AudioProductPage product={product} />;
}
