'use client';

import { useSpaces } from '@graphprotocol/hypergraph-react';
import { SpaceCard } from './SpaceCard';

interface SpaceListProps {
  spaceType: 'public' | 'private';
  title?: string;
}

export function SpaceList({ spaceType, title }: SpaceListProps) {
  const { data: spaces, isPending } = useSpaces({ mode: spaceType });

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading {spaceType} spaces...</p>
        </div>
      </div>
    );
  }

  if (!spaces || spaces.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No {spaceType} spaces found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && <h2 className="text-2xl font-bold text-foreground">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spaces.map((space) => (
          <SpaceCard key={space.id} space={space} spaceType={spaceType} />
        ))}
      </div>
    </div>
  );
}
