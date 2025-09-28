'use client';

import { useQuery } from '@graphprotocol/hypergraph-react';
import { PostData } from '@/app/schema';

/**
 * Extended post data interface that includes related entities
 * This interface represents a post with all its associated data (author, metrics)
 */
export interface PostDataWithRelations {
  /** Unique identifier for the post */
  id: string;
  /** Original post ID from the source platform */
  postId: string;
  /** Post title */
  title: string;
  /** Full post content */
  content: string;
  /** Post excerpt/summary */
  excerpt: string;
  /** Author information */
  author: {
    id: string;
    name: string;
    username: string;
    profileUrl?: string;
  };
  /** Original post URL */
  url: string;
  /** Publication date */
  publishedAt: string;
  /** Comma-separated tags */
  tags?: string;
  /** Post engagement metrics */
  metrics: {
    id: string;
    claps: number;
    views: number;
    comments: number;
    shares: number;
  };
  /** Featured image URL */
  featuredImage?: string;
  /** Estimated reading time in minutes */
  readingTime: number;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Hook to fetch posts data from Hypergraph
 * 
 * @param options - Query options including mode, filters, and pagination
 * @returns Object containing posts data and loading state
 */
export function usePost(
  options: { mode?: 'public' | 'private'; filter?: Record<string, unknown>; first?: number } = {},
) {
  // Configure query options for Hypergraph
  const queryOptions = {
    mode: 'private' as 'private' | 'public', // Currently using private mode
    space: '7daed2b8-0575-4479-b7ef-5bf6c2d33c67', // Using the same space as other entities
    first: options.first || 100, // Limit number of posts returned
    include: { author: {}, metrics: {} }, // Include related author and metrics entities
    ...(options.filter && { filter: options.filter }), // Apply filters if provided
  };

  // Execute the query using Hypergraph React hook
  const { data: posts, isPending } = useQuery(PostData, queryOptions);

  return {
    data: posts,
    isPending,
    posts, // Alias for backward compatibility
    loading: isPending, // Alias for backward compatibility
  };
}

/**
 * Hook to fetch a specific post by its ID
 * 
 * @param postId - The unique identifier of the post
 * @param mode - Whether to fetch from public or private space
 * @returns Posts data filtered by the given postId
 */
export function usePostById(postId: string, mode: 'public' | 'private' = 'public') {
  return usePost({ mode, filter: { postId: { equals: postId } } });
}

/**
 * Hook to fetch posts by a specific author
 * 
 * @param authorId - The unique identifier of the author
 * @param mode - Whether to fetch from public or private space
 * @returns Posts data filtered by the given authorId
 */
export function usePostsByAuthor(authorId: string, mode: 'public' | 'private' = 'public') {
  return usePost({ mode, filter: { author: { equals: authorId } } });
}

/**
 * Hook to fetch posts containing specific tags
 * 
 * @param tags - The tag string to search for
 * @param mode - Whether to fetch from public or private space
 * @returns Posts data filtered by the given tags
 */
export function usePostsByTags(tags: string, mode: 'public' | 'private' = 'public') {
  return usePost({ mode, filter: { tags: { contains: tags } } });
}
