'use client';

import Image from 'next/image';
import { Button } from '@/Components/ui/button';
import { PostDataWithRelations } from '@/hooks/usePost';

/**
 * Props for the PostCard component
 */
interface PostCardProps {
  /** The post data to display */
  post: PostDataWithRelations;
  /** Optional callback function when viewing the post */
  onView?: (post: PostDataWithRelations) => void;
}

export function PostCard({ post, onView }: PostCardProps) {
  const handleView = () => {
    if (onView) {
      onView(post);
    } else {
      // Default behavior: open the original post URL
      window.open(post.url, '_blank', 'noopener,noreferrer');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white">
      {/* Featured Image */}
      {post.featuredImage && (
        <div className="aspect-video w-full overflow-hidden relative">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-200"
            onError={() => {
              // Hide the image container if the image fails to load
              const container = document.querySelector('.aspect-video');
              if (container) {
                (container as HTMLElement).style.display = 'none';
              }
            }}
          />
        </div>
      )}

      {/* Card Content */}
      <div className="p-6 space-y-4">
        {/* Author and Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {post.author.profileUrl && (
              <div className="w-8 h-8 rounded-full overflow-hidden relative">
                <Image
                  src={post.author.profileUrl}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                  onError={() => {
                    // Hide the profile image if it fails to load
                    const container = document.querySelector('.w-8.h-8');
                    if (container) {
                      (container as HTMLElement).style.display = 'none';
                    }
                  }}
                />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
              <p className="text-xs text-gray-500">@{post.author.username}</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">{formatDate(post.publishedAt)}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 leading-tight">{post.title}</h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{post.excerpt}</p>

        {/* Tags */}
        {post.tags && post.tags.trim() && (
          <div className="flex flex-wrap gap-1">
            {post.tags.split(',').map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Metrics and Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <span>👏</span>
              <span>{post.metrics.claps}</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>👁️</span>
              <span>{post.metrics.views}</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>💬</span>
              <span>{post.metrics.comments}</span>
            </span>
            <span className="text-xs text-gray-500">{post.readingTime} min read</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleView} className="text-xs">
            View Post
          </Button>
        </div>
      </div>
    </div>
  );
}
