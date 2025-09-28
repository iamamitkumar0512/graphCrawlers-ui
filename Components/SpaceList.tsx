'use client';

import { useSpaces } from '@graphprotocol/hypergraph-react';
import { SpaceCard } from './SpaceCard';

/**
 * Props for the SpaceList component
 */
interface SpaceListProps {
  /** Type of spaces to display (public or private) */
  spaceType: 'public' | 'private';
  /** Optional title for the space list section */
  title?: string;
}

/**
 * SpaceList component displays a list of Hypergraph spaces
 *
 * This component:
 * - Fetches spaces from Hypergraph based on the specified type
 * - Shows loading state while fetching data
 * - Displays empty state when no spaces are found
 * - Renders spaces in a responsive grid layout using SpaceCard components
 *
 * @param spaceType - Whether to show public or private spaces
 * @param title - Optional title for the section
 * @returns JSX element containing the space list
 */
export function SpaceList({ spaceType, title }: SpaceListProps) {
  // Fetch spaces data from Hypergraph
  const { data: spaces, isPending } = useSpaces({ mode: spaceType });

  // Show loading state with spinner
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

  // Show empty state when no spaces are found
  if (!spaces || spaces.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No {spaceType} spaces found.</p>
      </div>
    );
  }

  // Render the space list with title and grid layout
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
