import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { AutoAdVideo } from "@/components/audio/AutoAdVideo";
import { AudioHeroShowcase } from "@/components/audio/AudioHeroShowcase";
import { AudioNav } from "@/components/audio/AudioNav";
import { type AudioProduct, audioProducts, audioSite } from "@/data/audio-products";

export function AudioLanding() {
  return (
    <main className="audio-site">
      <AudioNav />

      <section className="audio-hero" aria-labelledby="audio-hero-title">
        <div className="audio-hero__copy">
          <p className="audio-kicker">{audioSite.brand}</p>
          <h1 id="audio-hero-title">{audioSite.tagline}</h1>
          <p>{audioSite.description}</p>
          <div className="audio-actions audio-actions--hero">
            <Link href="/audio/orvo" className="audio-button audio-button--neutral">
              Explore ORVO
            </Link>
            <a href="#catalogue" className="audio-button audio-button--neutral">View all tools</a>
          </div>
        </div>
        <AudioHeroShowcase />
      </section>

      <div id="catalogue">
        {audioProducts.map((product, index) => (
          <ProductShowcase
            key={product.slug}
            product={product}
            direction={index % 2 === 0 ? "left" : "right"}
          />
        ))}
      </div>

      <section className="philosophy" aria-labelledby="philosophy-title">
        <p className="audio-kicker">Shared philosophy</p>
        <h2 id="philosophy-title">Music software should invite you to touch it.</h2>
        <p>
          ORVO transforms sound, MIDIUM replaces note-by-note programming with drawing, and
          ABYX turns a familiar controller into an instrument. Each tool explores a more
          immediate way to make music.
        </p>
      </section>

      <AccessMatrix />

      <UpdatesSection />
      <SupportSection />
      <AudioFooter />
    </main>
  );
}

function ProductShowcase({
  product,
  direction,
}: {
  product: (typeof audioProducts)[number];
  direction: "left" | "right";
}) {
  const hasLicenseCheckout = Boolean(product.urls.buyLicense);
  const isComingSoon = product.commerce.mode === "coming-soon";
  const primaryActionLabel = isComingSoon
    ? "Development preview"
    : hasLicenseCheckout
      ? product.commerce.trialLabel ?? "Download Free Trial"
      : product.slug === "orvo"
        ? "Download preview"
        : "Download";

  return (
    <section
      id={`download-${product.slug}`}
      className={`product-showcase product-showcase--${product.slug} product-showcase--${direction}`}
      aria-labelledby={`${product.slug}-title`}
      style={{ "--product-accent": product.accent, "--product-soft": product.accentSoft } as CSSProperties}
    >
      <div id={`${product.slug}-video`} className="product-showcase__media">
        <div className="product-showcase__poster">
          <Image
            src={product.assets.screenshot}
            alt={`${product.name} interface preview`}
            width={1600}
            height={1000}
            sizes="(max-width: 900px) 100vw, 56vw"
          />
        </div>
        {product.assets.video ? (
          <div className="motion-preview motion-preview--catalogue">
            <span>{product.name} motion preview</span>
            <AutoAdVideo
              label={`${product.name} silent advertisement`}
              poster={product.assets.screenshot}
              src={product.assets.video}
            />
          </div>
        ) : null}
      </div>
      <div className="product-showcase__copy">
        <div className="label-row">
          {product.labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <p className="audio-kicker">{product.kicker}</p>
        <Link href={`/audio/${product.slug}`} className="product-title-link">
          {product.assets.logo ? (
            <Image
              src={product.assets.logo}
              alt={`${product.name} logo`}
              width={320}
              height={160}
              className="product-logo"
              sizes="(max-width: 700px) 60vw, 260px"
            />
          ) : null}
          <h2 id={`${product.slug}-title`} className={product.assets.logo ? "sr-only" : undefined}>
            {product.name}
          </h2>
          <h3>{product.headline}</h3>
        </Link>
        <p>{product.shortCopy}</p>
        <ol className="workflow-list">
          {product.workflow.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </li>
          ))}
        </ol>
        <div className="audio-actions">
          {isComingSoon ? (
            <Link href={`/audio/${product.slug}`} className="audio-button audio-button--dark">
              Development preview
            </Link>
          ) : (
            <a
              href={product.urls.download}
              className="audio-button audio-button--dark"
              target={hasLicenseCheckout ? "_blank" : undefined}
              rel={hasLicenseCheckout ? "noopener noreferrer" : undefined}
              download={!hasLicenseCheckout ? true : undefined}
            >
              {primaryActionLabel}
            </a>
          )}
          <Link href={`/audio/${product.slug}`} className="audio-button audio-button--light">
            View {product.name} page
          </Link>
        </div>
      </div>
    </section>
  );
}

