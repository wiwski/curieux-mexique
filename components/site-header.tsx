import Link from 'next/link';
import { CalendarDays, MapPin } from 'lucide-react';

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
      <nav className="mobile-nav" aria-label="Navigation principale">
        <Link className="mobile-nav-link" href="/programme/" aria-label="Programme">
          <CalendarDays aria-hidden="true" />
        </Link>
        <Link className="mobile-nav-link" href="/lieux/" aria-label="Carte">
          <MapPin aria-hidden="true" />
        </Link>
      </nav>
    </header>
  );
}
