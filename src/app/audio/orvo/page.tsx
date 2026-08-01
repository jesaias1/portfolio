import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AudioProductPage } from "@/components/audio/AudioProductPage";
import { getAudioProduct } from "@/data/audio-products";

const product = getAudioProduct("orvo");

export const metadata: Metadata = {
  title: "ORVO - Jesaias Audio",
  description:
    "ORVO is a sample-transformation instrument for stretching, freezing, granulating and rhythmically reshaping sound.",
  alternates: {
    canonical: "/audio/orvo",
  },
  openGraph: {
    title: "ORVO - Stretch sound until it becomes something else.",
    description:
      "A VST3 sample-transformation instrument with Cloud, Elastic, Tape and Grain engines, PULSE sequencing, LFOs and effects.",
    url: "https://jesaias.dk/audio/orvo",
    images: [
      {
        url: "/projects/orvo.png",
        width: 1600,
        height: 1000,
        alt: "ORVO sample-transformation instrument interface",
      },
    ],
  },
};

export default function OrvoPage() {
  if (!product) notFound();

  return <AudioProductPage product={product} />;
}
