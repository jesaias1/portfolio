import type { CSSProperties } from 'react';
import TransitionLink from '@/components/TransitionLink';
import styles from './ProjectNavigation.module.css';

const projects = [
  { slug: 'orvo', title: 'ORVO', category: 'Audio instrument', href: '/audio/orvo' },
  { slug: 'midium', title: 'MIDIUM', category: 'Visual MIDI tool', href: '/audio/midium' },
  { slug: 'abyx', title: 'ABYX', category: 'Gamepad instrument', href: '/audio/abyx' },
  { slug: 'kvizy', title: 'KVIZY', category: 'Offline quiz game', href: '/projects/kvizy' },
] as const;

export default function ProjectNavigation({
  currentSlug,
  accent = '#4ddbff',
}: {
  currentSlug: (typeof projects)[number]['slug'];
  accent?: string;
}) {
  const currentIndex = projects.findIndex((project) => project.slug === currentSlug);
  const previous = projects[(currentIndex - 1 + projects.length) % projects.length];
  const next = projects[(currentIndex + 1) % projects.length];

  return (
    <nav
      aria-label="Browse portfolio projects"
      className={styles.navigation}
      style={{ '--pager-accent': accent } as CSSProperties}
    >
      <TransitionLink href={previous.href} className={styles.project} ariaLabel={`Previous project: ${previous.title}`}>
        <span className={styles.direction}>← Previous</span>
        <strong className={styles.title}>{previous.title}</strong>
        <span className={styles.category}>{previous.category}</span>
      </TransitionLink>

      <TransitionLink href="/#projects" className={styles.index} ariaLabel="Back to all portfolio projects">
        All projects
      </TransitionLink>

      <TransitionLink href={next.href} className={`${styles.project} ${styles.next}`} ariaLabel={`Next project: ${next.title}`}>
        <span className={styles.direction}>Next →</span>
        <strong className={styles.title}>{next.title}</strong>
        <span className={styles.category}>{next.category}</span>
      </TransitionLink>
    </nav>
  );
}
