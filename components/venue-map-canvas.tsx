'use client';

import { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import Link from 'next/link';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

export type VenueEventItem = {
  id: string;
  slug: string;
  title: string;
  dateLabel: string;
};

export type VenueMapItem = {
  id: string;
  name: string;
  address: string;
  locality: string;
  latitude: number;
  longitude: number;
  events: VenueEventItem[];
};

function markerIcon(active: boolean, count: number) {
  return L.divIcon({
    className: '',
    html: `<div class="venue-marker${active ? ' venue-marker-active' : ''}"><span>${count}</span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

function MapPosition({ venues, activeVenue }: { venues: VenueMapItem[]; activeVenue: VenueMapItem | null }) {
  const map = useMap();
  const bounds = useMemo(
    () => L.latLngBounds(venues.map((venue) => [venue.latitude, venue.longitude])),
    [venues],
  );

  useEffect(() => {
    map.invalidateSize();
    if (activeVenue) {
      map.flyTo([activeVenue.latitude, activeVenue.longitude], 15, { duration: 0.45 });
      return;
    }
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [28, 28], maxZoom: 12 });
  }, [activeVenue, bounds, map]);

  return null;
}

function VenueMarker({
  venue,
  active,
  onSelectVenue,
}: {
  venue: VenueMapItem;
  active: boolean;
  onSelectVenue: (venueId: string) => void;
}) {
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (active) markerRef.current?.openPopup();
  }, [active]);

  return (
    <Marker
      ref={markerRef}
      position={[venue.latitude, venue.longitude]}
      icon={markerIcon(active, venue.events.length)}
      title={venue.name}
      eventHandlers={{ click: () => onSelectVenue(venue.id) }}
    >
      <Popup>
        <strong className="venue-popup-title">{venue.name}</strong>
        <span className="venue-popup-address">{venue.address}</span>
        <ul className="venue-popup-events">
          {venue.events.map((event) => (
            <li key={event.id}>
              <Link href={`/evenements/${event.slug}/`}>
                <span>{event.dateLabel}</span>
                <strong>{event.title}</strong>
              </Link>
            </li>
          ))}
        </ul>
      </Popup>
    </Marker>
  );
}

export function VenueMapCanvas({
  venues,
  activeVenueId,
  onSelectVenue,
}: {
  venues: VenueMapItem[];
  activeVenueId: string | null;
  onSelectVenue: (venueId: string) => void;
}) {
  const activeVenue = venues.find((venue) => venue.id === activeVenueId) ?? null;

  return (
    <MapContainer center={[48.035, -4.57]} zoom={10} scrollWheelZoom className="venue-map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapPosition venues={venues} activeVenue={activeVenue} />
      {venues.map((venue) => (
        <VenueMarker
          key={venue.id}
          venue={venue}
          active={venue.id === activeVenueId}
          onSelectVenue={onSelectVenue}
        />
      ))}
    </MapContainer>
  );
}
