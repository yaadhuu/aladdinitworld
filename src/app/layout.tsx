import type { Metadata, Viewport } from 'next';
import { Geist, Inter } from 'next/font/google';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ChatWidget } from '@/components/ChatWidget';
import { SmoothScroll } from '@/components/SmoothScroll';
import { StructuredData } from '@/components/StructuredData';
import { METADATA, SITE_CONFIG } from '@/config';
import '../styles/globals.css';
import '../styles/site.css';

// Inter as the fallback under SF Pro (Apple devices): light 400 headlines, 400/500 text, as on the first site
// Geist: the home hero headline only (semibold)
const geist = Geist({ subsets: ['latin'], display: 'swap', variable: '--font-geist', weight: ['600'] });
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: METADATA.title,
  description: METADATA.description,
  keywords: METADATA.keywords.join(', '),
  openGraph: {
    title: METADATA.title,
    description: METADATA.description,
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: METADATA.title,
    description: METADATA.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${geist.variable}`} suppressHydrationWarning>
      <head>
        <StructuredData />
        {/* The site is light only: a premium retail page keeps one grade (taste skill: dark pages are for tech) */}
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('js');` }} />
      </head>
      <body className="font-sans">
        <a href="#main" className="skip-link">Skip to content</a>
        <Navigation />
        {/* The header is fixed; main starts under it (the home hero pulls itself back up to sit beneath it) */}
        <main id="main" className="pt-[var(--nav)]">{children}</main>
        <Footer />
        <ChatWidget />
        <SmoothScroll />
      </body>
    </html>
  );
}
