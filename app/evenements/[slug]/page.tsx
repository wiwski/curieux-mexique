import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, ExternalLink, MapPin, Ticket } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import {
  contributorsById,
  formatSessionDate,
  formatsById,
  programme,
  sessionsForEvent,
  themesById,
  venueAddress,
  venuesById,
} from '@/lib/programme';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return programme.events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = programme.events.find((candidate) => candidate.slug === slug);
  if (!event) return {};
  return {
    title: event.title,
    description: event.summary,
    openGraph: { title: event.title, description: event.summary, images: [] },
    twitter: { card: 'summary', title: event.title, description: event.summary, images: [] },
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = programme.events.find((candidate) => candidate.slug === slug);
  if (!event) notFound();

  const sessions = sessionsForEvent(event.id);
  const format = formatsById.get(event.formatId);
  const themes = event.themeIds.map((id) => themesById.get(id)).filter(Boolean);

  return (
    <main>
      <div className="top-pattern pattern-red" aria-hidden="true" />
      <div className="page-shell">
        <SiteHeader />
        <article className="event-detail">
          <Link href="/programme/" className="back-link"><ArrowLeft aria-hidden="true" /> Retour au programme</Link>
          <div className="event-detail-grid">
            <header className="event-detail-header">
              <p className="eyebrow">{format?.label ?? event.formatId}</p>
              <h1>{event.title}</h1>
              <p className="event-detail-lead">{event.summary}</p>
              <div className="theme-list" aria-label="Thèmes">
                {themes.map((theme) => theme ? <span key={theme.id}>{theme.label}</span> : null)}
              </div>
            </header>

            <aside className="event-practical" aria-labelledby="practical-title">
              <h2 id="practical-title">Infos pratiques</h2>
              {sessions.map((session) => {
                const venue = venuesById.get(session.venueId);
                return (
                  <div key={session.id} className="practical-session">
                    <p><CalendarDays aria-hidden="true" /><strong>{formatSessionDate(session)}</strong></p>
                    {venue ? (
                      <p><MapPin aria-hidden="true" /><span>{venue.name}<small>{venueAddress(venue)}</small></span></p>
                    ) : null}
                  </div>
                );
              })}
              {event.pricing.details ? (
                <p className="price-line"><Ticket aria-hidden="true" /><span><strong>Tarifs</strong><small>{event.pricing.details}</small></span></p>
              ) : null}
              {event.registration.required && event.registration.value ? (
                <a className="registration-link" href={event.registration.method === 'email' ? `mailto:${event.registration.value}` : event.registration.value}>
                  {event.registration.label ?? 'S’inscrire'} <ExternalLink aria-hidden="true" />
                </a>
              ) : null}
            </aside>

            <div className="event-description">
              <h2>À propos</h2>
              <p>{event.description ?? event.summary}</p>
              {event.credits.length ? (
                <div className="credits-block">
                  <h2>Avec</h2>
                  <ul>
                    {event.credits.map((credit) => {
                      const contributor = contributorsById.get(credit.contributorId);
                      return contributor ? (
                        <li key={`${credit.contributorId}-${credit.role}`}>
                          <strong>{contributor.name}</strong><span>{credit.role}</span>
                        </li>
                      ) : null;
                    })}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </article>
        <SiteFooter />
      </div>
    </main>
  );
}
