import type { Metadata } from 'next';
import './globals.css';

const title = 'Curieux Mexique 2026';
const description =
  'Le programme culturel Curieux Mexique en Cap-Sizun, en octobre et novembre 2026.';
const siteUrl = 'https://curieux-mexique-2026.fair-mole-0129.chatgpt.site';
const socialImage = new URL('/og.png', siteUrl).toString();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
