import type { Metadata } from 'next';
import './globals.css';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'PacSun MVP',
  description: 'E-commerce platform inspired by PacSun',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}

