import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { audioProducts, audioSite } from "@/data/audio-products";

export function AudioNav() {
  return (
    <header className="anav">
      <div className="anav__bar">
        <Link href="/audio" className="anav__brand" aria-label="Jesaias Audio home">
          <Image
            src="/audio/jesaias-audio-logo.png"
            alt=""
            width={220}
            height={160}
            priority
            className="anav__mark"
          />
          <span>
            Jesaias <b>Audio</b>
          </span>
        </Link>

        <nav className="anav__links" aria-label="Audio site">
          <div className="anav__menu">
            <Link href="/audio#catalogue" className="anav__trigger">
              Products
            </Link>
            <div className="anav__panel">
              {audioProducts.map((product) => (
                <Link
                  key={product.slug}
                  href={`/audio/${product.slug}`}
                  className="anav__product"
                  style={{ "--product-accent": product.accent } as CSSProperties}
                >
                  <Image
                    src={product.assets.screenshot}
                    alt=""
                    width={160}
                    height={100}
                    sizes="96px"
                  />
                  <span>
                    <strong>{product.name}</strong>
                    <em>{product.kicker}</em>
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <Link href="/audio#downloads">Downloads</Link>
          <Link href="/audio#updates">Updates</Link>
          <Link href="/audio#support">Support</Link>
        </nav>

        <div className="anav__side">
          <a href={audioSite.urls.portfolio} className="anav__ghost">
            Portfolio
          </a>
          <Link href="/audio#downloads" className="anav__cta">
            Get started
          </Link>
        </div>

        <details className="anav__mobile">
          <summary aria-label="Open menu">
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </summary>
          <div className="anav__drawer">
            {audioProducts.map((product) => (
              <Link key={product.slug} href={`/audio/${product.slug}`}>
                {product.name}
              </Link>
            ))}
            <Link href="/audio#downloads">Downloads</Link>
            <Link href="/audio#updates">Updates</Link>
            <Link href="/audio#support">Support</Link>
            <a href={audioSite.urls.portfolio}>Portfolio</a>
          </div>
        </details>
      </div>
    </header>
  );
}
