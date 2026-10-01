import type { Metadata } from 'next';
import 'leaflet/dist/leaflet.css';
import './globals.css';

const title = 'Curieux Mexique 2026';
const description =
  'Le programme culturel Curieux Mexique en Cap-Sizun, en octobre et novembre 2026.';
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  'https://curieux-mexique-2026.else809049.chatgpt.site'
).replace(/\/$/, '');
const socialImage = `${siteUrl}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: {
    default: title,
    template: '%s · Curieux Mexique',
  },
  description,
  openGraph: {
    title,
    description,
    type: 'website',
    images: [{ url: socialImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [socialImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
