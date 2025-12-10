'use client';

import React from 'react';
import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zyeuté - Quebec\'s Social Platform',
  description: 'AI-powered social media, marketplace, and creator tools for Quebec',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#d4af37" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
