'use client';

import { useState, useEffect, useCallback } from 'react';
import { Paragraph, ParagraphsResponse, Pagination } from './useCompanyData';

/**
 * Options for the useParagraphs hook
 */
export interface UseParagraphsOptions {
  /** Name of the company to fetch paragraphs for */
  companyName?: string;
  /** Page number for pagination */
  page?: number;
  /** Number of paragraphs per page */
  limit?: number;
  /** Platform to filter by (e.g., 'medium') */
  platform?: string;
  /** Whether to filter by processed status */
  processed?: boolean;
  /** Whether the query should be enabled */
  enabled?: boolean;
}

/**
 * Return type for the useParagraphs hook
 */
export interface UseParagraphsReturn {
  /** Array of paragraph data */
  paragraphs: Paragraph[];
  /** Loading state */
  loading: boolean;
  /** Error message if fetch fails */
  error: string | null;
  /** Function to manually refetch paragraphs */
  refetch: () => void;
  /** Pagination information */
  pagination: Pagination | null;
  /** Whether there are more pages available */
  hasMore: boolean;
  /** Current page number */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of paragraphs */
  totalParagraphs: number;
}

/**
 * Custom hook to fetch paragraphs for a specific company
 *
 * This hook manages the state and logic for fetching paragraph data from the backend API
 * with filtering, pagination, and error handling support.
 *
 * @param options - Configuration options for the hook
 * @returns Object containing paragraphs data, loading state, and utility functions
 */
export function useParagraphs(options: UseParagraphsOptions = {}): UseParagraphsReturn {
  // Extract options with default values
  const { companyName = '', page = 1, limit = 100, platform = 'medium', processed = false, enabled = true } = options;

  // State management for paragraphs data and UI states
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(1);
  const [totalParagraphs, setTotalParagraphs] = useState(0);

  const fetchParagraphs = useCallback(async () => {
    if (!enabled || !companyName) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3000/api/companies/${companyName}/paragraphs?platform=${platform}&processed=${processed}&page=${currentPage}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ParagraphsResponse = await response.json();

      if (data.success) {
        setParagraphs(data.data.paragraphs);
        setPagination(data.data.pagination);
        setHasMore(data.data.pagination.hasNext);
        setCurrentPage(data.data.pagination.currentPage);
        setTotalPages(data.data.pagination.totalPages);
        setTotalParagraphs(data.data.pagination.totalParagraphs);
      } else {
        throw new Error('Failed to fetch paragraphs');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching paragraphs:', err);
    } finally {
      setLoading(false);
    }
  }, [companyName, currentPage, limit, platform, processed, enabled]);

  const refetch = useCallback(() => {
    fetchParagraphs();
  }, [fetchParagraphs]);

  useEffect(() => {
    fetchParagraphs();
  }, [fetchParagraphs]);

  return {
    paragraphs,
    loading,
    error,
    refetch,
    pagination,
    hasMore,
    currentPage,
    totalPages,
    totalParagraphs,
  };
}

/**
 * Custom hook to fetch paragraphs from all companies
 *
 * This hook aggregates paragraph data from all companies by:
 * 1. Fetching the list of all companies
 * 2. Fetching paragraphs for each company
 * 3. Combining all paragraphs into a single array
 *
 * @param options - Configuration options (excluding companyName)
 * @returns Object containing all paragraphs data, loading state, and utility functions
 */
export function useAllParagraphs(options: Omit<UseParagraphsOptions, 'companyName'> = {}): UseParagraphsReturn {
  const [allParagraphs, setAllParagraphs] = useState<Paragraph[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalParagraphs, setTotalParagraphs] = useState(0);

  const fetchAllParagraphs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // First get all companies
      const companiesResponse = await fetch('http://localhost:3000/api/companies?page=1&limit=100');
      if (!companiesResponse.ok) {
        throw new Error('Failed to fetch companies');
      }

      const companiesData = await companiesResponse.json();
      if (!companiesData.success) {
        throw new Error('Failed to fetch companies');
      }

      const companies = companiesData.data.companies;
      const allParagraphsList: Paragraph[] = [];

      // Fetch paragraphs for each company
      for (const company of companies) {
        try {
          const paragraphsResponse = await fetch(
            `http://localhost:3000/api/companies/${company.companyName}/paragraphs?platform=${options.platform || 'medium'}&processed=${options.processed || false}&page=1&limit=100`,
          );

          if (paragraphsResponse.ok) {
            const paragraphsData = await paragraphsResponse.json();
            if (paragraphsData.success) {
              allParagraphsList.push(...paragraphsData.data.paragraphs);
            }
          }
        } catch (err) {
          console.error(`Error fetching paragraphs for ${company.companyName}:`, err);
          // Continue with other companies even if one fails
        }
      }

      setAllParagraphs(allParagraphsList);
      setTotalParagraphs(allParagraphsList.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching all paragraphs:', err);
    } finally {
      setLoading(false);
    }
  }, [options.platform, options.processed]);

  const refetch = useCallback(() => {
    fetchAllParagraphs();
  }, [fetchAllParagraphs]);

  useEffect(() => {
    fetchAllParagraphs();
  }, [fetchAllParagraphs]);

  return {
    paragraphs: allParagraphs,
    loading,
    error,
    refetch,
    pagination: null,
    hasMore: false,
    currentPage: 1,
    totalPages: 1,
    totalParagraphs,
  };
}
