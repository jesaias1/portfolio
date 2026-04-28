import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dansk Ordliste | Jesaias',
  description: 'Download en omfattende liste over danske ord i CSV-format.',
};

export default function OrdlistePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative z-10 p-6">
      <div className="glass-card max-w-lg w-full p-8 md:p-12 relative overflow-hidden group stagger-item">
        {/* Glow effect on top edge */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--terminal-green)] to-transparent opacity-50" />
        
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="w-16 h-16 rounded-full border border-[var(--border-bright)] flex items-center justify-center bg-[var(--card-bg)] mb-2 shadow-[0_0_15px_rgba(77,219,255,0.2)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--terminal-green)]">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white glow-text">
              Dansk Ordliste
            </h1>
            <p className="text-[var(--foreground)] opacity-70 font-mono text-sm max-w-sm mx-auto leading-relaxed">
              En komplet samling af danske ord til fri afbenyttelse. Perfekt til udvikling, dataanalyse og word games.
            </p>
          </div>

          <a 
            href="/danish-words.csv" 
            download="Danish_Words.csv"
            className="relative inline-flex h-14 items-center justify-center px-8 font-mono text-sm font-medium transition-all duration-300 bg-[rgba(77,219,255,0.05)] text-[var(--terminal-green)] border border-[var(--border-bright)] hover:bg-[rgba(77,219,255,0.15)] hover:border-[var(--terminal-green)] hover:shadow-[0_0_20px_rgba(77,219,255,0.3)] w-full shimmer-on-hover overflow-hidden"
          >
            <span className="mr-2">&gt; DOWNLOAD_FIL</span>
            <span className="opacity-50 text-xs">(.csv)</span>
          </a>

          <div className="pt-4 border-t border-[var(--border)] w-full flex justify-center">
            <Link href="/" className="text-xs font-mono text-[var(--foreground)] opacity-50 hover:opacity-100 hover:text-[var(--terminal-green)] transition-all cursor-pointer">
              [ RETURN_HOME ]
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
