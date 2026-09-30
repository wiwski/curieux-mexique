import type { Metadata } from 'next';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { VenuesExplorer, type VenueExplorerItem } from '@/components/venues-explorer';
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
  const eventCounts = programme.sessions.reduce<Record<string, number>>((counts, session) => {
    counts[session.venueId] = (counts[session.venueId] ?? 0) + 1;
    return counts;
  }, {});
  const items: VenueExplorerItem[] = venues.map((venue) => ({
    id: venue.id,
    name: venue.name,
    address: venueAddress(venue),
    locality: venue.address.locality,
    latitude: venue.geo?.latitude ?? null,
    longitude: venue.geo?.longitude ?? null,
    eventCount: eventCounts[venue.id] ?? 0,
    website: venue.website,
  }));

  return (
    <main>
      <div className="top-pattern pattern-green" aria-hidden="true" />
      <div className="page-shell">
        <SiteHeader />
        <header className="page-intro page-intro-compact">
          <h1>Les lieux</h1>
        </header>
        <VenuesExplorer venues={items} />
        <SiteFooter />
      </div>
    </main>
  );
}
