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
    default: "Jesaias — Creative Developer",
    template: "%s | Jesaias",
  },
  applicationName: "Jesaias Portfolio",
  description: "Creative developer in Copenhagen building full-stack software, audio tools, games and playful digital systems.",
  keywords: ["Jesaias", "creative developer", "software engineer", "full-stack developer", "audio software", "game developer", "Next.js", "Copenhagen"],
  authors: [{ name: "Jesaias" }],
  creator: "Jesaias",
  publisher: "Jesaias",
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
    siteName: 'Jesaias — Creative Developer',
    title: 'Jesaias — Creative Developer',
    description: 'Code, sound and playful systems — built with intent.',
    images: [
      {
        url: '/og-portfolio-2026.png',
        width: 1731,
        height: 909,
        alt: 'Jesaias - Creative Developer Portfolio Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jesaias — Creative Developer',
    description: 'Code, sound and playful systems — built with intent.',
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
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/icon.png',
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
                  "name": "Jesaias",
                  "url": SITE_URL,
                  "jobTitle": "Creative Developer & Software Engineer",
                  "description": "Creative developer building full-stack software, audio tools, games and playful digital systems.",
                  "knowsAbout": ["Full-stack development", "Audio software", "Creative coding", "Game development"],
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
                  "name": "Jesaias — Creative Developer",
                  "description": "Code, sound and playful systems — built with intent.",
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
