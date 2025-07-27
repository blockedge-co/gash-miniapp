import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GASH Swap - WLD to Synthetic Gold',
  description:
    'Swap your Worldcoin (WLD) for GASH - synthetic gold-backed tokens',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#0f172a',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-light-50 text-light-900 antialiased`}
      >
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-light-100 via-light-50 to-light-200">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
