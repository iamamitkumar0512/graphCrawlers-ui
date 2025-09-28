import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for combining and merging CSS class names
 *
 * This function combines the functionality of clsx and tailwind-merge:
 * - clsx: Handles conditional class names and various input types
 * - tailwind-merge: Resolves Tailwind CSS class conflicts by keeping the last conflicting class
 *
 * @param inputs - Variable number of class values (strings, objects, arrays, etc.)
 * @returns Merged and deduplicated class string
 *
 * @example
 * cn('px-2 py-1', 'px-4') // Returns 'py-1 px-4' (px-4 overrides px-2)
 * cn('text-red-500', { 'text-blue-500': isActive }) // Returns conditional classes
 */
export function cn(...inputs: ReadonlyArray<ClassValue>) {
  return twMerge(clsx(inputs));
}
