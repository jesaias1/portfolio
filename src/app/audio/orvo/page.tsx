import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AudioProductPage } from "@/components/audio/AudioProductPage";
import { getAudioProduct } from "@/data/audio-products";
import { createProjectMetadata } from "@/lib/seo";

const product = getAudioProduct("orvo");

export const metadata: Metadata = createProjectMetadata({
  title: "ORVO - Sample Transformation Instrument by Jesaias",
  description:
    "ORVO is a Windows x64 preview instrument for transforming samples into clouds, elastic rhythms, tape movement and granular textures.",
  path: "/audio/orvo",
  image: "/projects/orvo-mockup.png",
  imageWidth: 1672,
  imageHeight: 941,
  imageAlt: "ORVO sample-transformation instrument interface",
  keywords: ["ORVO", "VST3", "sample transformation", "granular synthesis", "JUCE", "audio plugin"],
});

export default function OrvoPage() {
  if (!product) notFound();

  return <AudioProductPage product={product} />;
}
