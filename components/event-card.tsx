import Link from 'next/link';
import { MapPin } from 'lucide-react';
import type { Event, Session } from '@/lib/programme';
import { formatSessionDate, formatsById, sessionDayParts, venuesById } from '@/lib/programme';

export function EventCard({ event, session }: { event: Event; session: Session }) {
  const venue = venuesById.get(session.venueId);
  const format = formatsById.get(event.formatId);
  const dateParts = sessionDayParts(session);

  return (
    <article className={`event-card event-${event.formatId}`}>
      <div className="event-date" aria-hidden="true">
        <strong>{dateParts.day}</strong>
        <span>{dateParts.month}</span>
      </div>
      <div className="event-card-body">
        <p className="event-format">{format?.label ?? event.formatId}</p>
        <h3><Link href={`/evenements/${event.slug}/`}>{event.title}</Link></h3>
        <p className="event-meta">{formatSessionDate(session)}</p>
        {venue ? (
          <p className="event-place">
            <MapPin aria-hidden="true" />
            {venue.name} · {venue.address.locality}
          </p>
        ) : null}
      </div>
    </article>
  );
}
