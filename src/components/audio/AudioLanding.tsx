import Image from "next/image";
import Link from "next/link";
import { AutoAdVideo } from "@/components/audio/AutoAdVideo";
import { AudioNav } from "@/components/audio/AudioNav";
import { HeroMechanic } from "@/components/audio/HeroMechanic";
import { audioProducts, audioSite } from "@/data/audio-products";

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
        <HeroMechanic />
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

      <section className="future-catalogue" aria-labelledby="future-title">
        <div>
          <p className="audio-kicker">Catalogue room</p>
          <h2 id="future-title">Built with space for the next instruments.</h2>
        </div>
        <div className="future-slots" aria-label="Future product slots">
          <span>ORVO</span>
          <span>MIDIUM</span>
          <span>ABYX</span>
          <span>Next plugin</span>
        </div>
      </section>

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

  return (
    <section
      id={`download-${product.slug}`}
      className={`product-showcase product-showcase--${product.slug} product-showcase--${direction}`}
      aria-labelledby={`${product.slug}-title`}
      style={{ "--product-accent": product.accent, "--product-soft": product.accentSoft } as React.CSSProperties}
    >
      <div id={`${product.slug}-video`} className="product-showcase__media">
        {product.assets.video ? (
          <AutoAdVideo
            label={`${product.name} silent advertisement`}
            poster={product.assets.screenshot}
            src={product.assets.video}
          />
        ) : (
          <div className="catalogue-placeholder">
            <Image
              src={product.assets.screenshot}
              alt={`${product.name} interface preview`}
              width={1600}
              height={1000}
              sizes="(max-width: 900px) 100vw, 58vw"
            />
            <span>Motion preview coming later</span>
          </div>
        )}
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
            >
              {hasLicenseCheckout ? product.commerce.trialLabel ?? "Download Free Trial" : "Download"}
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
  const licensedProducts = audioProducts.filter((product) => product.urls.buyLicense);

  return (
    <section id="support" className="support-band" aria-labelledby="support-title">
      <div>
        <p className="audio-kicker">30-day trials</p>
        <h2 id="support-title">Try each plugin for 30 days.</h2>
        <p>
          MIDIUM and ABYX include VST3 plugins for compatible DAWs, plus standalone apps
          currently available for Windows. ORVO will join the catalogue after development.
        </p>
      </div>
      <div className="audio-actions">
        <a
          href={licensedProducts[0].urls.download}
          className="audio-button audio-button--dark"
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
