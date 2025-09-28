import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Layout } from '@/Components/Layout';
import Providers from './Providers';
import './globals.css';

/**
 * Font configuration for the application
 * Using Geist Sans and Geist Mono for modern typography
 */
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

/**
 * Application metadata configuration
 * Used for SEO and browser tab information
 */
export const metadata: Metadata = {
  title: 'Hypergraph + Nextjs',
  description: 'Hypergraph-enabled nextjs starter app',
};

/**
 * Root layout component that wraps the entire application
 *
 * This component:
 * - Sets up the HTML structure with proper language and full height
 * - Configures font variables for consistent typography
 * - Wraps the app with Hypergraph providers for state management
 * - Provides the main layout structure with header and content areas
 *
 * @param children - The page content to be rendered
 * @returns The root layout JSX structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
        {/* Hypergraph providers for authentication and state management */}
        <Providers>
          {/* Main application layout with header and content */}
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
