'use client';

import { useAllParagraphs } from '@/hooks/useParagraphs';
import { ParagraphCard } from './ParagraphCard';
import { Button } from '@/Components/ui/button';

interface ParagraphsListProps {
  spaceId?: string;
}

export function ParagraphsList({ spaceId }: ParagraphsListProps) {
  const { paragraphs, loading, error, refetch, totalParagraphs } = useAllParagraphs({
    platform: 'medium',
    processed: false,
  });

  const handlePublish = async (paragraphId: string) => {
    try {
      // Here you would implement your publish logic
      // For now, we'll just log it
      console.log('Publishing paragraph:', paragraphId);

      // You could make an API call here to publish the paragraph
      // await fetch(`/api/paragraphs/${paragraphId}/publish`, { method: 'POST' });

      alert(`Paragraph ${paragraphId} published successfully!`);
    } catch (error) {
      console.error('Error publishing paragraph:', error);
      alert('Failed to publish paragraph');
    }
  };

  const handleView = (paragraphId: string) => {
    console.log('Viewing paragraph:', paragraphId);
    // You could implement a modal or navigation here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading paragraphs...</div>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Paragraphs</h2>
          <p className="text-muted-foreground">{totalParagraphs} paragraphs from all companies</p>
          {!spaceId && (
            <p className="text-sm text-amber-600 mt-1">
              ⚠️ No space ID provided. Publishing to Hypergraph is disabled.
            </p>
          )}
        </div>
        <Button onClick={refetch} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {/* Company Filter */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-muted-foreground">Companies:</span>
        {Array.from(new Set(paragraphs.map((p) => p.companyName))).map((company) => (
          <span key={company} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full capitalize">
            {company}
          </span>
        ))}
      </div>

      {/* Paragraphs Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paragraphs.map((paragraph) => (
          <ParagraphCard
            key={paragraph._id}
            paragraph={paragraph}
            onPublish={handlePublish}
            onView={handleView}
            spaceId={spaceId}
          />
        ))}
      </div>

      {/* Empty State */}
      {paragraphs.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-lg font-medium mb-2">No paragraphs found</h3>
          <p className="text-sm">Try adjusting your filters or check back later.</p>
        </div>
      )}
    </div>
  );
}
