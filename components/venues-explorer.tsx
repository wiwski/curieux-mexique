'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { MapPin } from 'lucide-react';
import type { VenueMapItem } from '@/components/venue-map-canvas';

const VenueMapCanvas = dynamic(
  () => import('@/components/venue-map-canvas').then((module) => module.VenueMapCanvas),
  {
    ssr: false,
    loading: () => <div className="venue-map-loading">Chargement de la carte…</div>,
  },
);

export type VenueExplorerItem = Omit<VenueMapItem, 'latitude' | 'longitude'> & {
  latitude: number | null;
  longitude: number | null;
  website: string | null;
};

export function VenuesExplorer({ venues }: { venues: VenueExplorerItem[] }) {
  const [activeVenueId, setActiveVenueId] = useState<string | null>(null);
  const mappedVenues: VenueMapItem[] = venues.flatMap((venue) =>
    venue.latitude === null || venue.longitude === null
      ? []
      : [{ ...venue, latitude: venue.latitude, longitude: venue.longitude }],
  );

  function selectVenue(venueId: string, source: 'map' | 'list') {
    setActiveVenueId(venueId);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const compactLayout = window.matchMedia('(max-width: 980px)').matches;
    if (source === 'list' && !compactLayout) return;
    window.requestAnimationFrame(() => {
      const targetId = source === 'map' ? `lieu-${venueId}` : 'carte';
      document.getElementById(targetId)?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: source === 'map' ? 'center' : 'start',
      });
    });
  }

  return (
    <div className="venues-layout">
      <aside className="venue-map-panel" aria-label="Carte des lieux" id="carte">
        <div className="venue-map-heading">
          <strong>Carte des lieux</strong>
          <span>{mappedVenues.length} lieux</span>
        </div>
        <VenueMapCanvas
          venues={mappedVenues}
          activeVenueId={activeVenueId}
          onSelectVenue={(venueId) => selectVenue(venueId, 'map')}
        />
      </aside>

      <section className="venues-list" aria-label="Liste des lieux">
        {venues.map((venue, index) => (
          <article
            className={`venue-card${activeVenueId === venue.id ? ' venue-card-active' : ''}`}
            key={venue.id}
            id={`lieu-${venue.id}`}
          >
            <span className="venue-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <p className="venue-locality">{venue.locality}</p>
            <h2>{venue.name}</h2>
            <p className="venue-address"><MapPin aria-hidden="true" /> {venue.address}</p>
            <p className="venue-events">{venue.eventCount} rendez-vous</p>
            <div className="venue-actions">
              {venue.latitude !== null && venue.longitude !== null ? (
                <button type="button" onClick={() => selectVenue(venue.id, 'list')}>Localiser</button>
              ) : null}
              {venue.website ? <a href={venue.website} target="_blank" rel="noreferrer">Site du lieu</a> : null}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
