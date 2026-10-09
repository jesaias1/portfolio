import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { AutoAdVideo } from "@/components/audio/AutoAdVideo";
import { AudioHeroShowcase } from "@/components/audio/AudioHeroShowcase";
import { AudioNav } from "@/components/audio/AudioNav";
import { type AudioProduct, audioProducts, audioSite } from "@/data/audio-products";

const accentStyle = (product: AudioProduct) =>
  ({ "--product-accent": product.accent, "--product-soft": product.accentSoft }) as CSSProperties;

const bestFor: Record<AudioProduct["slug"], string> = {
  orvo: "Sound design and turning samples into new instruments",
  midium: "Sketching melodies, basslines and drum ideas fast",
  abyx: "Playing beats and effects live with a gamepad",
};

const input: Record<AudioProduct["slug"], string> = {
  orvo: "Sample + macros",
  midium: "Mouse / pen drawing",
  abyx: "Xbox / PlayStation controller",
};

function priceHeadline(product: AudioProduct) {
  return product.commerce.priceLabel.match(/^\$\d+/)?.[0] ?? "Free";
}

function primaryAction(product: AudioProduct) {
  const licensed = Boolean(product.urls.buyLicense);
  return {
    label: licensed
      ? product.commerce.trialLabel ?? "Download free trial"
      : product.slug === "orvo"
        ? "Download preview"
        : "Download",
    external: licensed || product.urls.download.startsWith("http"),
    download: !licensed && !product.urls.download.startsWith("http"),
  };
}

const faqs = [
  {
    q: "How do the 30-day trials work?",
    a: "MIDIUM and ABYX are free to try for 30 days. After that, enter a license key to keep using them. One $10 purchase unlocks the VST3 plugin for compatible DAWs and the Windows standalone app.",
  },
  {
    q: "Which platforms are supported?",
    a: "The standalone apps are Windows-only for now. MIDIUM and ABYX ship as VST3 plus a Windows standalone app. ORVO is a Windows x64 standalone preview while VST3 compatibility is tested.",
  },
  {
    q: "Is ORVO finished?",
    a: "ORVO is a preview build. It is free to download and test, but it may change before a formal release, and final compatibility details are still being confirmed.",
  },
  {
    q: "Which controllers does ABYX support?",
    a: "Xbox and PlayStation style controllers are the beta target. Wired connections are recommended, and detection can vary by driver and connection type.",
  },
  {
    q: "Where do I get help?",
    a: "Email linasjesaias@gmail.com. Include your DAW, Windows version and the product you are using, and you will get a reply from the person who builds it.",
  },
];

