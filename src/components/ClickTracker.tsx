'use client';

import { track } from '@vercel/analytics';
import { useEffect } from 'react';

/**
 * Sends a Vercel Analytics custom event when an element with data-track is clicked.
 * Extra data-track-* attributes become event properties, e.g.
 * <a data-track="download_click" data-track-product="orvo"> -> download_click { product: "orvo" }.
 */
export default function ClickTracker() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-track]') : null;
      const name = target?.dataset.track;
      if (!target || !name) return;

      const properties: Record<string, string> = {};
      for (const [key, value] of Object.entries(target.dataset)) {
        if (key.startsWith('track') && key !== 'track' && value) {
          const property = key.slice(5);
          properties[property.charAt(0).toLowerCase() + property.slice(1)] = value;
        }
      }
      track(name, properties);
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, []);

  return null;
}
