'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type MouseEvent, type ReactNode, useEffect, useRef } from 'react';

export default function TransitionLink({
  href,
  children,
  className,
  ariaLabel,
}: {
  href: string;
  children?: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const router = useRouter();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    event.preventDefault();
    window.dispatchEvent(new CustomEvent('glitch-trigger'));
    timerRef.current = window.setTimeout(() => router.push(href), 280);
  };

  return (
    <Link href={href} className={className} aria-label={ariaLabel} onClick={handleClick}>
      {children}
    </Link>
  );
}
