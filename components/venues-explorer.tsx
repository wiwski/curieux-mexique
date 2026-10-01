'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
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
  commune: string;
  website: string | null;
};

export type VenueTypeOption = { id: string; label: string; themeIds: string[] };
type DateFilter = 'all' | 'today' | 'tomorrow' | 'week' | '10' | '11';

function dateKeyInParis(offsetDays = 0) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const target = new Date(Date.UTC(
    Number(value.year),
    Number(value.month) - 1,
    Number(value.day) + offsetDays,
    12,
  ));
  return target.toISOString().slice(0, 10);
}

function addDays(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + days, 12)).toISOString().slice(0, 10);
}

function currentWeek(today: string) {
  const weekday = new Date(`${today}T12:00:00Z`).getUTCDay() || 7;
  return {
    startsOn: addDays(today, 1 - weekday),
    endsOn: addDays(today, 7 - weekday),
  };
}

export function VenuesExplorer({
  venues,
  types,
}: {
  venues: VenueExplorerItem[];
  types: VenueTypeOption[];
}) {
  const [activeVenueId, setActiveVenueId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [type, setType] = useState('all');
  const [commune, setCommune] = useState('all');

  const communes = useMemo(
    () => [...new Set(venues.map((venue) => venue.commune))].sort((a, b) => a.localeCompare(b, 'fr')),
    [venues],
  );

  const filteredVenues = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('fr');
    const today = dateKeyInParis();
    const selectedPeriod = dateFilter === 'today'
      ? { startsOn: today, endsOn: today }
      : dateFilter === 'tomorrow'
        ? { startsOn: addDays(today, 1), endsOn: addDays(today, 1) }
        : dateFilter === 'week'
          ? currentWeek(today)
          : null;
    const selectedThemeIds = type === 'all'
      ? null
      : types.find((option) => option.id === type)?.themeIds ?? [];
    return venues.flatMap((venue) => {
      if (commune !== 'all' && venue.commune !== commune) return [];
      const events = venue.events.filter((event) => {
        const matchesQuery = !normalizedQuery
          || event.searchText.includes(normalizedQuery)
          || venue.commune.toLocaleLowerCase('fr').includes(normalizedQuery);
        const matchesDate = dateFilter === 'all'
          || (selectedPeriod
            ? event.startsOn <= selectedPeriod.endsOn && event.endsOn >= selectedPeriod.startsOn
            : event.months.includes(dateFilter));
        const matchesType = selectedThemeIds === null
          || selectedThemeIds.some((themeId) => event.themeIds.includes(themeId));
        return matchesQuery && matchesDate && matchesType;
      });
      return events.length ? [{ ...venue, events }] : [];
    });
  }, [commune, dateFilter, query, type, types, venues]);

  const mappedVenues: VenueMapItem[] = filteredVenues.flatMap((venue) =>
    venue.latitude === null || venue.longitude === null
      ? []
      : [{ ...venue, latitude: venue.latitude, longitude: venue.longitude }],
  );
  const eventCount = filteredVenues.reduce((count, venue) => count + venue.events.length, 0);
  const hasFilters = Boolean(query)
    || dateFilter !== 'all'
    || commune !== 'all'
    || type !== 'all';

  useEffect(() => {
    if (activeVenueId && !filteredVenues.some((venue) => venue.id === activeVenueId)) {
      setActiveVenueId(null);
    }
  }, [activeVenueId, filteredVenues]);

  function resetFilters() {
    setQuery('');
    setDateFilter('all');
    setCommune('all');
    setType('all');
    setActiveVenueId(null);
  }

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
    <div className="venue-explorer">
      <div className="filters venue-filters" aria-label="Filtrer les événements sur la carte">
        <label className="search-field">
          <span className="sr-only">Rechercher un événement ou un lieu</span>
          <Search aria-hidden="true" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un événement, un lieu…"
            className="filter-input"
          />
        </label>
        <div className="month-filters" aria-label="Filtrer par date">
          {[
            ['all', 'Tout'],
            ['today', 'Aujourd’hui'],
            ['tomorrow', 'Demain'],
            ['week', 'Cette semaine'],
            ['10', 'Octobre'],
            ['11', 'Novembre'],
          ].map(([value, label]) => (
            <Button
              key={value}
              type="button"
              variant={dateFilter === value ? 'default' : 'outline'}
              aria-pressed={dateFilter === value}
              onClick={() => setDateFilter(value as DateFilter)}
              className="filter-button"
            >
              {label}
            </Button>
          ))}
        </div>
        <div className="venue-select-filters">
          <label className="theme-filter">
            <span>Commune</span>
            <NativeSelect value={commune} onChange={(event) => setCommune(event.target.value)}>
              <NativeSelectOption value="all">Toutes les communes</NativeSelectOption>
              {communes.map((option) => (
                <NativeSelectOption key={option} value={option}>{option}</NativeSelectOption>
              ))}
            </NativeSelect>
          </label>
          <label className="theme-filter">
            <span>Type</span>
            <NativeSelect value={type} onChange={(event) => setType(event.target.value)}>
              <NativeSelectOption value="all">Tous les types</NativeSelectOption>
              {types.map((option) => (
                <NativeSelectOption key={option.id} value={option.id}>{option.label}</NativeSelectOption>
              ))}
            </NativeSelect>
          </label>
        </div>
      </div>

      <div className="results-bar venue-results-bar">
        <p aria-live="polite">
          <strong>{eventCount}</strong> rendez-vous · {mappedVenues.length} lieux sur la carte
        </p>
        {hasFilters ? (
          <button type="button" onClick={resetFilters} className="reset-filters">
            <X aria-hidden="true" /> Effacer les filtres
          </button>
        ) : null}
      </div>

      {filteredVenues.length ? (
        <div className="venues-layout">
          <aside className="venue-map-panel" aria-label="Carte des lieux" id="carte">
            <div className="venue-map-heading">
              <strong>Carte des lieux</strong>
              <span>{mappedVenues.length} lieux</span>
            </div>
            <div className="venue-map-frame">
              <VenueMapCanvas
                venues={mappedVenues}
                activeVenueId={activeVenueId}
                onSelectVenue={(venueId) => selectVenue(venueId, 'map')}
              />
              {!mappedVenues.length ? (
                <p className="venue-map-empty">Aucun lieu géolocalisé pour cette sélection.</p>
              ) : null}
            </div>
          </aside>

          <section className="venues-list" aria-label="Liste des lieux">
            {filteredVenues.map((venue, index) => (
              <article
                className={`venue-card${activeVenueId === venue.id ? ' venue-card-active' : ''}`}
                key={venue.id}
                id={`lieu-${venue.id}`}
              >
                <span className="venue-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <p className="venue-locality">{venue.locality}</p>
                <h2>{venue.name}</h2>
                <p className="venue-address"><MapPin aria-hidden="true" /> {venue.address}</p>
                <p className="venue-events">{venue.events.length} rendez-vous</p>
                <ul className="venue-event-list">
                  {venue.events.map((event) => (
                    <li key={event.id}>
                      <Link href={`/evenements/${event.slug}/`}>
                        <span>{event.dateLabel}</span>
                        <strong>{event.title}</strong>
                      </Link>
                    </li>
                  ))}
                </ul>
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
      ) : (
        <div className="empty-state venue-empty-state">
          <h2>Aucun rendez-vous</h2>
          <Button type="button" onClick={resetFilters} className="primary-action">Réinitialiser</Button>
        </div>
      )}
    </div>
  );
}
