export type DateFilter = 'all' | 'today' | 'tomorrow' | 'week' | '10' | '11';

export type EventTypeOption = {
  id: string;
  label: string;
  themeIds: string[];
};

export const dateFilterOptions: { id: DateFilter; label: string }[] = [
  { id: 'all', label: 'Tout' },
  { id: 'today', label: 'Aujourd’hui' },
  { id: 'tomorrow', label: 'Demain' },
  { id: 'week', label: 'Cette semaine' },
  { id: '10', label: 'Octobre' },
  { id: '11', label: 'Novembre' },
];

export const eventTypeOptions: EventTypeOption[] = [
  {
    id: 'visual-arts',
    label: 'Arts visuels & photo',
    themeIds: ['visual-arts', 'photography'],
  },
  {
    id: 'books-languages',
    label: 'Livres & langues',
    themeIds: ['literature', 'languages'],
  },
  {
    id: 'cinema',
    label: 'Cinéma',
    themeIds: ['cinema'],
  },
  {
    id: 'music-stage',
    label: 'Musique & scène',
    themeIds: ['music', 'dance', 'theatre', 'sound'],
  },
  {
    id: 'food-games',
    label: 'Cuisine & jeux',
    themeIds: ['food', 'games-theme'],
  },
  {
    id: 'cultures-society',
    label: 'Cultures & société',
    themeIds: ['heritage', 'society', 'women', 'indigenous-cultures', 'migration'],
  },
];

export function communeForLocality(locality: string) {
  if (locality === 'Esquibien - Audierne') return 'Audierne';
  if (locality === 'Poulgoazec') return 'Plouhinec';
  return locality;
}

function dateKeyInParis() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

function addDays(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + days, 12)).toISOString().slice(0, 10);
}

export function datePeriodForFilter(filter: DateFilter) {
  if (filter === 'all' || filter === '10' || filter === '11') return null;
  const today = dateKeyInParis();
  if (filter === 'today') return { startsOn: today, endsOn: today };
  if (filter === 'tomorrow') {
    const tomorrow = addDays(today, 1);
    return { startsOn: tomorrow, endsOn: tomorrow };
  }
  const weekday = new Date(`${today}T12:00:00Z`).getUTCDay() || 7;
  return {
    startsOn: addDays(today, 1 - weekday),
    endsOn: addDays(today, 7 - weekday),
  };
}

export function matchesDateFilter(
  item: { startsOn: string; endsOn: string; months: string[] },
  filter: DateFilter,
  period = datePeriodForFilter(filter),
) {
  if (filter === 'all') return true;
  if (period) return item.startsOn <= period.endsOn && item.endsOn >= period.startsOn;
  return item.months.includes(filter);
}

export function matchesTypeFilter(themeIds: string[], typeId: string) {
  if (typeId === 'all') return true;
  const option = eventTypeOptions.find((type) => type.id === typeId);
  return option ? option.themeIds.some((themeId) => themeIds.includes(themeId)) : false;
}
