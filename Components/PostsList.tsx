'use client';

import { PostCard } from './PostCard';
import { usePost } from '@/hooks/usePost';
import { PostDataWithRelations } from '@/hooks/usePost';

/**
 * Props for the PostsList component
 */
interface PostsListProps {
  /** Whether to display public or private posts */
  mode?: 'public' | 'private';
}

/**
 * PostsList component displays a grid of posts with filtering and loading states
 * 
 * This component fetches posts from Hypergraph and transforms them into a consistent format
 * for display. It handles loading states and provides an empty state when no posts are found.
 * 
 * @param mode - Whether to display public or private posts (defaults to 'public')
 * @returns JSX element containing the posts list
 */
export function PostsList({ mode = 'public' }: PostsListProps) {
  // Fetch posts data from Hypergraph using the usePost hook
  const { data: rawPosts, isPending, loading } = usePost({ mode });

  console.log('data', rawPosts, loading, isPending);

  // Transform the raw Hypergraph data to our expected format
  // This transformation ensures consistent data structure regardless of the source
  const posts: PostDataWithRelations[] =
    rawPosts?.map((post: unknown) => {
      const p = post as Record<string, unknown>;
      return {
        // Use postId as fallback if id is not available
        id: (p.id as string) || (p.postId as string),
        postId: p.postId as string,
        title: p.title as string,
        content: p.content as string,
        excerpt: p.excerpt as string,
        // Transform author data with fallbacks for missing fields
        author: {
          id: ((p.author as Record<string, unknown>)?.id as string) || '',
          name: ((p.author as Record<string, unknown>)?.name as string) || 'Unknown Author',
          username: ((p.author as Record<string, unknown>)?.username as string) || 'unknown',
          profileUrl: ((p.author as Record<string, unknown>)?.profileUrl as string) || undefined,
        },
        url: p.url as string,
        publishedAt: p.publishedAt as string,
        tags: p.tags as string,
        // Transform metrics data with fallbacks for missing values
        metrics: {
          id: ((p.metrics as Record<string, unknown>)?.id as string) || '',
          claps: ((p.metrics as Record<string, unknown>)?.claps as number) || 0,
          views: ((p.metrics as Record<string, unknown>)?.views as number) || 0,
          comments: ((p.metrics as Record<string, unknown>)?.comments as number) || 0,
          shares: ((p.metrics as Record<string, unknown>)?.shares as number) || 0,
        },
        featuredImage: p.featuredImage as string,
        readingTime: (p.readingTime as number) || 1,
        // Use publishedAt as fallback for timestamps
        createdAt: (p.createdAt as string) || (p.publishedAt as string),
        updatedAt: (p.updatedAt as string) || (p.publishedAt as string),
      };
    }) || [];

  /**
   * Handler for viewing a post - opens the original post URL in a new tab
   * @param post - The post to view
   */
  const handleViewPost = (post: PostDataWithRelations) => {
    console.log('Viewing post:', post.title);
    // You could implement additional logic here, like analytics tracking
    window.open(post.url, '_blank', 'noopener,noreferrer');
  };

  // Show loading state while posts are being fetched
  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading posts...</div>
      </div>
    );
  }

  // Show empty state when no posts are found
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <div className="text-4xl mb-4">📰</div>
        <h3 className="text-lg font-medium mb-2">No posts found</h3>
        <p className="text-sm">
          {mode === 'public' ? 'No public posts available at the moment.' : 'No private posts available at the moment.'}
        </p>
      </div>
    );
  }

  // Main render: display posts in a responsive grid
  return (
    <div className="space-y-6">
      {/* Header section with post count */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 capitalize">{mode} Posts</h2>
          <p className="text-muted-foreground">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}{' '}
          </p>
        </div>
      </div>

      {/* Responsive grid layout for posts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onView={handleViewPost} />
        ))}
      </div>
    </div>
  );
}
