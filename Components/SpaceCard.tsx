'use client';

interface Space {
  id: string;
  name: string | undefined;
}

interface SpaceCardProps {
  space: Space;
  spaceType: 'public' | 'private';
}

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
