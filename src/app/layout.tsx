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
  title: "Jesaias — Kreativ Udvikler",
  description: "Portfolio of Jesaias — Creative Developer, Audio Engineer, and Digital Craftsman",
  keywords: ["portfolio", "web developer", "full-stack", "audio", "VST", "Jesaias", "kreativ udvikler"],
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
