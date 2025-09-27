'use client';

import { useQuery } from '@graphprotocol/hypergraph-react';
import { PostData } from '@/app/schema';

export interface PostDataWithRelations {
  id: string;
  postId: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
    username: string;
    profileUrl?: string;
  };
  url: string;
  publishedAt: string;
  tags?: string;
  metrics: {
    id: string;
    claps: number;
    views: number;
    comments: number;
    shares: number;
  };
  featuredImage?: string;
  readingTime: number;
  createdAt: string;
  updatedAt: string;
}

// Simple hook to get posts data from Hypergraph
export function usePost(
  options: { mode?: 'public' | 'private'; filter?: Record<string, unknown>; first?: number } = {},
) {
  const queryOptions = {
    mode: 'private' as 'private' | 'public',
    space: '7daed2b8-0575-4479-b7ef-5bf6c2d33c67', // Using the same space as other entities
    first: options.first || 100,
    include: { author: {}, metrics: {} }, // Include related author and metrics
    ...(options.filter && { filter: options.filter }),
  };

  const { data: posts, isPending } = useQuery(PostData, queryOptions);

  return {
    data: posts,
    isPending,
    posts, // Alias for backward compatibility
    loading: isPending, // Alias for backward compatibility
  };
}

// Hook to get posts by specific criteria
export function usePostById(postId: string, mode: 'public' | 'private' = 'public') {
  return usePost({ mode, filter: { postId: { equals: postId } } });
}

// Hook to get posts by author
export function usePostsByAuthor(authorId: string, mode: 'public' | 'private' = 'public') {
  return usePost({ mode, filter: { author: { equals: authorId } } });
}

// Hook to get posts by tags
export function usePostsByTags(tags: string, mode: 'public' | 'private' = 'public') {
  return usePost({ mode, filter: { tags: { contains: tags } } });
}
