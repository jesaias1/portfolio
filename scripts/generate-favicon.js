// Generate favicon.ico and icon.png from the logo
// Uses the canvas package to create a simplified favicon
const fs = require('fs');
const path = require('path');

// Since we can't easily resize the logo without sharp/canvas,
// we'll create an SVG-based favicon that matches the logo's wave design
const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" fill="#0a0a0a"/>
  <g fill="none" stroke="#4ddbff" stroke-width="1.5" stroke-linecap="round">
    <!-- Top bar -->
    <line x1="3" y1="8" x2="29" y2="8" opacity="0.9"/>
    <line x1="4" y1="10" x2="28" y2="10" opacity="0.7"/>
    <!-- Wave swoosh -->
    <path d="M 22 14 Q 18 14, 16 18 Q 14 22, 10 22 Q 7 22, 5 20" stroke-width="2" opacity="0.9"/>
    <path d="M 27 14 Q 26 16, 24 18 Q 22 20, 20 22 Q 18 24, 14 24" stroke-width="1.5" opacity="0.6"/>
  </g>
</svg>`;

// Write SVG as a file
const publicDir = path.join(__dirname, '..', 'public');

// Save as SVG icon (Next.js can use SVG favicons)
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgFavicon);

console.log('[✓] Generated icon.svg favicon');

// Also copy logo.png as icon.png for Next.js metadata
const logoPng = path.join(publicDir, 'logo.png');
const iconPng = path.join(publicDir, 'icon.png');
if (fs.existsSync(logoPng)) {
  fs.copyFileSync(logoPng, iconPng);
  console.log('[✓] Copied logo.png → icon.png');
}

console.log('[done] Favicon files ready');
