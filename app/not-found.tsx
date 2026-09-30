import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';

export default function NotFound() {
  return (
    <main>
      <div className="top-pattern" aria-hidden="true" />
      <div className="page-shell">
        <SiteHeader />
        <section className="not-found">
          <p className="eyebrow">Erreur 404</p>
          <h1>Page introuvable</h1>
          <Link href="/programme/" className="registration-link">Programme</Link>
        </section>
      </div>
    </main>
  );
}
