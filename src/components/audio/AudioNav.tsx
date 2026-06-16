import Image from "next/image";
import Link from "next/link";
import { audioProducts, audioSite } from "@/data/audio-products";

export function AudioNav() {
  return (
    <header className="audio-nav" aria-label="Jesaias Audio navigation">
      <Link href="/audio" className="audio-nav__brand" aria-label="Jesaias Audio home">
        <Image
          src="/audio/jesaias-audio-logo.png"
          alt=""
          width={220}
          height={160}
          priority
          className="audio-nav__mark"
        />
        <span>{audioSite.brand}</span>
      </Link>
      <nav className="audio-nav__links" aria-label="Audio site">
        {audioProducts.map((product) => (
          <Link key={product.slug} href={`/audio/${product.slug}`}>
            {product.name}
          </Link>
        ))}
        <Link href="/audio#updates">Updates</Link>
        <Link href="/audio#support">Support</Link>
      </nav>
      <a className="audio-nav__back" href={audioSite.urls.portfolio}>
        jesaias.dk
      </a>
    </header>
  );
}
