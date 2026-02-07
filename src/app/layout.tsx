import type { Metadata } from "next";
import { Playfair_Display, Work_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

import CosmicBackground from "@/components/CosmicBackground";

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-display',
  display: 'swap',
});

const workSans = Work_Sans({ 
  subsets: ["latin"],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Jesaias",
  description: "Portfolio of Jesaias - Creative Developer",
  keywords: ["portfolio", "web developer", "full-stack", "design", "Jesaias"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${workSans.variable}`}>
      <body className="antialiased">
        <CosmicBackground />
        <div className="bg-grain">
          {children}
        </div>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a1a',
              color: '#fafafa',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            },
          }}
        />
      </body>
    </html>
  );
}
