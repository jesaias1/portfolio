import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { AutoAdVideo } from "@/components/audio/AutoAdVideo";
import { AudioFooter } from "@/components/audio/AudioLanding";
import { AudioNav } from "@/components/audio/AudioNav";
import ProjectNavigation from "@/components/ProjectNavigation";
import { type AudioProduct } from "@/data/audio-products";

type ProductPageCopy = {
  heroNote: string;
  snapshotTitle: string;
  snapshotCopy: string;
  focus: string;
  workflow: string;
  status: string;
  accessCopy: string;
};

const productPageCopy: Record<AudioProduct["slug"], ProductPageCopy> = {
  orvo: {
    heroNote: "Standalone preview build available for Windows x64.",
    snapshotTitle: "A sound-design instrument built around movement.",
    snapshotCopy:
      "ORVO is presented as a preview build: the interface, product direction and standalone installer are ready to test while plugin compatibility, audio examples and release packaging continue to evolve.",
    focus: "Transforming one sample into playable clouds, elastic phrases, tape motion and granular textures.",
    workflow: "Load a sound, choose a transformation mode, then perform the result through PULSE, macros and effects.",
    status: "Preview installer available. Final release details are still being refined.",
    accessCopy:
      "Download the Windows x64 setup installer to test the standalone ORVO preview. Treat it as an evolving build, not a finished commercial release.",
  },
  midium: {
    heroNote: "30-day trial and license key workflow.",
    snapshotTitle: "A visual MIDI workflow for getting ideas out faster.",
    snapshotCopy:
      "MIDIUM turns drawing into MIDI generation, making pitch, rhythm and velocity feel more like a gesture than a spreadsheet of notes.",
    focus: "Sketching melodies, basslines, drum ideas and utility patterns directly into a visual instrument.",
    workflow: "Draw the gesture, refine scale and timing, then export or drag the MIDI into the DAW.",
    status: "Beta available with Windows standalone and VST3 package.",
    accessCopy:
      "Try MIDIUM free for 30 days. A license key keeps the standalone app and VST3 plugin unlocked after the trial.",
  },
  abyx: {
    heroNote: "30-day trial for controller-based performance.",
    snapshotTitle: "A controller-first music instrument for physical input.",
    snapshotCopy:
      "ABYX explores the gamepad as musical hardware, mapping familiar buttons and sticks to sounds, parameters and performance gestures.",
    focus: "Turning Xbox and PlayStation style controllers into beat, sample and effect performance surfaces.",
    workflow: "Map controls, perform with the controller, then capture the musical movement in your setup.",
    status: "Beta available with Windows standalone and VST3 package.",
    accessCopy:
      "Try ABYX free for 30 days. A license key keeps the standalone app and VST3 plugin unlocked after the trial.",
  },
};

