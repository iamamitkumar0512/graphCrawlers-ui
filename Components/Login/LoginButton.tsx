'use client';

import { useHypergraphApp } from '@graphprotocol/hypergraph-react';

import { Button } from '../ui/button';

/**
 * LoginButton component provides authentication via Geo Connect
 *
 * This component:
 * - Uses Hypergraph's authentication system
 * - Redirects to Geo Connect for wallet authentication
 * - Handles the authentication flow with proper redirects
 * - Provides a consistent login button interface
 *
 * @returns JSX element containing the login button
 */
export function LoginButton() {
  // Get the redirect function from Hypergraph app context
  const { redirectToConnect } = useHypergraphApp();

  /**
   * Handles the sign-in process using Geo Connect
   * Redirects to the Geo Connect service for wallet authentication
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

  return (
    <Button type="button" onClick={handleSignIn} className="w-full bg-primary hover:bg-primary/90">
      Sign in with Geo Connect
    </Button>
  );
}
