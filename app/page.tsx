import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, MapPinned } from 'lucide-react';
import { EventCard } from '@/components/event-card';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { eventsById, orderedSessions } from '@/lib/programme';

export default function Home() {
  const nextSessions = orderedSessions
    .filter((session) => session.timing.kind === 'scheduled')
    .slice(0, 3);

  return (
    <main>
      <div className="top-pattern" aria-hidden="true" />
      <div className="page-shell">
        <SiteHeader />

        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">Curieux<span>Mexique</span></h1>
            <p className="hero-lead">
              Deux mois pour découvrir le Mexique par la photographie, la
              musique, la littérature, le cinéma et les arts vivants.
            </p>
            <div className="hero-actions">
              <Button size="lg" className="primary-action" nativeButton={false} render={<Link href="/programme/" />}>
                Voir le programme <ArrowRight aria-hidden="true" />
              </Button>
              <Button size="lg" variant="outline" className="secondary-action" nativeButton={false} render={<Link href="/lieux/" />}>
                Explorer les lieux
              </Button>
            </div>
            <dl className="hero-facts">
              <div>
                <CalendarDays aria-hidden="true" />
                <dt>Quand</dt>
                <dd>Octobre — novembre 2026</dd>
              </div>
              <div>
                <MapPinned aria-hidden="true" />
                <dt>Où</dt>
                <dd>Cap-Sizun · Pointe du Raz</dd>
              </div>
            </dl>
          </div>

          <figure className="poster-wrap">
            <div className="poster-shadow" aria-hidden="true" />
            <Image
              src="/curieux-mexique-cover.webp"
              alt="Affiche Curieux Mexique 2026, portrait en noir et blanc devant des cactus"
              width={1200}
              height={1697}
              priority
              className="poster-image"
            />
          </figure>
        </section>

        <section className="upcoming" aria-labelledby="upcoming-title">
          <div className="section-heading">
            <div>
              <h2 id="upcoming-title">Les premiers rendez-vous</h2>
            </div>
            <Link href="/programme/" className="text-link">
              Tout le programme <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className="event-grid">
            {nextSessions.map((session) => {
              const event = eventsById.get(session.eventId);
              return event ? <EventCard key={session.id} event={event} session={session} /> : null;
            })}
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
