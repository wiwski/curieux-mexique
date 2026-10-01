'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import {
  dateFilterOptions,
  type DateFilter,
  type EventTypeOption,
} from '@/lib/event-filters';

export function EventFilters({
  query,
  onQueryChange,
  dateFilter,
  onDateFilterChange,
  commune,
  onCommuneChange,
  communes,
  type,
  onTypeChange,
  types,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  dateFilter: DateFilter;
  onDateFilterChange: (value: DateFilter) => void;
  commune: string;
  onCommuneChange: (value: string) => void;
  communes: string[];
  type: string;
  onTypeChange: (value: string) => void;
  types: EventTypeOption[];
}) {
  return (
    <div className="filters event-filters" aria-label="Rechercher et filtrer les événements">
      <label className="search-field">
        <span className="sr-only">Rechercher un événement ou un lieu</span>
        <Search aria-hidden="true" />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Rechercher un événement, un lieu…"
          className="filter-input"
        />
      </label>
      <div className="date-filters" aria-label="Filtrer par date">
        {dateFilterOptions.map((option) => (
          <Button
            key={option.id}
            type="button"
            variant={dateFilter === option.id ? 'default' : 'outline'}
            aria-pressed={dateFilter === option.id}
            onClick={() => onDateFilterChange(option.id)}
            className="filter-button"
          >
            {option.label}
          </Button>
        ))}
      </div>
      <div className="filter-selects">
        <label className="select-filter">
          <span>Commune</span>
          <NativeSelect value={commune} onChange={(event) => onCommuneChange(event.target.value)}>
            <NativeSelectOption value="all">Toutes les communes</NativeSelectOption>
            {communes.map((option) => (
              <NativeSelectOption key={option} value={option}>{option}</NativeSelectOption>
            ))}
          </NativeSelect>
        </label>
        <label className="select-filter">
          <span>Type</span>
          <NativeSelect value={type} onChange={(event) => onTypeChange(event.target.value)}>
            <NativeSelectOption value="all">Tous les types</NativeSelectOption>
            {types.map((option) => (
              <NativeSelectOption key={option.id} value={option.id}>{option.label}</NativeSelectOption>
            ))}
          </NativeSelect>
        </label>
      </div>
    </div>
  );
}
