import { chromium } from 'playwright';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';

const root = process.cwd();
const outDir = join(root, 'public');

function assetUrl(path) {
  const ext = path.split('.').pop()?.toLowerCase();
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
  const data = readFileSync(join(root, 'public', path)).toString('base64');
  return `data:${mime};base64,${data}`;
}

const baseCss = `
  * { box-sizing: border-box; }
  body { margin: 0; background: #020405; font-family: Inter, Arial, sans-serif; }
  .card {
    position: relative;
    width: 1200px;
    height: 630px;
    overflow: hidden;
    color: #f5fbff;
    background:
      radial-gradient(circle at 77% 35%, rgba(77, 219, 255, 0.18), transparent 28%),
      radial-gradient(circle at 9% 85%, rgba(155, 243, 255, 0.12), transparent 28%),
      linear-gradient(135deg, #020405 0%, #070a0b 52%, #020405 100%);
  }
  .card::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(77, 219, 255, 0.09) 1px, transparent 1px),
      linear-gradient(180deg, rgba(245, 251, 255, 0.045) 1px, transparent 1px);
    background-size: 52px 52px;
    opacity: 0.55;
  }
  .card::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(2, 4, 5, 0.18), transparent 42%, rgba(2, 4, 5, 0.42)),
      radial-gradient(circle at 50% 50%, transparent 48%, rgba(0, 0, 0, 0.55));
  }
  .content {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    padding: 76px 82px;
  }
  .kicker {
    margin: 0 0 24px;
    color: #4ddbff;
    font-family: "JetBrains Mono", Consolas, monospace;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
  h1 {
    margin: 0;
    max-width: 700px;
    color: #fff;
    font-size: 74px;
    line-height: 0.9;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .subtitle {
    margin: 22px 0 0;
    max-width: 720px;
    color: #c8f7ff;
    font-size: 34px;
    line-height: 1.08;
    letter-spacing: -0.02em;
  }
  .body {
    margin: 22px 0 0;
    max-width: 610px;
    color: rgba(245, 251, 255, 0.64);
    font-size: 23px;
    line-height: 1.35;
  }
  .tags {
    position: absolute;
    left: 82px;
    bottom: 68px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  .tag {
    border: 1px solid rgba(77, 219, 255, 0.32);
    background: rgba(77, 219, 255, 0.075);
    padding: 10px 13px;
    color: rgba(200, 247, 255, 0.88);
    font-family: "JetBrains Mono", Consolas, monospace;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }
`;

const portfolioHtml = `
<!doctype html>
<html>
<head><style>${baseCss}
  .brand-logo {
    position: absolute;
    z-index: 1;
    right: -34px;
    top: 42px;
    width: 565px;
    height: 520px;
    object-fit: contain;
    opacity: 0.96;
    filter:
      drop-shadow(0 0 34px rgba(255, 255, 255, 0.22))
      drop-shadow(0 0 74px rgba(77, 219, 255, 0.28));
  }
  .ring {
    position: absolute;
    z-index: 1;
    right: 120px;
    bottom: 26px;
    width: 520px;
    height: 180px;
    border: 1px solid rgba(77, 219, 255, 0.22);
    border-radius: 50%;
    transform: rotate(-8deg);
    box-shadow: 0 0 70px rgba(77, 219, 255, 0.08);
  }
  .terminal-line {
    position: absolute;
    z-index: 2;
    right: 72px;
    bottom: 66px;
    color: rgba(77, 219, 255, 0.68);
    font-family: "JetBrains Mono", Consolas, monospace;
    font-size: 18px;
    letter-spacing: 0.12em;
  }
</style></head>
<body>
  <div class="card">
    <div class="ring"></div>
    <img class="brand-logo" src="${assetUrl('brand-logo.png')}" />
    <div class="content">
      <p class="kicker">&gt; jesaias.dk</p>
      <h1>Linas Jesaias</h1>
      <p class="subtitle">AI-assisted Creative Developer / Product Prototyper</p>
      <p class="body">Web products, interactive tools and music software built from idea to working product.</p>
      <div class="tags">
        <span class="tag">Web Products</span>
        <span class="tag">AI Prototyping</span>
        <span class="tag">Interactive Tools</span>
        <span class="tag">Music Software</span>
      </div>
      <div class="terminal-line">system_status: available</div>
    </div>
  </div>
</body>
</html>`;

const audioHtml = `
<!doctype html>
<html>
<head><style>${baseCss}
  .content { padding: 70px 76px; }
  h1 { max-width: 480px; font-size: 68px; }
  .subtitle { max-width: 500px; color: #77c8ff; }
  .body { max-width: 500px; }
  .mockups {
    position: absolute;
    z-index: 1;
    right: 52px;
    top: 66px;
    width: 610px;
    height: 470px;
    perspective: 900px;
  }
  .panel {
    position: absolute;
    overflow: hidden;
    border: 1px solid rgba(119, 200, 255, 0.34);
    background: rgba(8, 10, 12, 0.92);
    box-shadow: 0 28px 90px rgba(0, 0, 0, 0.55), 0 0 48px rgba(77, 219, 255, 0.08);
  }
  .panel img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .panel.orvo {
    left: 40px;
    top: 0;
    width: 520px;
    height: 292px;
    transform: rotateY(-10deg) rotateZ(-2deg);
  }
  .panel.midium {
    left: 0;
    bottom: 24px;
    width: 300px;
    height: 170px;
    transform: rotateZ(3deg);
  }
  .panel.abyx {
    right: 0;
    bottom: 0;
    width: 280px;
    height: 170px;
    transform: rotateZ(-2deg);
  }
  .audio-mark {
    position: absolute;
    right: 74px;
    bottom: 58px;
    z-index: 2;
    color: rgba(245, 251, 255, 0.72);
    font-family: "JetBrains Mono", Consolas, monospace;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.32em;
  }
</style></head>
<body>
  <div class="card">
    <div class="mockups">
      <div class="panel orvo"><img src="${assetUrl('projects/orvo-mockup.png')}" /></div>
      <div class="panel midium"><img src="${assetUrl('projects/midium.png')}" /></div>
      <div class="panel abyx"><img src="${assetUrl('projects/abyx.png')}" /></div>
    </div>
    <div class="content">
      <p class="kicker">&gt; jesaias.audio</p>
      <h1>Jesaias Audio</h1>
      <p class="subtitle">Tools that make music feel playable.</p>
      <p class="body">Independent music software concepts for drawing, reshaping and performing new ideas.</p>
      <div class="tags">
        <span class="tag">ORVO</span>
        <span class="tag">MIDIUM</span>
        <span class="tag">ABYX</span>
      </div>
      <div class="audio-mark">MUSIC SOFTWARE</div>
    </div>
  </div>
</body>
</html>`;

async function render(html, filename) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.screenshot({
    path: join(outDir, filename),
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });
  await browser.close();
}

await render(portfolioHtml, 'og-portfolio-2026.png');
await render(audioHtml, 'og-audio-2026.png');
