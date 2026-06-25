import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AudioProductPage } from "@/components/audio/AudioProductPage";
import { getAudioProduct } from "@/data/audio-products";

const product = getAudioProduct("abyx");

export const metadata: Metadata = {
  title: "ABYX - Jesaias Audio",
  description:
    "Turn Xbox and PlayStation controllers into musical instruments with ABYX, a Windows VST3 and standalone gamepad-to-music instrument.",
  alternates: {
    canonical: "/audio/abyx",
  },
  openGraph: {
    title: "ABYX - Your controller is now a musical instrument.",
    description:
      "A Windows VST3 and standalone gamepad music instrument for assigning sounds, instruments and effects to a controller.",
    url: "https://jesaias.dk/audio/abyx",
    images: [
      {
        url: "/audio/products/abyx-screenshot.png",
        width: 1200,
        height: 760,
        alt: "ABYX interface screenshot",
      },
    ],
  },
};

export default function AbyxPage() {
  if (!product) notFound();

  return <AudioProductPage product={product} />;
}
