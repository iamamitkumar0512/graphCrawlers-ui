'use client';

import { HypergraphAppProvider } from '@graphprotocol/hypergraph-react';

import { mapping } from './mapping';

/**
 * Providers component that wraps the application with Hypergraph context
 *
 * This component:
 * - Provides Hypergraph authentication and state management to the entire app
 * - Handles localStorage access with SSR safety checks
 * - Configures the Hypergraph app with entity mappings and app ID
 * - Enables Hypergraph features throughout the application
 *
 * @param children - The application components to be wrapped
 * @returns JSX with Hypergraph provider context
 */
export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  // Safely access localStorage only on the client side to prevent SSR issues
  const _storage = typeof window !== 'undefined' ? window.localStorage : (undefined as unknown as Storage);

  return (
    <HypergraphAppProvider mapping={mapping} storage={_storage} appId="93bb8907-085a-4a0e-83dd-62b0dc98e793">
      {children}
    </HypergraphAppProvider>
  );
}
