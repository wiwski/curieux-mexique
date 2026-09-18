import { programme } from '@/lib/programme';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>{programme.edition.name} · {programme.edition.year}</p>
      <a href={`mailto:${programme.edition.contactEmail}`}>{programme.edition.contactEmail}</a>
    </footer>
  );
}
