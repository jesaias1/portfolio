import Image from "next/image";
import Link from "next/link";
import { AutoAdVideo } from "@/components/audio/AutoAdVideo";
import { AudioNav } from "@/components/audio/AudioNav";
import { HeroMechanic } from "@/components/audio/HeroMechanic";
import { audioProducts, audioSite } from "@/data/audio-products";

export function AudioLanding() {
  const [midium, abyx] = audioProducts;

  return (
    <main className="audio-site">
      <AudioNav />

      <section className="audio-hero" aria-labelledby="audio-hero-title">
        <div className="audio-hero__copy">
          <p className="audio-kicker">{audioSite.brand}</p>
          <h1 id="audio-hero-title">{audioSite.tagline}</h1>
          <p>{audioSite.description}</p>
          <div className="audio-actions audio-actions--hero">
            <Link href="/audio/midium" className="audio-button audio-button--neutral">
              Explore MIDIUM
            </Link>
            <Link href="/audio/abyx" className="audio-button audio-button--neutral">
              Explore ABYX
            </Link>
          </div>
        </div>
        <HeroMechanic />
      </section>

      <section className="catalogue-strip" aria-label="Product catalogue">
        <span>Current instruments</span>
        <strong>MIDIUM / ABYX</strong>
        <span>Built for Windows VST3 and standalone workflows</span>
      </section>

      <ProductShowcase product={midium} direction="left" />
      <ProductShowcase product={abyx} direction="right" />

      <section className="philosophy" aria-labelledby="philosophy-title">
        <p className="audio-kicker">Shared philosophy</p>
        <h2 id="philosophy-title">Music software should invite you to touch it.</h2>
        <p>
          MIDIUM replaces note-by-note programming with drawing. ABYX transforms a familiar
          controller into an instrument. Both explore new ways to get ideas out before they
          disappear.
        </p>
      </section>

      <section className="future-catalogue" aria-labelledby="future-title">
        <div>
          <p className="audio-kicker">Catalogue room</p>
          <h2 id="future-title">Built with space for the next instruments.</h2>
        </div>
        <div className="future-slots" aria-label="Future product slots">
          <span>MIDIUM</span>
          <span>ABYX</span>
          <span>Next plugin</span>
          <span>Next utility</span>
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
  return (
    <section
      id={`download-${product.slug}`}
      className={`product-showcase product-showcase--${product.slug} product-showcase--${direction}`}
      aria-labelledby={`${product.slug}-title`}
      style={{ "--product-accent": product.accent, "--product-soft": product.accentSoft } as React.CSSProperties}
    >
      <div id={`${product.slug}-video`} className="product-showcase__media">
        <AutoAdVideo
          label={`${product.name} silent advertisement`}
          poster={product.assets.screenshot}
          src={product.assets.video}
        />
      </div>
      <div className="product-showcase__copy">
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
            sizes="(max-width: 700px) 60vw, 260px"
          />
        ) : null}
        <h2 id={`${product.slug}-title`} className={product.assets.logo ? "sr-only" : undefined}>
          {product.name}
        </h2>
        <h3>{product.headline}</h3>
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
          <a href={product.urls.download} className="audio-button audio-button--dark">
            Download for Windows
          </a>
          <a href={product.urls.watch} className="audio-button audio-button--light">
            Watch {product.name}
          </a>
          <Link href={product.urls.resource} className="audio-text-link">
            {product.resourceLabel}
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
  return (
    <section id="support" className="support-band" aria-labelledby="support-title">
      <div>
        <p className="audio-kicker">Beta access</p>
        <h2 id="support-title">Free during beta.</h2>
        <p>
          Download and use the complete beta version. Support future development if you
          enjoy it.
        </p>
      </div>
      <div className="audio-actions">
        <a href={audioProducts[0].urls.download} className="audio-button audio-button--dark">
          Download free
        </a>
        <a href={audioSite.urls.donation} className="audio-button audio-button--light">
          Support development
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
        <a href={audioSite.urls.instagram}>Instagram</a>
        <a href={audioSite.urls.youtube}>YouTube</a>
        <a href={audioSite.urls.support}>Support</a>
        <a href={audioSite.urls.contact}>Contact</a>
        <a href={audioSite.urls.terms}>Terms</a>
        <a href={audioSite.urls.privacy}>Privacy</a>
      </nav>
    </footer>
  );
}
