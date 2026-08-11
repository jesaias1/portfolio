"use client";

import type { CSSProperties, PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { audioProducts } from "@/data/audio-products";

type RackStyle = CSSProperties & {
  "--rack-tilt-x"?: string;
  "--rack-tilt-y"?: string;
  "--rack-shift-x"?: string;
  "--rack-shift-y"?: string;
};

const resetRackStyle: RackStyle = {
  "--rack-tilt-x": "0deg",
  "--rack-tilt-y": "0deg",
  "--rack-shift-x": "0px",
  "--rack-shift-y": "0px",
};

export function AudioHeroShowcase() {
  const [primary, secondary, tertiary] = audioProducts;

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

    event.currentTarget.style.setProperty("--rack-tilt-x", `${(-y * 5.5).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--rack-tilt-y", `${(x * 7).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--rack-shift-x", `${(x * 12).toFixed(2)}px`);
    event.currentTarget.style.setProperty("--rack-shift-y", `${(y * 8).toFixed(2)}px`);
  }

  function handlePointerLeave(event: PointerEvent<HTMLDivElement>) {
    Object.entries(resetRackStyle).forEach(([property, value]) => {
      event.currentTarget.style.setProperty(property, value);
    });
  }

  return (
    <div
      className="audio-hero__visual audio-rack"
      aria-label="Jesaias Audio product previews"
      style={resetRackStyle}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="audio-rack__backplane" aria-hidden="true">
        <span className="audio-rack__scan audio-rack__scan--one" />
        <span className="audio-rack__scan audio-rack__scan--two" />
        <div className="audio-rack__meter">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <Link
        href={`/audio/${primary.slug}`}
        className="audio-stack-card audio-stack-card--primary"
        style={{ "--product-accent": primary.accent } as CSSProperties}
      >
        <Image
          src={primary.assets.screenshot}
          alt={`${primary.name} product interface`}
          width={1672}
          height={941}
          priority
          sizes="(max-width: 900px) 92vw, 54vw"
        />
        <span>{primary.name}</span>
      </Link>

      <Link
        href={`/audio/${secondary.slug}`}
        className="audio-stack-card audio-stack-card--secondary"
        style={{ "--product-accent": secondary.accent } as CSSProperties}
      >
        <Image
          src={secondary.assets.screenshot}
          alt={`${secondary.name} product interface`}
          width={1200}
          height={760}
          sizes="(max-width: 900px) 48vw, 24vw"
        />
        <span>{secondary.name}</span>
      </Link>

      <Link
        href={`/audio/${tertiary.slug}`}
        className="audio-stack-card audio-stack-card--tertiary"
        style={{ "--product-accent": tertiary.accent } as CSSProperties}
      >
        <Image
          src={tertiary.assets.screenshot}
          alt={`${tertiary.name} product interface`}
          width={1200}
          height={760}
          sizes="(max-width: 900px) 42vw, 21vw"
        />
        <span>{tertiary.name}</span>
      </Link>

      <div className="audio-rack__floor" aria-hidden="true" />

      <div className="audio-hero__signal" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
