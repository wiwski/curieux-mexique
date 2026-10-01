import type { Metadata } from 'next';
import { ProgrammeBrowser, type ProgrammeItem } from '@/components/programme-browser';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import {
  eventsById,
  formatSessionDate,
  formatsById,
  monthsForSession,
  orderedSessions,
  programme,
  sessionDayParts,
  venuesById,
} from '@/lib/programme';

export const metadata: Metadata = {
  title: 'Programme',
  description: 'Tous les rendez-vous de Curieux Mexique 2026, filtrables par mois et par thème.',
};

export default function ProgrammePage() {
  const items: ProgrammeItem[] = orderedSessions.flatMap((session) => {
    const event = eventsById.get(session.eventId);
    const venue = venuesById.get(session.venueId);
    if (!event || !venue) return [];
    const formatLabel = formatsById.get(event.formatId)?.label ?? event.formatId;
    const dateParts = sessionDayParts(session);
    return [{
      id: session.id,
      slug: event.slug,
      title: event.title,
      summary: event.summary,
      formatId: event.formatId,
      formatLabel,
      themeIds: event.themeIds,
      venueName: venue.name,
      venueLocality: venue.address.locality,
      dateLabel: formatSessionDate(session),
      day: dateParts.day,
      monthLabel: dateParts.month,
      months: monthsForSession(session),
      searchText: [event.title, event.summary, formatLabel, venue.name, venue.address.locality]
        .join(' ')
        .toLocaleLowerCase('fr'),
    }];
  });

  return (
    <main>
      <div className="top-pattern pattern-blue" aria-hidden="true" />
      <div className="page-shell">
        <SiteHeader />
        <header className="page-intro page-intro-compact">
          <h1>Le programme</h1>
        </header>
        <ProgrammeBrowser items={items} themes={programme.themes} />
        <SiteFooter />
      </div>
    </main>
  );
}
