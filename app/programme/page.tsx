import type { Metadata } from 'next';
import { ProgrammeBrowser, type ProgrammeItem } from '@/components/programme-browser';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import {
  eventsById,
  formatSessionDate,
  formatsById,
  orderedSessions,
  programme,
  sessionDayParts,
  venuesById,
} from '@/lib/programme';

export const metadata: Metadata = {
  title: 'Programme',
  description: 'Tous les rendez-vous de Curieux Mexique 2026, filtrables par mois et par thème.',
};

function monthsForSession(session: (typeof orderedSessions)[number]) {
  if (session.timing.kind === 'scheduled') return [session.timing.startsAt.slice(5, 7)];
  const start = Number(session.timing.startsOn.slice(5, 7));
  const end = Number(session.timing.endsOn.slice(5, 7));
  return Array.from({ length: end - start + 1 }, (_, index) => String(start + index).padStart(2, '0'));
}

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
        <header className="page-intro">
          <p className="eyebrow">Octobre — novembre 2026</p>
          <h1>Le programme</h1>
          <p>Composez votre parcours parmi les rendez-vous proposés dans tout le Cap-Sizun.</p>
        </header>
        <ProgrammeBrowser items={items} themes={programme.themes} />
        <SiteFooter />
      </div>
    </main>
  );
}
