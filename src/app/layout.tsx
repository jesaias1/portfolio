import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

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
  metadataBase: new URL('https://jesaias.dev'),
  title: "Jesaias — Kreativ Udvikler",
  description: "Portfolio of Jesaias — Creative Developer, Audio Engineer, and Digital Craftsman. Full-stack web apps, VST plugins, After Effects extensions, and more.",
  keywords: ["portfolio", "web developer", "full-stack", "audio", "VST", "Jesaias", "kreativ udvikler", "react", "next.js"],
  authors: [{ name: "Jesaias" }],
  openGraph: {
    type: 'website',
    locale: 'da_DK',
    url: 'https://jesaias.dev',
    siteName: 'Jesaias — Kreativ Udvikler',
    title: 'Jesaias — Kreativ Udvikler',
    description: 'Creative Developer, Audio Engineer, and Digital Craftsman. Full-stack web apps, VST plugins, After Effects extensions.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Jesaias Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jesaias — Kreativ Udvikler',
    description: 'Creative Developer, Audio Engineer, and Digital Craftsman.',
    images: ['/logo.png'],
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
        <div className="bg-grid bg-grain">
          {children}
        </div>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0a0a0a',
              color: '#00ff41',
              border: '1px solid rgba(0, 255, 65, 0.3)',
              fontFamily: 'var(--font-mono)',
              borderRadius: '0',
            },
          }}
        />
      </body>
    </html>
  );
}
