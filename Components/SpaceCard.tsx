'use client';

/**
 * Space interface for Hypergraph spaces
 */
interface Space {
  /** Unique identifier for the space */
  id: string;
  /** Display name of the space */
  name: string | undefined;
}

/**
 * Props for the SpaceCard component
 */
interface SpaceCardProps {
  /** The space data to display */
  space: Space;
  /** Type of space (public or private) */
  spaceType: 'public' | 'private';
}

/**
 * SpaceCard component displays information about a Hypergraph space
 *
 * This component:
 * - Shows space name and type with appropriate styling
 * - Displays the space ID in a monospace format
 * - Provides visual distinction between public and private spaces
 * - Uses responsive design with hover effects
 *
 * @param space - The space data to display
 * @param spaceType - Whether the space is public or private
 * @returns JSX element containing the space card
 */
export function SpaceCard({ space, spaceType }: SpaceCardProps) {
  return (
    <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground truncate">{space.name || 'Unnamed Space'}</h3>
        <span
          className={`ml-2 flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium ${
            spaceType === 'public'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
          }`}
        >
          {spaceType}
        </span>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Space ID</p>
          <p className="text-sm font-mono text-foreground break-all bg-muted px-3 py-2 rounded border">{space.id}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Type</p>
          <p className="text-sm text-foreground capitalize">{spaceType} Space</p>
        </div>
      </div>
    </div>
  );
}
