import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MojaApp',
  description: 'Progresywna aplikacja mobilna',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  viewport: 'width=device-width, initial-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MojaApp',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}