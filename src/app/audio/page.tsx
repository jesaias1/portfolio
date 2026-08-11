import type { Metadata } from "next";
import { AudioLanding } from "@/components/audio/AudioLanding";
import { createProjectMetadata } from "@/lib/seo";

export const metadata: Metadata = createProjectMetadata({
  title: "Jesaias Audio - Music Software Tools",
  description:
    "Independent music software by Jesaias: ORVO, MIDIUM and ABYX for sample transformation, visual MIDI and controller-based music workflows.",
  path: "/audio",
  image: "/og-audio-2026.png",
  imageWidth: 1200,
  imageHeight: 630,
  imageAlt: "Jesaias Audio social preview with ORVO, MIDIUM and ABYX product mockups",
  keywords: ["Jesaias Audio", "ORVO", "MIDIUM", "ABYX", "music software", "VST3", "JUCE"],
});

export default function AudioPage() {
  return <AudioLanding />;
}
