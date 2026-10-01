import type { Metadata } from 'next';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { VenuesExplorer, type VenueExplorerItem } from '@/components/venues-explorer';
import {
  eventsById,
  formatSessionDate,
  formatsById,
  monthsForSession,
  orderedSessions,
  programme,
  venueAddress,
} from '@/lib/programme';

export const metadata: Metadata = {
  title: 'Carte',
  description: 'La carte des rendez-vous de Curieux Mexique dans le Cap-Sizun.',
};

export default function VenuesPage() {
  const usedVenueIds = new Set(programme.sessions.map((session) => session.venueId));
  const venues = programme.venues
    .filter((venue) => usedVenueIds.has(venue.id) && venue.kind !== 'territory')
    .sort((a, b) => {
      const locality = a.address.locality.localeCompare(b.address.locality, 'fr');
      return locality || a.name.localeCompare(b.name, 'fr');
    });
  const sessionsByVenue = orderedSessions.reduce((groups, session) => {
    const venueSessions = groups.get(session.venueId) ?? [];
    venueSessions.push(session);
    groups.set(session.venueId, venueSessions);
    return groups;
  }, new Map<string, typeof orderedSessions>());
  const items: VenueExplorerItem[] = venues.map((venue) => ({
    id: venue.id,
    name: venue.name,
    address: venueAddress(venue),
    locality: venue.address.locality,
    latitude: venue.geo?.latitude ?? null,
    longitude: venue.geo?.longitude ?? null,
    events: (sessionsByVenue.get(venue.id) ?? []).flatMap((session) => {
      const event = eventsById.get(session.eventId);
      const formatLabel = event ? (formatsById.get(event.formatId)?.label ?? event.formatId) : '';
      return event
        ? [{
            id: session.id,
            slug: event.slug,
            title: event.title,
            dateLabel: formatSessionDate(session),
            startsOn: session.timing.kind === 'scheduled'
              ? session.timing.startsAt.slice(0, 10)
              : session.timing.startsOn,
            endsOn: session.timing.kind === 'scheduled'
              ? session.timing.startsAt.slice(0, 10)
              : session.timing.endsOn,
            themeIds: event.themeIds,
            months: monthsForSession(session),
            searchText: [
              event.title,
              event.summary,
              formatLabel,
              venue.name,
              venue.address.locality,
            ].join(' ').toLocaleLowerCase('fr'),
          }]
        : [];
    }),
    website: venue.website,
  }));

  return (
    <main>
      <div className="top-pattern pattern-green" aria-hidden="true" />
      <div className="page-shell">
        <SiteHeader />
        <header className="page-intro page-intro-compact">
          <h1>La carte</h1>
        </header>
        <VenuesExplorer venues={items} themes={programme.themes} />
        <SiteFooter />
      </div>
    </main>
  );
}
