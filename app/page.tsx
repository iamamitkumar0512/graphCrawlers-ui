'use client';

import { useState } from 'react';
import { Toggle } from '@/Components/ui/toggle';
import { ParagraphsList } from '@/Components/ParagraphsList';
import { PostsList } from '@/Components/PostsList';
import { SpaceList } from '@/Components/SpaceList';
import { useSpaces, useHypergraphAuth } from '@graphprotocol/hypergraph-react';

/**
 * HomePage component - Main landing page of the application
 *
 * This component provides a role-based interface where users can switch between
 * 'user' and 'admin' modes. In user mode, it displays public spaces and posts.
 * In admin mode (when authenticated), it shows private spaces and paragraph management.
 *
 * @returns JSX element containing the home page layout
 */
export default function HomePage() {
  // State for managing the current user role (user or admin)
  const [userType, setUserType] = useState('user');

  // Hypergraph authentication state
  const { authenticated } = useHypergraphAuth();

  // Fetch private spaces data (only used in admin mode)
  const { data: privateSpaces, isPending } = useSpaces({ mode: 'private' });

  console.log('authenticated:', authenticated);
  console.log('private spaces', privateSpaces);

  const toggleOptions = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Select Your Role</h2>
          <p className="text-muted-foreground mb-8">Choose whether you want to access as a user or admin</p>
        </div>

        <Toggle options={toggleOptions} value={userType} onChange={setUserType} className="w-fit" />

        <div className="w-full space-y-8">
          {userType === 'user' && (
            <div className="space-y-8">
              <SpaceList spaceType="public" title="Public Spaces" />
              <PostsList mode="public" />
            </div>
          )}

          {authenticated && userType === 'admin' && (
            <div className="space-y-8">
              <div className="bg-card border rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-card-foreground mb-4">
                  Your Private Spaces ({privateSpaces?.length || 0})
                </h2>
                {privateSpaces && privateSpaces.length > 0 ? (
                  <div className="space-y-2">
                    {privateSpaces.map((space) => (
                      <div key={space.id} className="border border-border rounded-lg p-4 bg-background">
                        <h3 className="font-medium text-foreground">{space.name}</h3>
                        <p className="text-xs text-muted-foreground">ID: {space.id}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No private spaces found</p>
                )}
              </div>
              {!isPending && <ParagraphsList spaceId={privateSpaces?.[0]?.id} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