function getAccessAction(product: AudioProduct) {
  const hasLicenseCheckout = Boolean(product.urls.buyLicense);
  const external = hasLicenseCheckout || product.urls.download.startsWith("http");
  const label = hasLicenseCheckout
    ? product.commerce.trialLabel ?? "Download Free Trial"
    : product.slug === "orvo"
      ? "Download preview"
      : "Download";

  return {
    external,
    label,
    download: !external,
  };
}

function getAccessCopy(product: AudioProduct) {
  if (product.slug === "orvo") {
    return "Windows x64 standalone preview installer for testing the current ORVO direction before the formal release.";
  }

  if (product.slug === "midium") {
    return "30-day trial for the visual MIDI workflow, with standalone and VST3 package access through Lemon Squeezy.";
  }

  return "30-day trial for the controller-based instrument, with standalone and VST3 package access through Lemon Squeezy.";
}

function AccessMatrix() {
  return (
    <section className="access-matrix" aria-labelledby="access-title">
      <div className="access-matrix__intro">
        <p className="audio-kicker">Available builds</p>
        <h2 id="access-title">Pick the tool you want to test.</h2>
        <p>
          The catalogue is small on purpose: each product page has a focused preview,
          current status, download path and beta notes.
        </p>
      </div>
      <div className="access-matrix__grid">
        {audioProducts.map((product, index) => {
          const action = getAccessAction(product);

          return (
            <article
              key={product.slug}
              style={{ "--product-accent": product.accent, "--product-soft": product.accentSoft } as CSSProperties}
            >
              <span className="access-matrix__number">{String(index + 1).padStart(2, "0")}</span>
              <p className="access-matrix__name">{product.name}</p>
              <h3>{product.commerce.statusLabel}</h3>
              <p>{getAccessCopy(product)}</p>
              <div className="audio-actions">
                <a
                  href={product.urls.download}
                  className="audio-button audio-button--dark"
                  target={action.external ? "_blank" : undefined}
                  rel={action.external ? "noopener noreferrer" : undefined}
                  download={action.download ? true : undefined}
                >
                  {action.label}
                </a>
                <Link href={`/audio/${product.slug}`} className="audio-button audio-button--light">
                  Details
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function UpdatesSection() {
  return (
    <section id="updates" className="release-log" aria-labelledby="updates-title">
      <div>
        <p className="audio-kicker">Updates</p>
        <h2 id="updates-title">Release log</h2>
      </div>
      <div className="release-log__items">
        {audioProducts.map((product) => (
          <article key={product.slug}>
            <div>
              <strong>{product.name}</strong>
              <span>{product.currentVersion.version}</span>
            </div>
            <time dateTime={product.currentVersion.date}>{product.currentVersion.date}</time>
            <ul>
              {product.currentVersion.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function SupportSection() {
  const orvo = audioProducts.find((product) => product.slug === "orvo");
  const licensedProducts = audioProducts.filter((product) => product.urls.buyLicense);

  return (
    <section id="support" className="support-band" aria-labelledby="support-title">
      <div>
        <p className="audio-kicker">Downloads</p>
        <h2 id="support-title">Try the current builds.</h2>
        <p>
          ORVO has a Windows preview installer. MIDIUM and ABYX include 30-day trials
          for their Windows standalone apps and VST3 packages.
        </p>
      </div>
      <div className="audio-actions">
        {orvo ? (
          <a href={orvo.urls.download} className="audio-button audio-button--dark" download>
            Download ORVO
          </a>
        ) : null}
        <a
          href={licensedProducts[0].urls.download}
          className="audio-button audio-button--light"
          target="_blank"
          rel="noopener noreferrer"
        >
          Try MIDIUM
        </a>
        <a
          href={licensedProducts[1].urls.download}
          className="audio-button audio-button--light"
          target="_blank"
          rel="noopener noreferrer"
        >
          Try ABYX
        </a>
        <a href={audioSite.urls.contact} className="audio-button audio-button--light">
          Ask for help
        </a>
      </div>
    </section>
  );
}

export function AudioFooter() {
  return (
    <footer className="audio-footer">
      <div>
        <strong>{audioSite.brand}</strong>
        <p>Independent music software by Jesaias.</p>
        <p>{audioSite.origin}</p>
      </div>
      <nav aria-label="Audio footer">
        <a href={audioSite.urls.portfolio}>Portfolio</a>
        <a href={audioSite.urls.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href={audioSite.urls.support}>Support</a>
        <a href={audioSite.urls.contact}>Contact</a>
      </nav>
    </footer>
  );
}
