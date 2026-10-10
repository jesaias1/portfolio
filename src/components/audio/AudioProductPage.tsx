import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { AutoAdVideo } from "@/components/audio/AutoAdVideo";
import ClickToPlayVideo from "@/components/ClickToPlayVideo";
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
  const price = product.commerce.priceLabel.match(/^\$\d+/)?.[0] ?? "Free";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.longCopy,
    applicationCategory: "MultimediaApplication",
    applicationSubCategory: "Music software",
    operatingSystem: product.compatibility.join(", "),
    softwareVersion: product.currentVersion.version,
    url: `https://www.jesaias.dk/audio/${product.slug}`,
    author: {
      "@type": "Person",
      name: "Jesaias",
      url: "https://www.jesaias.dk",
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

  const downloadActions = hasLicenseCheckout ? (
    <>
      <a href={product.urls.download} data-track="download_click" data-track-product={product.slug} className="btn btn--accent" target="_blank" rel="noopener noreferrer">
        {product.commerce.trialLabel ?? "Download free trial"}
      </a>
      <a href={product.urls.buyLicense} data-track="buy_license_click" data-track-product={product.slug} className="btn btn--ghost" target="_blank" rel="noopener noreferrer">
        Buy license key
      </a>
    </>
  ) : (
    <>
      <a href={product.urls.download} data-track="download_click" data-track-product={product.slug} className="btn btn--accent" download>
        Download {product.name}
      </a>
      <a href={product.urls.support} className="btn btn--ghost">
        Contact / support
      </a>
    </>
  );

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

      <section className="phero" aria-labelledby="product-title">
        <div className="phero__glow" aria-hidden="true" />
        <div className="phero__copy">
          <p className="eyebrow">{product.kicker}</p>
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
          <p className="phero__lead">{product.longCopy}</p>
          <div className="actions">
            {isComingSoon ? (
              <>
                <a href={`#${product.slug}-video`} className="btn btn--accent">
                  Explore the interface
                </a>
                <Link href="/#contact" className="btn btn--ghost">
                  Follow development
                </Link>
              </>
            ) : (
              downloadActions
            )}
          </div>
          <p className="phero__note">{pageCopy.heroNote}</p>
          <dl className="glance">
            <div>
              <dt>Version</dt>
              <dd>{product.currentVersion.version}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{product.commerce.statusLabel}</dd>
            </div>
            <div>
              <dt>Price</dt>
              <dd>{price === "Free" ? "Free preview" : `${price} license`}</dd>
            </div>
          </dl>
        </div>
        <div className="phero__media">
          <div className="frame frame--hero">
            <Image
              src={product.assets.screenshot}
              alt={`${product.name} interface screenshot`}
              width={1300}
              height={820}
              priority
              sizes="(max-width: 960px) 100vw, 58vw"
            />
            {heroVideo ? (
              <div className="frame__video">
                <AutoAdVideo
                  label={`${product.name} silent product advertisement`}
                  poster={product.assets.screenshot}
                  src={heroVideo}
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <nav className="subnav" aria-label={`${product.name} sections`}>
        <a href="#overview">Overview</a>
        <a href={`#${product.slug}-video`}>In motion</a>
        <a href="#features">Features</a>
        <a href="#specs">Specs</a>
        {isComingSoon ? null : <a href={`#download-${product.slug}`}>Download</a>}
        <a href="#changelog">Changelog</a>
      </nav>

      <section id="overview" className="section" aria-labelledby={`${product.slug}-snapshot-title`}>
        <header className="section__head">
          <p className="eyebrow">Product direction</p>
          <h2 id={`${product.slug}-snapshot-title`}>{pageCopy.snapshotTitle}</h2>
          <p>{pageCopy.snapshotCopy}</p>
        </header>
        <div className="trio" aria-label={`${product.name} at a glance`}>
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

      <section id={`${product.slug}-video`} className="section section--panel" aria-labelledby="demo-title">
        <header className="section__head">
          <p className="eyebrow">Interface demonstration</p>
          <h2 id="demo-title">The workflow in motion.</h2>
          <p>{product.shortCopy}</p>
        </header>
        {product.assets.film && product.assets.filmPoster ? (
          <ClickToPlayVideo
            src={product.assets.film}
            poster={product.assets.filmPoster}
            label={`${product.name} ad`}
            buttonLabel="Watch the ad"
            accent={product.accent}
            className="frame frame--wide"
          />
        ) : (
        <div className="frame frame--wide">
          <Image
            src={product.assets.screenshot}
            alt={`${product.name} interface preview`}
            width={1600}
            height={1000}
            sizes="(max-width: 960px) 100vw, 1100px"
          />
          {product.assets.video ? (
            <div className="frame__video">
              <AutoAdVideo
                label={`${product.name} silent advertisement`}
                poster={product.assets.screenshot}
                src={product.assets.video}
              />
            </div>
          ) : null}
        </div>
        )}
        <ol className="steps steps--row" aria-label={`${product.name} workflow`}>
          {product.workflow.map((step, index) => (
            <li key={step.title}>
              <span>{index + 1}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="features" className="section" aria-labelledby="features-title">
        <header className="section__head">
          <p className="eyebrow">Core features</p>
          <h2 id="features-title">What is inside.</h2>
        </header>
        <ul className="features">
          {product.features.map((feature, index) => (
            <li key={feature}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{feature}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="specs" className="section section--panel" aria-labelledby="specs-title">
        <header className="section__head">
          <p className="eyebrow">Specs</p>
          <h2 id="specs-title">Requirements and setup.</h2>
        </header>
        <div className="specs">
          <DetailBlock title="Compatibility" items={product.compatibility} />
          <DetailBlock title="Installation" items={product.installation} ordered />
          <DetailBlock title={isComingSoon ? "Preview notes" : "Known beta limitations"} items={product.betaLimitations} />
        </div>
      </section>

      {isComingSoon ? (
        <section className="cta-band" aria-labelledby="development-title">
          <div>
            <p className="eyebrow">In development</p>
            <h2 id="development-title">The structure is ready for launch.</h2>
            <p>
              Product recordings, audio examples, compatibility details and the final download link
              can be added here without rebuilding the page.
            </p>
          </div>
          <Link href="/#contact" className="btn btn--accent">
            Ask about {product.name}
          </Link>
        </section>
      ) : (
        <section id={`download-${product.slug}`} className="cta-band" aria-labelledby="download-title">
          <div>
            <p className="eyebrow">{product.commerce.statusLabel}</p>
            <h2 id="download-title">{product.commerce.priceLabel}.</h2>
            <p>{pageCopy.accessCopy}</p>
          </div>
          <div className="actions actions--stack">{downloadActions}</div>
        </section>
      )}

      <section id="changelog" className="section section--split" aria-labelledby="changelog-title">
        <header className="section__head">
          <p className="eyebrow">Changelog</p>
          <h2 id="changelog-title">{product.currentVersion.version}</h2>
          <time dateTime={product.currentVersion.date}>{product.currentVersion.date}</time>
        </header>
        <ul className="notes">
          {product.currentVersion.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      {product.slug === "abyx" ? (
        <section id="controller-support" className="section section--split" aria-labelledby="controller-support-title">
          <header className="section__head">
            <p className="eyebrow">Controller support</p>
            <h2 id="controller-support-title">Designed for familiar pads.</h2>
          </header>
          <ul className="notes">
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
    <article className="spec">
      <h3>{title}</h3>
      <List>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </List>
    </article>
  );
}
