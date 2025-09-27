'use client';

import { useState, useCallback } from 'react';
import { useCreateEntity, preparePublish, publishOps, useHypergraphApp } from '@graphprotocol/hypergraph-react';
import { Paragraph, PostData, Author, PostMetrics } from '@/app/schema';
import { Paragraph as ParagraphData } from './useCompanyData';

export interface UseHypergraphPublishReturn {
  publishParagraph: (paragraphData: ParagraphData, spaceId: string, publicSpaceId: string) => Promise<boolean>;
  isPublishing: boolean;
  error: string | null;
}
export function useHypergraphPublish(): UseHypergraphPublishReturn {
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAuthor = useCreateEntity(Author, { space: '7daed2b8-0575-4479-b7ef-5bf6c2d33c67' });
  const createPostMetrics = useCreateEntity(PostMetrics, { space: '7daed2b8-0575-4479-b7ef-5bf6c2d33c67' });
  const createPostData = useCreateEntity(PostData, { space: '7daed2b8-0575-4479-b7ef-5bf6c2d33c67' });
  const createParagraph = useCreateEntity(Paragraph, { space: '7daed2b8-0575-4479-b7ef-5bf6c2d33c67' });
  const { getSmartSessionClient } = useHypergraphApp();

  const publishParagraph = useCallback(
    async (paragraphData: ParagraphData, spaceId: string, publicSpaceId: string): Promise<boolean> => {
      setIsPublishing(true);
      setError(null);

      try {
        // Create Author entity
        const author = await createAuthor({
          name: paragraphData.postData.author.name,
          username: paragraphData.postData.author.username,
          profileUrl: paragraphData.postData.author.profileUrl,
        });

        // Create PostMetrics entity
        const postMetrics = await createPostMetrics({
          claps: paragraphData.postData.metrics.claps,
          views: paragraphData.postData.metrics.views,
          comments: paragraphData.postData.metrics.comments,
          shares: paragraphData.postData.metrics.shares,
        });

        // Create PostData entity
        const postData = await createPostData({
          postId: paragraphData.postData.postId,
          title: paragraphData.postData.title,
          content: paragraphData.postData.content,
          excerpt: paragraphData.postData.excerpt,
          author: [author.id],
          url: paragraphData.postData.url,
          publishedAt: paragraphData.postData.publishedAt,
          tags: Array.isArray(paragraphData.postData.tags)
            ? paragraphData.postData.tags.join(',')
            : paragraphData.postData.tags || '',
          metrics: [postMetrics.id],
          featuredImage: paragraphData.postData.featuredImage!,
          readingTime: paragraphData.postData.readingTime,
        });

        // Create main Paragraph entity
        const paragraph = await createParagraph({
          companyName: paragraphData.companyName,
          platform: paragraphData.platform,
          postData: [postData.id],
        });

        console.log('Successfully published paragraph to Hypergraph:', {
          paragraphId: paragraph.id,
          spaceId,
          companyName: paragraphData.companyName,
          platform: paragraphData.platform,
          title: paragraphData.postData.title,
        });

        const { ops } = await preparePublish({ entity: paragraph, publicSpace: publicSpaceId });
        const smartSessionClient = await getSmartSessionClient();

        console.log(ops);

        if (!smartSessionClient) {
          throw new Error('Missing smartSessionClient');
        }

        const publishResult = await publishOps({
          ops,
          space: publicSpaceId,
          name: 'Publish Paragraph to Public Space',
          walletClient: smartSessionClient,
        });

        // Call API to mark paragraph as processed
        try {
          const response = await fetch(
            `http://localhost:3000/api/companies/${paragraphData.companyName}/paragraphs/${paragraph.id}/process`,
            {
              method: 'PATCH',
              headers: {
                accept: '*/*',
                'Content-Type': 'application/json',
              },
            },
          );

          if (!response.ok) {
            console.warn('Failed to mark paragraph as processed:', response.status, response.statusText);
          } else {
            console.log('Successfully marked paragraph as processed');
          }
        } catch (apiError) {
          console.warn('Error calling process API:', apiError);
        }

        console.log(ops);

        console.log('Successfully published paragraph to both private and public spaces:', {
          paragraphId: paragraph.id,
          privateSpaceId: spaceId,
          publicSpaceId,
          companyName: paragraphData.companyName,
          platform: paragraphData.platform,
          title: paragraphData.postData.title,
          publishResult,
        });

        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to publish paragraph to Hypergraph';
        setError(errorMessage);
        console.error('Error publishing paragraph to Hypergraph:', err);
        return false;
      } finally {
        setIsPublishing(false);
      }
    },
    [createAuthor, createPostMetrics, createPostData, createParagraph, getSmartSessionClient],
  );

  return {
    publishParagraph,
    isPublishing,
    error,
  };
}
