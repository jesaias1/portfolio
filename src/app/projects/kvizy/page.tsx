import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ProjectNavigation from "@/components/ProjectNavigation";
import { createProjectMetadata } from "@/lib/seo";
import styles from "./kvizy.module.css";

export const metadata: Metadata = createProjectMetadata({
  title: "KVIZY — Danish Offline Multiplayer Quiz by Jesaias",
  description:
    "A case study of KVIZY, a Danish offline-first pass-the-device quiz game designed for game nights on one shared screen.",
  path: "/projects/kvizy",
  image: "/projects/kvizy-mockup.png",
  imageWidth: 1672,
  imageHeight: 941,
  imageAlt: "KVIZY Danish multiplayer quiz interface",
  keywords: ["KVIZY", "Danish quiz", "multiplayer quiz", "offline PWA", "Next.js game", "game night"],
});

const modes = [
  ["Classic", "A balanced quiz night with categories, turns and a shared scoreboard."],
  ["Quick", "Shorter rounds for an immediate game without a long setup."],
  ["Risk", "Decisions matter more when the next answer can change the table."],
  ["Mystery", "A more unpredictable mix built for replayable group sessions."],
];

const details = [
  ["1,439", "curated Danish questions"],
  ["4", "distinct game modes"],
  ["1", "shared screen required"],
  ["0", "accounts or installations"],
];

export default function KvizyCaseStudy() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "KVIZY",
    description:
      "A Danish offline-first pass-the-device multiplayer quiz for game nights on one shared screen.",
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    inLanguage: "da-DK",
    isAccessibleForFree: true,
    url: "https://kvizy.dk",
    author: {
      "@type": "Person",
      name: "Jesaias",
      url: "https://jesaias.dk",
    },
  };

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <nav className={styles.nav} aria-label="KVIZY case study navigation">
        <Link href="/#projects" className={styles.back}>← Portfolio</Link>
        <span className={styles.wordmark}>KVIZY</span>
        <a href="https://kvizy.dk" target="_blank" rel="noopener noreferrer" className={styles.live}>
          Play at kvizy.dk ↗
        </a>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Case study / game design / 2026</p>
          <h1>Quiz night,<br /><em>without the setup.</em></h1>
          <p className={styles.lead}>
            KVIZY turns one phone, tablet or laptop into a complete Danish multiplayer quiz.
            Add players, pass the screen and start playing—even without a connection.
          </p>
          <div className={styles.actions}>
            <a href="https://kvizy.dk" target="_blank" rel="noopener noreferrer" className={styles.primary}>
              Start a game ↗
            </a>
            <a href="#inside" className={styles.secondary}>See how it works</a>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.orbit} aria-hidden="true">
            <span>🦊</span><span>🌍</span><span>🎵</span><span>💻</span>
          </div>
          <div className={styles.screen}>
            <Image
              src="/projects/kvizy-mockup.png"
              alt="KVIZY start screen"
              fill
              priority
              sizes="(max-width: 900px) 94vw, 54vw"
              className={styles.screenImage}
            />
          </div>
        </div>
      </section>

      <section className={styles.metrics} aria-label="KVIZY project highlights">
        {details.map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section id="inside" className={styles.story}>
        <div className={styles.storyIntro}>
          <p className={styles.eyebrow}>The idea</p>
          <h2>Built for people in the same room.</h2>
        </div>
        <div className={styles.storyBody}>
          <p>
            Most quiz products begin with accounts, room codes and several phones. KVIZY begins
            with the group already around the table. One device becomes the host, game board and
            scorekeeper.
          </p>
          <p>
            The interface is intentionally bold and readable from a distance. Turn prompts,
            answer states and score changes are designed to keep attention on the people—not on
            managing software.
          </p>
        </div>
      </section>

      <section className={styles.modes} aria-labelledby="modes-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Four ways to play</p>
          <h2 id="modes-title">Same room. Different energy.</h2>
        </div>
        <div className={styles.modeGrid}>
          {modes.map(([title, copy], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.technical}>
        <div>
          <p className={styles.eyebrow}>Under the surface</p>
          <h2>Fast enough to disappear.</h2>
        </div>
        <ul>
          <li><strong>Offline-first PWA</strong><span>The complete game remains available after the first visit.</span></li>
          <li><strong>Adaptive difficulty</strong><span>Question flow can respond to the pace and history of a session.</span></li>
          <li><strong>Local game state</strong><span>Players, scores, history and rematches live on the shared device.</span></li>
          <li><strong>Next.js + TypeScript</strong><span>A typed, testable foundation for a content-heavy game.</span></li>
        </ul>
      </section>

      <section className={styles.closing}>
        <p className={styles.eyebrow}>Ready when the group is</p>
        <h2>Quiz-aftenen starter her.</h2>
        <a href="https://kvizy.dk" target="_blank" rel="noopener noreferrer" className={styles.primary}>
          Open KVIZY ↗
        </a>
      </section>
      <ProjectNavigation currentSlug="kvizy" accent="#ff641f" />
    </main>
  );
}
