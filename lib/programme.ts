import programmeJson from '@/programme.json';

export type Address = {
  street: string | null;
  postalCode: string | null;
  locality: string;
  countryCode: string;
};

export type Venue = {
  id: string;
  slug: string;
  name: string;
  kind: string;
  address: Address;
  geo: { latitude: number; longitude: number } | null;
  website: string | null;
  notes: string[];
};

export type Contributor = {
  id: string;
  slug: string;
  kind: 'person' | 'organization';
  name: string;
  roles: string[];
  bio: string | null;
  website: string | null;
};

export type Event = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string | null;
  summary: string;
  description: string | null;
  formatId: string;
  themeIds: string[];
  audienceIds: string[];
  ageRange: string | null;
  pricing: { kind: string; details: string | null };
  registration: {
    required: boolean;
    method: string;
    value: string | null;
    label: string | null;
  };
  credits: { contributorId: string; role: string }[];
  featured: boolean;
};

export type Session = {
  id: string;
  eventId: string;
  timing:
    | { kind: 'scheduled'; startsAt: string; endsAt: string | null }
    | { kind: 'date-range'; startsOn: string; endsOn: string };
  venueId: string;
  timezone: string;
  status: string;
  notes: string[];
};

type TaxonomyTerm = { id: string; label: string; description?: string };

type ProgrammeData = {
  edition: {
    name: string;
    year: number;
    startsOn: string;
    endsOn: string;
    territory: string;
    tagline: string;
    contactEmail: string;
    editorial: { title: string; body: string[]; author: string; authorRole: string };
    mediation: string[];
  };
  audiences: TaxonomyTerm[];
  formats: TaxonomyTerm[];
  themes: TaxonomyTerm[];
  venues: Venue[];
  contributors: Contributor[];
  events: Event[];
  sessions: Session[];
};

export const programme = programmeJson as unknown as ProgrammeData;

export const venuesById = new Map(programme.venues.map((venue) => [venue.id, venue]));
export const eventsById = new Map(programme.events.map((event) => [event.id, event]));
export const formatsById = new Map(programme.formats.map((format) => [format.id, format]));
export const themesById = new Map(programme.themes.map((theme) => [theme.id, theme]));
export const contributorsById = new Map(
  programme.contributors.map((contributor) => [contributor.id, contributor]),
);

export function sessionStart(session: Session) {
  return session.timing.kind === 'scheduled'
    ? session.timing.startsAt
    : `${session.timing.startsOn}T12:00:00+02:00`;
}

export const orderedSessions = [...programme.sessions].sort((a, b) =>
  sessionStart(a).localeCompare(sessionStart(b)),
);

export function sessionsForEvent(eventId: string) {
  return orderedSessions.filter((session) => session.eventId === eventId);
}

export function monthsForSession(session: Session) {
  if (session.timing.kind === 'scheduled') return [session.timing.startsAt.slice(5, 7)];
  const start = Number(session.timing.startsOn.slice(5, 7));
  const end = Number(session.timing.endsOn.slice(5, 7));
  return Array.from(
    { length: end - start + 1 },
    (_, index) => String(start + index).padStart(2, '0'),
  );
}

const fullDate = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Paris',
});
const shortDate = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit', month: 'short', timeZone: 'Europe/Paris',
});
const time = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris',
});

function dateFromDay(day: string) {
  return new Date(`${day}T12:00:00+02:00`);
}

export function formatSessionDate(session: Session) {
  if (session.timing.kind === 'scheduled') {
    const date = new Date(session.timing.startsAt);
    return `${fullDate.format(date)} · ${time.format(date)}`;
  }
  const start = dateFromDay(session.timing.startsOn);
  const end = dateFromDay(session.timing.endsOn);
  return `Du ${shortDate.format(start)} au ${shortDate.format(end)}`;
}

export function sessionDayParts(session: Session) {
  const date = session.timing.kind === 'scheduled'
    ? new Date(session.timing.startsAt)
    : dateFromDay(session.timing.startsOn);
  return {
    day: new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit', timeZone: 'Europe/Paris',
    }).format(date),
    month: new Intl.DateTimeFormat('fr-FR', {
      month: 'short', timeZone: 'Europe/Paris',
    }).format(date).replace('.', ''),
  };
}

export function venueAddress(venue: Venue) {
  const { street, postalCode, locality } = venue.address;
  return [street, [postalCode, locality].filter(Boolean).join(' ')]
    .filter(Boolean)
    .join(', ');
}
