import Image from "next/image";
import Link from "next/link";

export function AudioNav() {
  return (
    <header className="audio-nav" aria-label="Jesaias Audio navigation">
      <Link href="/audio" className="audio-nav__home" aria-label="Go to Jesaias Audio home">
        Home
      </Link>
      <Link href="/audio" className="audio-nav__brand" aria-label="Jesaias Audio home">
        <Image
          src="/audio/jesaias-audio-logo.png"
          alt=""
          width={220}
          height={160}
          priority
          className="audio-nav__mark"
        />
      </Link>
    </header>
  );
}
