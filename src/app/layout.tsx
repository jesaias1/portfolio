import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import SmoothScroll from '@/components/SmoothScroll';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import GlitchTransition from '@/components/GlitchTransition';
import { SITE_URL } from '@/lib/seo';


const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Linas Jesaias - AI-assisted Creative Developer",
    template: "%s | Jesaias",
  },
  applicationName: "Jesaias Portfolio",
  description: "AI-assisted creative developer in Copenhagen building web products, interactive tools and music software from idea to working product.",
  keywords: ["Linas Jesaias", "Jesaias", "AI-assisted creative developer", "product prototyper", "frontend developer", "audio software", "interactive tools", "Next.js", "Copenhagen"],
  authors: [{ name: "Linas Jesaias" }],
  creator: "Linas Jesaias",
  publisher: "Linas Jesaias",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jesaias.dk',
    siteName: 'Linas Jesaias - Creative Product Builder',
    title: 'Linas Jesaias - AI-assisted Creative Developer / Product Prototyper',
    description: 'Web products, interactive tools and music software built from idea to working product.',
    images: [
      {
        url: '/og-portfolio-2026.png',
        width: 1200,
        height: 630,
        alt: 'Linas Jesaias portfolio preview with glowing logo and creative developer positioning',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Linas Jesaias - AI-assisted Creative Developer / Product Prototyper',
    description: 'Web products, interactive tools and music software built from idea to working product.',
    images: ['/og-portfolio-2026.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/app-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/app-icon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    title: 'Jesaias',
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased" suppressHydrationWarning style={{ fontFamily: 'var(--font-display)' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": `${SITE_URL}/#person`,
                  "name": "Linas Jesaias",
                  "url": SITE_URL,
                  "jobTitle": "AI-assisted Creative Developer / Product Prototyper",
                  "description": "Creative product builder creating web products, interactive tools and music software with visual direction, product thinking and AI-assisted development workflows.",
                  "knowsAbout": ["AI-assisted development", "Frontend development", "Product prototyping", "Audio software", "Creative coding", "Game logic"],
                  "sameAs": [
                    "https://github.com/jesaias1",
                    "https://www.linkedin.com/in/jesaias/",
                    "https://www.instagram.com/linasjesaias/"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  "url": SITE_URL,
                  "name": "Linas Jesaias - Creative Product Builder",
                  "description": "Web products, interactive tools and music software built from idea to working product.",
                  "inLanguage": "en",
                  "author": { "@id": `${SITE_URL}/#person` }
                }
              ]
            }).replace(/</g, '\\u003c')
          }}
        />

        <GlitchTransition />
        <SmoothScroll>
          <div className="bg-grid bg-grain">
            {children}
          </div>
        </SmoothScroll>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0a0a0a',
              color: '#4ddbff',
              border: '1px solid rgba(77, 219, 255, 0.3)',
              fontFamily: 'var(--font-mono)',
              borderRadius: '0',
            },
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
