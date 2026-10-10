import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ClickToPlayVideo from "@/components/ClickToPlayVideo";
import ProjectNavigation from "@/components/ProjectNavigation";
import { createProjectMetadata } from "@/lib/seo";
import styles from "./lettus.module.css";

export const metadata: Metadata = createProjectMetadata({
  title: "Lettus — A Free Grid Word Game by Jesaias",
  description:
    "A case study of Lettus, a free browser word game: pick a letter, build words in every direction and outscore an AI or friends on one screen.",
  path: "/projects/lettus",
  image: "/og-lettus.png",
  imageWidth: 1200,
  imageHeight: 630,
  imageAlt: "Lettus grid word game interface",
  keywords: ["Lettus", "word game", "browser game", "multiplayer word game", "grid game", "free to play"],
});

const steps = [
  ["Pick a letter", "Choose from the keyboard and drop it onto your grid."],
  ["Build a word", "Make words across, down and even backwards."],
  ["Score everything", "Every word on your grid scores, so one letter can score twice."],
  ["Take the win", "Fill the grid first. The highest score wins."],
];

const details = [
  ["5×5", "letter grid"],
  ["3", "ways to play"],
  ["4", "players on one screen"],
  ["0", "downloads needed"],
];

export default function LettusCaseStudy() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Lettus",
    description:
      "A free grid word game for the browser: solo against an AI, 2-4 players on one screen, or a 1v1 online duel.",
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    isAccessibleForFree: true,
    url: "https://www.lettus.fun",
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
      <nav className={styles.nav} aria-label="Lettus case study navigation">
        <Link href="/#projects" className={styles.back}>← Portfolio</Link>
        <span className={styles.wordmark}>lettus</span>
        <a href="https://www.lettus.fun" target="_blank" rel="noopener noreferrer" className={styles.live}>
          Play at lettus.fun ↗
        </a>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Case study / game / 2026</p>
          <h1>Pick a letter.<br /><em>Build a word.</em></h1>
          <p className={styles.lead}>
            Lettus is a free grid word game. Build words in every direction, score for every word on
            your grid and outscore an AI, a friend on the same screen, or a 1v1 online rival.
          </p>
          <div className={styles.actions}>
            <a href="https://www.lettus.fun" target="_blank" rel="noopener noreferrer" className={styles.primary}>
              Play for free ↗
            </a>
            <a href="#ad" className={styles.secondary}>Watch the ad</a>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <Image
            src="/projects/lettus-thumb.webp"
            alt="Lettus game board with a solo game in progress"
            width={1672}
            height={941}
            priority
            sizes="(max-width: 900px) 94vw, 54vw"
            className={styles.shot}
          />
        </div>
      </section>

      <section className={styles.metrics} aria-label="Lettus highlights">
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
          <h2>Simple to start. Hard to put down.</h2>
        </div>
        <div className={styles.storyBody}>
          <p>
            Lettus keeps the rules small: one grid, one letter at a time. The depth comes from
            direction. Words can run across, down and backwards, and every word on the grid counts.
          </p>
          <p>
            It plays where people already are: free, in the browser, with no download. Sit down
            alone against the AI, pass one screen between two to four players, or duel a friend
            online.
          </p>
        </div>
      </section>

      <section className={styles.stages} aria-labelledby="steps-title">
        <p className={styles.eyebrow}>How a round plays</p>
        <h2 id="steps-title">Four moves to a win.</h2>
        <div className={styles.stageGrid}>
          {steps.map(([title, copy], index) => (
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
        <h2 id="watch-title">Free to play. No download.</h2>
        <ClickToPlayVideo
          src="/projects/videos/lettus-ad-v2.mp4"
          poster="/projects/lettus-thumb.webp"
          label="Lettus ad, 24 seconds"
          buttonLabel="Watch the ad"
          accent="#7ddb3f"
          className={styles.adPlayer}
        />
      </section>

      <section className={styles.technical}>
        <div>
          <p className={styles.eyebrow}>Under the surface</p>
          <h2>Built for quick rounds.</h2>
        </div>
        <ul>
          <li><strong>Three ways to play</strong><span>Solo against an AI, 2–4 players on one screen, or a 1v1 online duel.</span></li>
          <li><strong>Every direction</strong><span>Word detection across rows, columns and backwards, with every word on the grid scored.</span></li>
          <li><strong>React + TypeScript</strong><span>A typed game-logic core behind a fast, mobile-friendly interface.</span></li>
          <li><strong>Free to play</strong><span>Open lettus.fun and start. Nothing to install.</span></li>
        </ul>
      </section>

      <section className={styles.closing}>
        <p className={styles.eyebrow}>Your move</p>
        <h2>Fill the grid. Take the win.</h2>
        <a href="https://www.lettus.fun" target="_blank" rel="noopener noreferrer" className={styles.primary}>
          Play Lettus ↗
        </a>
      </section>
      <ProjectNavigation currentSlug="lettus" accent="#7ddb3f" />
    </main>
  );
}
