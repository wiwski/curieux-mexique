'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { MapPin, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';

export type ProgrammeItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  formatId: string;
  formatLabel: string;
  themeIds: string[];
  venueName: string;
  venueLocality: string;
  dateLabel: string;
  day: string;
  monthLabel: string;
  months: string[];
  searchText: string;
};

type ThemeOption = { id: string; label: string };

export function ProgrammeBrowser({
  items,
  themes,
}: {
  items: ProgrammeItem[];
  themes: ThemeOption[];
}) {
  const [query, setQuery] = useState('');
  const [month, setMonth] = useState('all');
  const [theme, setTheme] = useState('all');

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('fr');
    return items.filter((item) => {
      const matchesQuery = !normalizedQuery || item.searchText.includes(normalizedQuery);
      const matchesMonth = month === 'all' || item.months.includes(month);
      const matchesTheme = theme === 'all' || item.themeIds.includes(theme);
      return matchesQuery && matchesMonth && matchesTheme;
    });
  }, [items, month, query, theme]);

  const hasFilters = Boolean(query) || month !== 'all' || theme !== 'all';

  function resetFilters() {
    setQuery('');
    setMonth('all');
    setTheme('all');
  }

  return (
    <div className="programme-browser">
      <div className="filters" aria-label="Filtrer le programme">
        <label className="search-field">
          <span className="sr-only">Rechercher dans le programme</span>
          <Search aria-hidden="true" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher une activité, un lieu…"
            className="filter-input"
          />
        </label>
        <div className="month-filters" aria-label="Filtrer par mois">
          {[
            ['all', 'Tout'],
            ['10', 'Octobre'],
            ['11', 'Novembre'],
          ].map(([value, label]) => (
            <Button
              key={value}
              type="button"
              variant={month === value ? 'default' : 'outline'}
              aria-pressed={month === value}
              onClick={() => setMonth(value)}
              className="filter-button"
            >
              {label}
            </Button>
          ))}
        </div>
        <label className="theme-filter">
          <span>Thème</span>
          <NativeSelect value={theme} onChange={(event) => setTheme(event.target.value)}>
            <NativeSelectOption value="all">Tous les thèmes</NativeSelectOption>
            {themes.map((option) => (
              <NativeSelectOption key={option.id} value={option.id}>{option.label}</NativeSelectOption>
            ))}
          </NativeSelect>
        </label>
      </div>

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
