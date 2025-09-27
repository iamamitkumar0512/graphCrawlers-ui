'use client';

import { SpaceCard } from './SpaceCard';

// Example of how to use the SpaceCard component
export function SpaceExample() {
  // Example space data
  const exampleSpace = {
    id: '74c26e09-420a-4a89-95dc-7201912b662f',
    name: 'arbitrum',
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Space Card Examples</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SpaceCard space={exampleSpace} spaceType="public" />
        <SpaceCard space={exampleSpace} spaceType="private" />
      </div>
    </div>
  );
}
