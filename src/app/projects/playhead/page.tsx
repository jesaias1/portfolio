import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ClickToPlayVideo from "@/components/ClickToPlayVideo";
import ProjectNavigation from "@/components/ProjectNavigation";
import { createProjectMetadata } from "@/lib/seo";
import styles from "./playhead.module.css";

export const metadata: Metadata = createProjectMetadata({
  title: "Playhead — A Game That Turns Your Music Into a World by Jesaias",
  description:
    "A case study of Playhead, a free first-person browser game that analyses any song and builds a 3D world to strafe and surf through.",
  path: "/projects/playhead",
  image: "/og-playhead.png",
  imageWidth: 1200,
  imageHeight: 630,
  imageAlt: "Playhead first-person surf run through a song-generated world",
  keywords: ["Playhead", "music game", "browser game", "Three.js", "Web Audio", "procedural world", "surf game"],
});

const stages = [
  ["The song ahead", "Dormant, dark architecture rises out of the haze, built from the part of the track you have not reached yet."],
  ["The now-line", "Structures ignite as you arrive at their exact moment in the song, so the world reacts to where the music is."],
  ["The song behind", "What you have passed cools into twilight and fades back into fog."],
  ["The drops", "Major drops become set pieces: split monoliths, cathedrals and bridges, with the sky clearing as they hit."],
];

const details = [
  ["Any", "audio file becomes a course"],
  ["4", "frequency bands analysed"],
  ["4–10", "movement zones per song"],
  ["100%", "free to play"],
];

export default function PlayheadCaseStudy() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Playhead",
    description:
      "A free first-person browser game that turns any song into a procedural 3D world to strafe and surf through.",
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    isAccessibleForFree: true,
    author: {
      "@type": "Person",
      name: "Jesaias",
      url: "https://www.jesaias.dk",
    },
  };

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <nav className={styles.nav} aria-label="Playhead case study navigation">
        <Link href="/#projects" className={styles.back}>← Portfolio</Link>
        <span className={styles.wordmark}>playhead</span>
        <a href="/play/playhead" target="_blank" rel="noopener noreferrer" className={styles.live}>
          Play now ↗
        </a>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Case study / game / 2026</p>
          <h1>Your music,<br /><em>as a place.</em></h1>
          <p className={styles.lead}>
            Playhead turns any song you drop in into a 3D world. You are the playhead, strafing and
            surfing through your own music in first person, right in the browser.
          </p>
          <div className={styles.actions}>
            <a href="/play/playhead" target="_blank" rel="noopener noreferrer" className={styles.primary}>
              Play for free ↗
            </a>
            <a href="#ad" className={styles.secondary}>Watch the ad</a>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <Image
            src="/projects/playhead-v2.webp"
            alt="Playhead first-person surf run"
            width={1672}
            height={941}
            priority
            sizes="(max-width: 900px) 94vw, 54vw"
            className={styles.shot}
          />
        </div>
      </section>

      <section className={styles.metrics} aria-label="Playhead highlights">
        {details.map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className={styles.story}>
        <div>
          <p className={styles.eyebrow}>The idea</p>
          <h2>The song becomes a place.</h2>
        </div>
        <div className={styles.storyBody}>
          <p>
            Most music games play a track and ask you to hit what it tells you to. Playhead does
            the opposite: it listens to the track first, then builds the space you will move
            through from what it hears.
          </p>
          <p>
            Audio is analysed client-side with the Web Audio API: multi-band frequency splitting,
            onset detection and tempo estimation. That analysis drives the architecture, the
            route and the moments the world reacts.
          </p>
        </div>
      </section>

      <section className={styles.stages} aria-labelledby="stages-title">
        <p className={styles.eyebrow}>How a song plays</p>
        <h2 id="stages-title">Ahead, now, behind.</h2>
        <div className={styles.stageGrid}>
          {stages.map(([title, copy], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="ad" className={styles.watch} aria-labelledby="watch-title">
        <p className={styles.eyebrow}>The ad</p>
        <h2 id="watch-title">Drop a song. Enter it.</h2>
        <ClickToPlayVideo
          src="/projects/videos/playhead-ad-v2.mp4"
          poster="/projects/playhead-v2.webp"
          label="Playhead ad, 28 seconds"
          buttonLabel="Watch the ad"
          accent="#9dff4a"
          className={styles.adPlayer}
        />
      </section>

      <section className={styles.technical}>
        <div>
          <p className={styles.eyebrow}>Under the surface</p>
          <h2>Built for the browser.</h2>
        </div>
        <ul>
          <li><strong>Real audio analysis</strong><span>FFT, spectral flux onsets and tempo estimation run on the song you provide, on your device.</span></li>
          <li><strong>Procedural worlds</strong><span>Each song generates its own route, architecture and drop set pieces.</span></li>
          <li><strong>Three.js + TypeScript</strong><span>A typed, tested real-time 3D engine built with Vite and Vitest.</span></li>
          <li><strong>Free to play</strong><span>No install. Drop a track and run.</span></li>
        </ul>
      </section>

      <section className={styles.closing}>
        <p className={styles.eyebrow}>Ready when the track is</p>
        <h2>Become the playhead.</h2>
        <a href="/play/playhead" target="_blank" rel="noopener noreferrer" className={styles.primary}>
          Play Playhead ↗
        </a>
      </section>
      <ProjectNavigation currentSlug="playhead" accent="#9dff4a" />
    </main>
  );
}
