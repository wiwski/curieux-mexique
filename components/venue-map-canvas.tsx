'use client';

import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

export type VenueMapItem = {
  id: string;
  name: string;
  address: string;
  locality: string;
  latitude: number;
  longitude: number;
  eventCount: number;
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
        <Marker
          key={venue.id}
          position={[venue.latitude, venue.longitude]}
          icon={markerIcon(venue.id === activeVenueId, venue.eventCount)}
          title={venue.name}
          eventHandlers={{ click: () => onSelectVenue(venue.id) }}
        >
          <Popup>
            <strong>{venue.name}</strong>
            <span>{venue.address}</span>
            <small>{venue.eventCount} rendez-vous</small>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
