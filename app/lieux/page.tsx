import type { Metadata } from 'next';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { programme, venueAddress } from '@/lib/programme';

export const metadata: Metadata = {
  title: 'Lieux',
  description: 'Les lieux qui accueillent Curieux Mexique dans le Cap-Sizun.',
};

export default function VenuesPage() {
  const usedVenueIds = new Set(programme.sessions.map((session) => session.venueId));
  const venues = programme.venues
    .filter((venue) => usedVenueIds.has(venue.id) && venue.kind !== 'territory')
    .sort((a, b) => {
      const locality = a.address.locality.localeCompare(b.address.locality, 'fr');
      return locality || a.name.localeCompare(b.name, 'fr');
    });

  return (
    <main>
      <div className="top-pattern pattern-green" aria-hidden="true" />
      <div className="page-shell">
        <SiteHeader />
        <header className="page-intro">
          <p className="eyebrow">Tout le Cap-Sizun</p>
          <h1>Les lieux</h1>
          <p>Bibliothèques, salles, tiers-lieux et espaces culturels accueillent le programme au plus près des habitantes et habitants.</p>
        </header>
        <section className="venues-grid" aria-label="Lieux de Curieux Mexique">
          {venues.map((venue, index) => (
            <article className="venue-card" key={venue.id}>
              <span className="venue-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <p className="venue-locality">{venue.address.locality}</p>
              <h2>{venue.name}</h2>
              <p className="venue-address"><MapPin aria-hidden="true" /> {venueAddress(venue)}</p>
              {venue.website ? (
                <a href={venue.website} target="_blank" rel="noreferrer">
                  Site du lieu <ArrowUpRight aria-hidden="true" />
                </a>
              ) : null}
            </article>
          ))}
        </section>
        <SiteFooter />
      </div>
    </main>
  );
}
