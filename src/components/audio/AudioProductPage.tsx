import Image from "next/image";
import Link from "next/link";
import { AutoAdVideo } from "@/components/audio/AutoAdVideo";
import { AudioFooter } from "@/components/audio/AudioLanding";
import { AudioNav } from "@/components/audio/AudioNav";
import { audioProducts, type AudioProduct } from "@/data/audio-products";

export function AudioProductPage({ product }: { product: AudioProduct }) {
  const related = audioProducts.find((item) => item.slug !== product.slug);
  const heroVideo = product.slug === "abyx" ? "/projects/videos/abyx.mp4" : null;
  const hasLicenseCheckout = Boolean(product.urls.buyLicense);
  const isComingSoon = product.commerce.mode === "coming-soon";

  return (
    <main
      className={`audio-site product-page product-page--${product.slug}`}
      style={{ "--product-accent": product.accent, "--product-soft": product.accentSoft } as React.CSSProperties}
    >
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
                <a href={product.urls.download} className="audio-button audio-button--dark">
                  Download
                </a>
                <a href={product.urls.watch} className="audio-button audio-button--light">
                  Watch {product.name}
                </a>
              </>
            )}
          </div>
        </div>
        <div className={`product-hero__image${heroVideo ? " product-hero__image--video" : ""}`}>
          {heroVideo ? (
            <AutoAdVideo
              label={`${product.name} silent product advertisement`}
              poster={product.assets.screenshot}
              src={heroVideo}
            />
          ) : (
            <Image
              src={product.assets.screenshot}
              alt={`${product.name} interface screenshot`}
              width={1300}
              height={820}
              priority
              sizes="(max-width: 900px) 100vw, 58vw"
            />
          )}
        </div>
      </section>

      <section id={`${product.slug}-video`} className="interface-demo" aria-labelledby="demo-title">
        <div>
          <p className="audio-kicker">Interface demonstration</p>
          <h2 id="demo-title">The workflow in motion.</h2>
          <p>{product.shortCopy}</p>
        </div>
        <div className="interface-demo__film">
          {product.assets.video ? (
            <AutoAdVideo
              label={`${product.name} silent advertisement`}
              poster={product.assets.screenshot}
              src={product.assets.video}
            />
          ) : (
            <div className="interface-placeholder" id="orvo-preview">
              <Image
                src={product.assets.screenshot}
                alt={`${product.name} interface preview`}
                width={1600}
                height={1000}
                sizes="(max-width: 900px) 100vw, 90vw"
              />
              <div className="interface-placeholder__label">
                <span>ORVO / Interface study</span>
                <strong>One sample. Four ways out.</strong>
              </div>
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

      {!hasLicenseCheckout && !isComingSoon ? (
        <section id={`download-${product.slug}`} className="download-panel" aria-labelledby="download-title">
          <div>
            <p className="audio-kicker">{product.commerce.statusLabel}</p>
            <h2 id="download-title">{product.commerce.priceLabel}.</h2>
            <p>
              Download URLs are configured in one product data file and can later point to
              GitHub Releases, pay-what-you-want pages or a full storefront.
            </p>
          </div>
          <div className="audio-actions">
            <a href={product.urls.download} className="audio-button audio-button--dark">
              Download
            </a>
            <a href={product.urls.support} className="audio-button audio-button--light">
              Support link
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

      {related ? (
        <section className="related-product" aria-labelledby="related-title">
          <div>
            <p className="audio-kicker">Related product</p>
            <h2 id="related-title">{related.name}</h2>
            <p>{related.headline}</p>
          </div>
          <Link href={`/audio/${related.slug}`} className="audio-button audio-button--dark">
            Explore {related.name}
          </Link>
        </section>
      ) : null}

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
