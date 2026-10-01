import Link from 'next/link';
import { CalendarDays } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link
        href="/"
        className="brand curieux-mexique-wordmark brand-wordmark"
        aria-label="Curieux Mexique, accueil"
      >
        Curieux<span>Mexique</span>
      </Link>
      <nav className="desktop-nav" aria-label="Navigation principale">
        <Link href="/programme/">Programme</Link>
        <Link href="/lieux/">Carte</Link>
        <a href="mailto:curieuxmexique@lilo.org">Contact</a>
      </nav>
      <Link className="mobile-menu" href="/programme/" aria-label="Programme">
        <CalendarDays aria-hidden="true" />
      </Link>
    </header>
  );
}
