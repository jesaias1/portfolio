import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
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
  title: "Jesaias — Creative Developer",
  description: "Portfolio of Jesaias — Creative Developer and Software Engineer. Full-stack web apps, real-time systems, creative tools, and more.",
  keywords: ["portfolio", "web developer", "full-stack", "software engineer", "Jesaias", "creative developer", "react", "next.js"],
  authors: [{ name: "Jesaias" }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jesaias.dk',
    siteName: 'Jesaias — Creative Developer',
    title: 'Jesaias — Creative Developer',
    description: 'Creating digital experiences that transcend boundaries. Full-stack development, software engineering, and design.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jesaias — Creative Developer Portfolio Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jesaias — Creative Developer',
    description: 'Creative Developer and Software Engineer. Building premium digital experiences.',
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
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased" suppressHydrationWarning style={{ fontFamily: 'var(--font-display)' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Jesaias",
              "url": "https://jesaias.dk",
              "jobTitle": "Creative Developer & Software Engineer",
              "description": "Creative Developer specializing in full-stack web development, real-time systems, and modern software engineering.",
              "sameAs": [
                "https://github.com/jesaias1",
                "https://www.linkedin.com/in/jesaias/",
                "https://www.instagram.com/linasjesaias/"
              ]
            })
          }}
        />

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
      </body>
    </html>
  );
}
