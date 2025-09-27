'use client';

import { useCompanies } from '@/hooks/useCompanies';
import { Button } from '@/Components/ui/button';

export function CompaniesList() {
  const { companies, loading, error, refetch, hasMore, currentPage, totalPages } = useCompanies({
    page: 1,
    limit: 20,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading companies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="text-destructive">Error: {error}</div>
        <Button onClick={refetch} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Companies ({companies.length})</h3>
        <Button onClick={refetch} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <div key={company._id} className="border rounded-lg p-4 space-y-2 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <h4 className="font-medium capitalize">{company.companyName}</h4>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  company.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {company.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Space ID: {company.publicSpaceId}</p>
              <p>Created: {new Date(company.createdAt).toLocaleDateString()}</p>
            </div>

            {company.mediumLink && (
              <a
                href={company.mediumLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                View Medium
              </a>
            )}
          </div>
        ))}
      </div>

      {companies.length === 0 && <div className="text-center text-muted-foreground py-8">No companies found</div>}

      <div className="text-sm text-muted-foreground text-center">
        Page {currentPage} of {totalPages}
        {hasMore && <span> • More data available</span>}
      </div>
    </div>
  );
}
