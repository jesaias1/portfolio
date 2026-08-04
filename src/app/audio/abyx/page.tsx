import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AudioProductPage } from "@/components/audio/AudioProductPage";
import { getAudioProduct } from "@/data/audio-products";
import { createProjectMetadata } from "@/lib/seo";

const product = getAudioProduct("abyx");

export const metadata: Metadata = createProjectMetadata({
  title: "ABYX — Gamepad Music Instrument by Jesaias",
  description:
    "Turn Xbox and PlayStation controllers into musical instruments with ABYX, a VST3 gamepad-to-music instrument with a Windows standalone app.",
  path: "/audio/abyx",
  image: "/audio/products/abyx-screenshot.png",
  imageWidth: 1200,
  imageHeight: 760,
  imageAlt: "ABYX gamepad music instrument interface",
  keywords: ["ABYX", "VST3", "gamepad music", "Xbox controller", "PlayStation controller", "JUCE"],
});

export default function AbyxPage() {
  if (!product) notFound();

  return <AudioProductPage product={product} />;
}
