"use client";

import type { CSSProperties, PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { audioProducts } from "@/data/audio-products";

type StageStyle = CSSProperties & {
  "--tilt-x"?: string;
  "--tilt-y"?: string;
};

const resetStage: StageStyle = { "--tilt-x": "0deg", "--tilt-y": "0deg" };

export function AudioHeroShowcase() {
  const [primary, secondary, tertiary] = audioProducts;

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    event.currentTarget.style.setProperty("--tilt-x", `${(-y * 3).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${(x * 4).toFixed(2)}deg`);
  }

  function handlePointerLeave(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <div
      className="stage"
      aria-label="Jesaias Audio product previews"
      style={resetStage}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="stage__glow" aria-hidden="true" />
      <Link
        href={`/audio/${primary.slug}`}
        className="stage__card stage__card--primary"
        style={{ "--product-accent": primary.accent } as CSSProperties}
      >
        <Image
          src={primary.assets.screenshot}
          alt={`${primary.name} product interface`}
          width={1672}
          height={941}
          priority
          sizes="(max-width: 960px) 92vw, 52vw"
        />
        <span className="stage__tag">{primary.name}</span>
      </Link>
      <Link
        href={`/audio/${secondary.slug}`}
        className="stage__card stage__card--secondary"
        style={{ "--product-accent": secondary.accent } as CSSProperties}
      >
        <Image
          src={secondary.assets.screenshot}
          alt={`${secondary.name} product interface`}
          width={1200}
          height={760}
          sizes="(max-width: 960px) 50vw, 26vw"
        />
        <span className="stage__tag">{secondary.name}</span>
      </Link>
      <Link
        href={`/audio/${tertiary.slug}`}
        className="stage__card stage__card--tertiary"
        style={{ "--product-accent": tertiary.accent } as CSSProperties}
      >
        <Image
          src={tertiary.assets.screenshot}
          alt={`${tertiary.name} product interface`}
          width={1200}
          height={760}
          sizes="(max-width: 960px) 44vw, 22vw"
        />
        <span className="stage__tag">{tertiary.name}</span>
      </Link>
    </div>
  );
}
