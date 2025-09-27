'use client';

import { useState } from 'react';
import { Paragraph } from '@/hooks/useCompanyData';
import { Button } from '@/Components/ui/button';
import { useHypergraphPublish } from '@/hooks/useHypergraphPublish';
import { HypergraphSpaceProvider } from '@graphprotocol/hypergraph-react';
import { usePost } from '@/hooks';
import { useCompanies } from '@/hooks/useCompanies';

interface ParagraphCardProps {
  paragraph: Paragraph;
  onPublish?: (paragraphId: string) => void;
  onView?: (paragraphId: string) => void;
  spaceId?: string;
}

export function ParagraphCard({ paragraph, onPublish, spaceId }: ParagraphCardProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const { publishParagraph, isPublishing: hypergraphPublishing, error } = useHypergraphPublish();
  const { data: posts, isPending } = usePost({ mode: 'public' });

  const { companies } = useCompanies();

  console.log('posts', posts, isPending);

  const handlePublish = async () => {
    if (!spaceId) {
      alert('No space ID provided for publishing');
      return;
    }

    // Find the company that matches this paragraph's company name

    const company = companies.find((c) => c.companyName.toLowerCase() === paragraph.companyName.toLowerCase());
    console.log(paragraph, company);
    if (!company) {
      alert(`No company found for ${paragraph.companyName}. Cannot publish to public space.`);
      return;
    }

    if (!company.publicSpaceId) {
      alert(`No public space ID found for ${paragraph.companyName}. Cannot publish to public space.`);
      return;
    }

    setIsPublishing(true);
    try {
      // Publish to both private and public spaces
      const success = await publishParagraph(paragraph, spaceId, company.publicSpaceId);

      if (success) {
        // Call the original onPublish callback if provided
        if (onPublish) {
          await onPublish(paragraph._id);
        }

        alert(`Paragraph published to both private space and ${paragraph.companyName}'s public space successfully!`);
      } else {
        alert(`Failed to publish paragraph: ${error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error publishing paragraph:', err);
      alert('Failed to publish paragraph');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleView = () => {
    // Default behavior: open the original post
    window.open(paragraph.postData.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <HypergraphSpaceProvider space={'7daed2b8-0575-4479-b7ef-5bf6c2d33c67'}>
      <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white">
        {/* Featured Image */}
        {paragraph.postData.featuredImage && (
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={paragraph.postData.featuredImage}
              alt={paragraph.postData.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Card Content */}
        <div className="p-6 space-y-4">
          {/* Company Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full capitalize">
                {paragraph.companyName}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">{paragraph.platform}</span>
            </div>
            <div className="flex items-center space-x-2">
              {paragraph.processed && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Processed</span>
              )}
              <span className="text-xs text-muted-foreground">{paragraph.postData.readingTime} min read</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 leading-tight">{paragraph.postData.title}</h3>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{paragraph.postData.excerpt}</p>

          {/* Date and Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleView} className="text-xs">
                View Original
              </Button>
              <Button
                size="sm"
                onClick={handlePublish}
                disabled={isPublishing || hypergraphPublishing || !spaceId}
                className="text-xs bg-blue-600 hover:bg-blue-700"
              >
                {isPublishing || hypergraphPublishing ? 'Publishing...' : 'Publish to Hypergraph & Public Space'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </HypergraphSpaceProvider>
  );
}
