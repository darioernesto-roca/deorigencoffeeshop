import type { Metadata } from 'next';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'De Origen Coffee Shop',
  description: 'Coffee shop website foundation built with Next.js'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main className="container page-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
