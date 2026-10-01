'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { MapPin, X } from 'lucide-react';
import { EventFilters } from '@/components/event-filters';
import { Button } from '@/components/ui/button';
import {
  datePeriodForFilter,
  matchesDateFilter,
  matchesTypeFilter,
  type DateFilter,
  type EventTypeOption,
} from '@/lib/event-filters';

export type ProgrammeItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  formatId: string;
  formatLabel: string;
  typeId: string;
  venueName: string;
  venueLocality: string;
  commune: string;
  dateLabel: string;
  day: string;
  monthLabel: string;
  startsOn: string;
  endsOn: string;
  months: string[];
  searchText: string;
};

export function ProgrammeBrowser({
  items,
  types,
}: {
  items: ProgrammeItem[];
  types: EventTypeOption[];
}) {
  const [query, setQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [commune, setCommune] = useState('all');
  const [type, setType] = useState('all');

  const communes = useMemo(
    () => [...new Set(items.map((item) => item.commune))].sort((a, b) => a.localeCompare(b, 'fr')),
    [items],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('fr');
    const selectedPeriod = datePeriodForFilter(dateFilter);
    return items.filter((item) => {
      const matchesQuery = !normalizedQuery
        || item.searchText.includes(normalizedQuery)
        || item.commune.toLocaleLowerCase('fr').includes(normalizedQuery);
      const matchesCommune = commune === 'all' || item.commune === commune;
      const matchesDate = matchesDateFilter(item, dateFilter, selectedPeriod);
      const matchesType = matchesTypeFilter(item.typeId, type);
      return matchesQuery && matchesCommune && matchesDate && matchesType;
    });
  }, [commune, dateFilter, items, query, type]);

  const hasFilters = Boolean(query)
    || dateFilter !== 'all'
    || commune !== 'all'
    || type !== 'all';

  function resetFilters() {
    setQuery('');
    setDateFilter('all');
    setCommune('all');
    setType('all');
  }

  return (
    <div className="programme-browser">
      <EventFilters
        query={query}
        onQueryChange={setQuery}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        commune={commune}
        onCommuneChange={setCommune}
        communes={communes}
        type={type}
        onTypeChange={setType}
        types={types}
      />

      <div className="results-bar">
        <p aria-live="polite">
          <strong>{filtered.length}</strong> rendez-vous
        </p>
        {hasFilters ? (
          <button type="button" onClick={resetFilters} className="reset-filters">
            <X aria-hidden="true" /> Effacer les filtres
          </button>
        ) : null}
      </div>

      {filtered.length ? (
        <div className="programme-list">
          {filtered.map((item) => (
            <article key={item.id} className={`programme-item event-${item.formatId}`}>
              <div className="event-date" aria-hidden="true">
                <strong>{item.day}</strong>
                <span>{item.monthLabel}</span>
              </div>
              <div className="programme-item-main">
                <p className="event-format">{item.formatLabel}</p>
                <h2><Link href={`/evenements/${item.slug}/`}>{item.title}</Link></h2>
                <p className="programme-summary">{item.summary}</p>
                <div className="programme-meta">
                  <span>{item.dateLabel}</span>
                  <span><MapPin aria-hidden="true" /> {item.venueName} · {item.venueLocality}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>Aucun rendez-vous</h2>
          <Button type="button" onClick={resetFilters} className="primary-action">Réinitialiser</Button>
        </div>
      )}
    </div>
  );
}