export function AudioLanding() {
  return (
    <main className="audio-site">
      <AudioNav />

      <section className="hero" aria-labelledby="audio-hero-title">
        <div className="hero__aurora" aria-hidden="true" />
        <div className="hero__copy">
          <p className="eyebrow">{audioSite.brand}</p>
          <h1 id="audio-hero-title">{audioSite.tagline}</h1>
          <p className="hero__lead">{audioSite.description}</p>
          <div className="actions">
            <a href="#downloads" className="btn btn--primary">
              Download free trials
            </a>
            <a href="#catalogue" className="btn btn--ghost">
              Explore the tools
            </a>
          </div>
          <ul className="hero__facts" aria-label="At a glance">
            <li>
              <strong>3</strong>
              <span>instruments</span>
            </li>
            <li>
              <strong>VST3</strong>
              <span>+ Windows standalone</span>
            </li>
            <li>
              <strong>30 days</strong>
              <span>free trial</span>
            </li>
          </ul>
        </div>
        <AudioHeroShowcase />
      </section>

      <div id="catalogue">
        {audioProducts.map((product, index) => (
          <ProductShowcase key={product.slug} product={product} flip={index % 2 === 1} index={index} />
        ))}
      </div>

      <section className="statement" aria-labelledby="statement-title">
        <p className="eyebrow">Shared philosophy</p>
        <h2 id="statement-title">Music software should invite you to touch it.</h2>
        <p>
          ORVO transforms sound, MIDIUM replaces note-by-note programming with drawing, and ABYX
          turns a familiar controller into an instrument. Each tool explores a more immediate way
          to make music.
        </p>
      </section>

      <section className="section" aria-labelledby="compare-title">
        <header className="section__head">
          <p className="eyebrow">Compare</p>
          <h2 id="compare-title">Choose your tool.</h2>
        </header>
        <div className="table-wrap">
          <table className="compare">
            <caption className="sr-only">Comparison of ORVO, MIDIUM and ABYX</caption>
            <thead>
              <tr>
                <th scope="col"><span className="sr-only">Feature</span></th>
                {audioProducts.map((product) => (
                  <th key={product.slug} scope="col" style={accentStyle(product)}>
                    <Link href={`/audio/${product.slug}`}>{product.name}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <CompareRow label="What it is" values={audioProducts.map((p) => p.kicker)} />
              <CompareRow label="Best for" values={audioProducts.map((p) => bestFor[p.slug])} />
              <CompareRow label="Played with" values={audioProducts.map((p) => input[p.slug])} />
              <CompareRow
                label="Formats"
                values={audioProducts.map((p) =>
                  p.slug === "orvo" ? "Windows x64 standalone (VST3 in testing)" : "VST3 + Windows standalone",
                )}
              />
              <CompareRow label="Status" values={audioProducts.map((p) => p.commerce.statusLabel)} />
              <CompareRow label="Price" values={audioProducts.map((p) => p.commerce.priceLabel)} />
            </tbody>
          </table>
        </div>
      </section>

      <section id="downloads" className="section section--panel" aria-labelledby="downloads-title">
        <header className="section__head">
          <p className="eyebrow">Downloads</p>
          <h2 id="downloads-title">Try the current builds.</h2>
          <p>
            ORVO has a free Windows preview installer. MIDIUM and ABYX include 30-day trials for
            their Windows standalone apps and VST3 packages.
          </p>
        </header>
        <div className="pricing">
          {audioProducts.map((product) => {
            const action = primaryAction(product);
            return (
              <article key={product.slug} className="price-card" style={accentStyle(product)}>
                <p className="price-card__status">{product.commerce.statusLabel}</p>
                <h3>{product.name}</h3>
                <p className="price-card__price">
                  <strong>{priceHeadline(product)}</strong>
                  <span>{product.commerce.priceLabel.replace(/^(\$\d+|Free)\s*/i, "") || "preview"}</span>
                </p>
                <ul>
                  {product.compatibility.slice(0, 3).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="actions actions--stack">
                  <a
                    href={product.urls.download}
                    data-track="download_click"
                    data-track-product={product.slug}
                    className="btn btn--accent"
                    target={action.external ? "_blank" : undefined}
                    rel={action.external ? "noopener noreferrer" : undefined}
                    download={action.download ? true : undefined}
                  >
                    {action.label}
                  </a>
                  {product.urls.buyLicense ? (
                    <a href={product.urls.buyLicense} data-track="buy_license_click" data-track-product={product.slug} className="btn btn--ghost" target="_blank" rel="noopener noreferrer">
                      Buy license key
                    </a>
                  ) : (
                    <Link href={`/audio/${product.slug}`} className="btn btn--ghost">
                      Details
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="updates" className="section" aria-labelledby="updates-title">
        <header className="section__head">
          <p className="eyebrow">Updates</p>
          <h2 id="updates-title">Release log</h2>
        </header>
        <ol className="timeline">
          {[...audioProducts]
            .sort((a, b) => b.currentVersion.date.localeCompare(a.currentVersion.date))
            .map((product) => (
              <li key={product.slug} style={accentStyle(product)}>
                <div className="timeline__meta">
                  <time dateTime={product.currentVersion.date}>{product.currentVersion.date}</time>
                  <strong>{product.name}</strong>
                  <span>{product.currentVersion.version}</span>
                </div>
                <ul>
                  {product.currentVersion.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </li>
            ))}
        </ol>
      </section>

      <section id="support" className="section section--split" aria-labelledby="support-title">
        <header className="section__head">
          <p className="eyebrow">Support</p>
          <h2 id="support-title">Questions, answered.</h2>
          <p>Still stuck? Write to the person who builds it.</p>
          <a href={audioSite.urls.contact} className="btn btn--primary">
            Email support
          </a>
        </header>
        <div className="faq">
          {faqs.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <AudioFooter />
    </main>
  );
}

function CompareRow({ label, values }: { label: string; values: string[] }) {
  return (
    <tr>
      <th scope="row">{label}</th>
      {values.map((value, index) => (
        <td key={audioProducts[index].slug}>{value}</td>
      ))}
    </tr>
  );
}

function ProductShowcase({
  product,
  flip,
  index,
}: {
  product: AudioProduct;
  flip: boolean;
  index: number;
}) {
  const action = primaryAction(product);

  return (
    <section
      id={`download-${product.slug}`}
      className={`showcase${flip ? " showcase--flip" : ""}`}
      aria-labelledby={`${product.slug}-title`}
      style={accentStyle(product)}
    >
      <div className="showcase__glow" aria-hidden="true" />
      <div id={`${product.slug}-video`} className="showcase__media">
        <div className="frame">
          <Image
            src={product.assets.screenshot}
            alt={`${product.name} interface preview`}
            width={1600}
            height={1000}
            sizes="(max-width: 960px) 100vw, 56vw"
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
      </div>

      <div className="showcase__copy">
        <p className="eyebrow">
          <span>{String(index + 1).padStart(2, "0")}</span> {product.kicker}
        </p>
        <Link href={`/audio/${product.slug}`} className="showcase__title">
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
        <p className="showcase__lead">{product.shortCopy}</p>
        <ol className="steps">
          {product.workflow.map((item, stepIndex) => (
            <li key={item.title}>
              <span>{stepIndex + 1}</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="chips">
          {product.labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <div className="actions">
          <a
            href={product.urls.download}
            data-track="download_click"
            data-track-product={product.slug}
            className="btn btn--accent"
            target={action.external ? "_blank" : undefined}
            rel={action.external ? "noopener noreferrer" : undefined}
            download={action.download ? true : undefined}
          >
            {action.label}
          </a>
          <Link href={`/audio/${product.slug}`} className="btn btn--ghost">
            Explore {product.name}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function AudioFooter() {
  return (
    <footer className="afooter">
      <div className="afooter__grid">
        <div>
          <strong className="afooter__brand">{audioSite.brand}</strong>
          <p>Independent music software by Jesaias.</p>
          <p>{audioSite.origin}</p>
        </div>
        <nav aria-label="Products">
          <h2>Products</h2>
          {audioProducts.map((product) => (
            <Link key={product.slug} href={`/audio/${product.slug}`}>
              {product.name}
            </Link>
          ))}
        </nav>
        <nav aria-label="Resources">
          <h2>Resources</h2>
          <Link href="/audio#downloads">Downloads</Link>
          <Link href="/audio#updates">Release log</Link>
          <Link href="/audio#support">Support</Link>
        </nav>
        <nav aria-label="Jesaias">
          <h2>Jesaias</h2>
          <a href={audioSite.urls.portfolio}>Portfolio</a>
          <a href={audioSite.urls.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href={audioSite.urls.contact}>Contact</a>
        </nav>
      </div>
      <p className="afooter__legal">
        &copy; {new Date().getFullYear()} Jesaias Audio. All product names are trademarks of their respective owners.
      </p>
    </footer>
  );
}
