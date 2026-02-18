import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import SoundController from '@/components/SoundController';
import SmoothScroll from '@/components/SmoothScroll';

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
  metadataBase: new URL('https://jesaias.dk'),
  title: "Jesaias — Kreativ Udvikler",
  description: "Portfolio of Jesaias — Creative Developer, Audio Engineer, and Digital Craftsman. Full-stack web apps, VST plugins, After Effects extensions, and more.",
  keywords: ["portfolio", "web developer", "full-stack", "audio", "VST", "Jesaias", "kreativ udvikler", "react", "next.js"],
  authors: [{ name: "Jesaias" }],
  openGraph: {
    type: 'website',
    locale: 'da_DK',
    url: 'https://jesaias.dk',
    siteName: 'Jesaias — Kreativ Udvikler',
    title: 'Jesaias — Next-Level Portfolio',
    description: 'Skaber digitale oplevelser der overskrider grænserne. Fullstack-udvikling, Audio og Design.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jesaias — Kreativ Udvikler Portfolio Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jesaias — Next-Level Portfolio',
    description: 'Creative Developer, Audio Engineer, and Digital Craftsman.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
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
    <html lang="da" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased" style={{ fontFamily: 'var(--font-display)' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Jesaias",
              "url": "https://jesaias.dk",
              "jobTitle": "Creative Developer & Audio Engineer",
              "description": "Creative Developer specializing in Full-stack web development, VST plugins, and Audio software engineering.",
              "sameAs": [
                "https://github.com/jesaias1",
                "https://linkedin.com"
              ]
            })
          }}
        />
        <SmoothScroll>
          <div className="bg-grid bg-grain">
            {children}
          </div>
        </SmoothScroll>
        <SoundController />
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
      </body>
    </html>
  );
}
