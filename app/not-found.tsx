import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';

export default function NotFound() {
  return (
    <main>
      <div className="top-pattern" aria-hidden="true" />
      <div className="page-shell">
        <SiteHeader />
        <section className="not-found">
          <p className="eyebrow">Erreur 404</p>
          <h1>Cette page s’est égarée</h1>
          <p>Le programme, lui, est toujours bien là.</p>
          <Link href="/programme/" className="registration-link"><ArrowLeft aria-hidden="true" /> Voir le programme</Link>
        </section>
      </div>
    </main>
  );
}
