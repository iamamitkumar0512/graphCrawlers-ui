'use client';

import { useHypergraphApp, useHypergraphAuth } from '@graphprotocol/hypergraph-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from './ui/button';

/**
 * Main layout component that provides the application structure
 *
 * This component:
 * - Renders the header with authentication controls
 * - Handles user authentication flow with Geo Connect
 * - Provides navigation between authenticated and non-authenticated states
 * - Displays the main content area for page components
 *
 * @param children - The page content to be rendered in the main area
 * @returns JSX with header and main content layout
 */
export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Router for navigation between pages
  const navigation = useRouter();

  // Hypergraph authentication state and methods
  const { authenticated } = useHypergraphAuth();
  const { redirectToConnect, logout } = useHypergraphApp();

  /**
   * Handles user sign-in process using Geo Connect
   * Redirects to Geo Connect for wallet authentication
   */
  const handleSignIn = () => {
    redirectToConnect({
      storage: localStorage,
      connectUrl: 'https://connect.geobrowser.io/',
      successUrl: `${window.location.origin}/authenticate-success`,
      redirectFn: (url: URL) => {
        window.location.href = url.toString();
      },
    });
  };

  /**
   * Handles user logout process
   * Logs out from Hypergraph and redirects to login page
   */
  const handleLogout = () => {
    logout();
    navigation.push('/login');
  };

  return (
    <div className="min-h-full flex flex-col">
      {/* Application Header with branding and authentication */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative z-[9998]">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo and App Title */}
            <div className="flex items-center space-x-4">
              <Image src="/hypergraph.svg" alt="Hypergraph Logo" width={32} height={32} className="w-8 h-8" />
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
            </div>

            {/* Center: Powered by Hypergraph branding */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Powered by</span>
              <Image src="/hypergraph.svg" alt="Hypergraph Logo" width={16} height={16} className="w-4 h-4" />
              <span className="font-semibold">Hypergraph</span>
            </div>

            {/* Right: Authentication controls */}
            <div className="flex items-center space-x-4">
              {authenticated ? (
                <Button onClick={handleLogout} variant="outline">
                  Logout
                </Button>
              ) : (
                <Button onClick={handleSignIn}>Sign in with Geo Connect</Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content area for page components */}
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
