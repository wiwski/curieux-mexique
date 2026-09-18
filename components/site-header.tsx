import Link from 'next/link';
import { Menu } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Curieux Mexique, accueil">
        <span className="brand-mark" aria-hidden="true">CM</span>
        <span>
          <strong>Curieux Mexique</strong>
          <small>Cap-Sizun · 2026</small>
        </span>
      </Link>
      <nav className="desktop-nav" aria-label="Navigation principale">
        <Link href="/programme/">Programme</Link>
        <Link href="/lieux/">Lieux</Link>
        <a href="mailto:curieuxmexique@lilo.org">Contact</a>
      </nav>
      <Link className="mobile-menu" href="/programme/" aria-label="Ouvrir le programme">
        <Menu aria-hidden="true" />
      </Link>
    </header>
  );
}