export function AudioProductPage({ product }: { product: AudioProduct }) {
  const heroVideo = product.slug === "abyx" ? "/projects/videos/abyx.mp4" : null;
  const hasLicenseCheckout = Boolean(product.urls.buyLicense);
  const isComingSoon = product.commerce.mode === "coming-soon";
  const pageCopy = productPageCopy[product.slug];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.longCopy,
    applicationCategory: "MultimediaApplication",
    applicationSubCategory: "Music software",
    operatingSystem: product.compatibility.join(", "),
    softwareVersion: product.currentVersion.version,
    url: `https://jesaias.dk/audio/${product.slug}`,
    author: {
      "@type": "Person",
      name: "Jesaias",
      url: "https://jesaias.dk",
    },
    ...(hasLicenseCheckout
      ? {
          offers: {
            "@type": "Offer",
            price: "10.00",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: product.urls.buyLicense,
          },
        }
      : {}),
  };

  return (
    <main
      className={`audio-site product-page product-page--${product.slug}`}
      style={{ "--product-accent": product.accent, "--product-soft": product.accentSoft } as CSSProperties}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <AudioNav />

      <section className="product-hero" aria-labelledby="product-title">
        <div className="product-hero__copy">
          <div className="label-row">
            {product.labels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <p className="audio-kicker">{product.kicker}</p>
          {product.assets.logo ? (
            <Image
              src={product.assets.logo}
              alt={`${product.name} logo`}
              width={320}
              height={160}
              className="product-logo"
              priority
            />
          ) : null}
          <h1 id="product-title" className={product.assets.logo ? "sr-only" : undefined}>
            {product.name}
          </h1>
          <h2>{product.headline}</h2>
          <p>{product.longCopy}</p>
          <p className="product-hero__note">{pageCopy.heroNote}</p>
          {product.commerce.trialNote ? (
            <p className="trial-note">{product.commerce.trialNote}</p>
          ) : null}
          <div className="audio-actions">
            {isComingSoon ? (
              <>
                <a href={`#${product.slug}-video`} className="audio-button audio-button--dark">
                  Explore the interface
                </a>
                <Link href="/#contact" className="audio-button audio-button--light">
                  Follow development
                </Link>
              </>
            ) : hasLicenseCheckout ? (
              <>
                <a
                  href={product.urls.download}
                  className="audio-button audio-button--dark"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {product.commerce.trialLabel ?? "Download Free Trial"}
                </a>
                <a
                  href={product.urls.buyLicense}
                  className="audio-button audio-button--light"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy License Key
                </a>
              </>
            ) : (
              <>
                <a href={product.urls.download} className="audio-button audio-button--dark" download>
                  Download {product.name}
                </a>
                <a href={product.urls.watch} className="audio-button audio-button--light">
                  Watch preview
                </a>
              </>
            )}
          </div>
        </div>
        <div className="product-hero__image">
          <Image
            src={product.assets.screenshot}
            alt={`${product.name} interface screenshot`}
            width={1300}
            height={820}
            priority
            sizes="(max-width: 900px) 100vw, 58vw"
          />
          <div className="product-hero__hud" aria-hidden="true">
            <span>{product.commerce.statusLabel}</span>
            <strong>{product.currentVersion.version}</strong>
          </div>
          {heroVideo ? (
            <div className="motion-preview motion-preview--hero">
              <AutoAdVideo
                label={`${product.name} silent product advertisement`}
                poster={product.assets.screenshot}
                src={heroVideo}
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="product-snapshot" aria-labelledby={`${product.slug}-snapshot-title`}>
        <div className="product-snapshot__intro">
          <p className="audio-kicker">Product direction</p>
          <h2 id={`${product.slug}-snapshot-title`}>{pageCopy.snapshotTitle}</h2>
          <p>{pageCopy.snapshotCopy}</p>
        </div>
        <div className="product-snapshot__cards" aria-label={`${product.name} at a glance`}>
          <article>
            <span>Focus</span>
            <p>{pageCopy.focus}</p>
          </article>
          <article>
            <span>Workflow</span>
            <p>{pageCopy.workflow}</p>
          </article>
          <article>
            <span>Status</span>
            <p>{pageCopy.status}</p>
          </article>
        </div>
      </section>

      <section id={`${product.slug}-video`} className="interface-demo" aria-labelledby="demo-title">
        <div>
          <p className="audio-kicker">Interface demonstration</p>
          <h2 id="demo-title">The workflow in motion.</h2>
          <p>{product.shortCopy}</p>
        </div>
        <div className="interface-demo__film">
          <div className="interface-demo__poster">
            <Image
              src={product.assets.screenshot}
              alt={`${product.name} interface preview`}
              width={1600}
              height={1000}
              sizes="(max-width: 900px) 100vw, 64vw"
            />
          </div>
          {product.assets.video ? (
            <div className="motion-preview motion-preview--demo">
              <AutoAdVideo
                label={`${product.name} silent advertisement`}
                poster={product.assets.screenshot}
                src={product.assets.video}
              />
            </div>
          ) : (
            <div className="interface-placeholder__label">
              <span>{product.name} / Interface study</span>
              <strong>One sample. Four ways out.</strong>
            </div>
          )}
        </div>
        {!product.assets.video ? (
          <ol className="interface-demo__steps" aria-label={`${product.name} workflow preview`}>
            {product.workflow.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : null}
      </section>

      <section className="product-detail-grid" aria-label={`${product.name} product details`}>
        <DetailBlock title="Core features" items={product.features} />
        <DetailBlock title="Compatibility" items={product.compatibility} />
        <DetailBlock title="Installation" items={product.installation} ordered />
        <article className="detail-block">
          <h2>Current version</h2>
          <p className="version-line">{product.currentVersion.version}</p>
          <time dateTime={product.currentVersion.date}>{product.currentVersion.date}</time>
          <ul>
            {product.currentVersion.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </article>
      </section>

      <section id="changelog" className="changelog-detail" aria-labelledby="changelog-title">
        <div>
          <p className="audio-kicker">Changelog</p>
          <h2 id="changelog-title">{product.currentVersion.version}</h2>
          <time dateTime={product.currentVersion.date}>{product.currentVersion.date}</time>
        </div>
        <ul>
          {product.currentVersion.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      {hasLicenseCheckout ? (
        <section id={`download-${product.slug}`} className="download-panel access-panel" aria-labelledby="access-title">
          <div>
            <p className="audio-kicker">{product.commerce.statusLabel}</p>
            <h2 id="access-title">{product.commerce.priceLabel}.</h2>
            <p>{pageCopy.accessCopy}</p>
          </div>
          <div className="audio-actions">
            <a
              href={product.urls.download}
              className="audio-button audio-button--dark"
              target="_blank"
              rel="noopener noreferrer"
            >
              {product.commerce.trialLabel ?? "Download Free Trial"}
            </a>
            <a
              href={product.urls.buyLicense}
              className="audio-button audio-button--light"
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy License Key
            </a>
          </div>
        </section>
      ) : !isComingSoon ? (
        <section id={`download-${product.slug}`} className="download-panel" aria-labelledby="download-title">
          <div>
            <p className="audio-kicker">{product.commerce.statusLabel}</p>
            <h2 id="download-title">{product.commerce.priceLabel}.</h2>
            <p>{pageCopy.accessCopy}</p>
          </div>
          <div className="audio-actions">
            <a href={product.urls.download} className="audio-button audio-button--dark" download>
              Download installer
            </a>
            <a href={product.urls.support} className="audio-button audio-button--light">
              Contact / Support
            </a>
          </div>
        </section>
      ) : null}

      {isComingSoon ? (
        <section className="download-panel development-panel" aria-labelledby="development-title">
          <div>
            <p className="audio-kicker">In development</p>
            <h2 id="development-title">The structure is ready for launch.</h2>
            <p>
              Product recordings, audio examples, compatibility details and the final download
              link can be added here without rebuilding the page.
            </p>
          </div>
          <Link href="/#contact" className="audio-button audio-button--light">
            Ask about ORVO
          </Link>
        </section>
      ) : null}

      <section className="limitations" aria-labelledby="limitations-title">
        <h2 id="limitations-title">Known beta limitations</h2>
        <ul>
          {product.betaLimitations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {product.slug === "abyx" ? (
        <section id="controller-support" className="controller-support" aria-labelledby="controller-support-title">
          <div>
            <p className="audio-kicker">Controller support</p>
            <h2 id="controller-support-title">Designed for familiar pads.</h2>
          </div>
          <ul>
            <li>Xbox and PlayStation style layouts are the initial beta target.</li>
            <li>Wired connections are recommended for the first public beta.</li>
            <li>Driver behavior can vary, so controller notes will live with each release.</li>
          </ul>
        </section>
      ) : null}

      <ProjectNavigation currentSlug={product.slug} accent={product.accent} />

      <AudioFooter />
    </main>
  );
}

function DetailBlock({
  title,
  items,
  ordered = false,
}: {
  title: string;
  items: string[];
  ordered?: boolean;
}) {
  const List = ordered ? "ol" : "ul";

  return (
    <article className="detail-block">
      <h2>{title}</h2>
      <List>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </List>
    </article>
  );
}
