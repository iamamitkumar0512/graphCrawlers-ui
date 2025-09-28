'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Company entity structure based on the backend API response
 */
export interface Company {
  /** Unique identifier for the company */
  _id: string;
  /** Company name */
  companyName: string;
  /** Public Hypergraph space ID associated with the company */
  publicSpaceId: string;
  /** Medium publication link for the company */
  mediumLink: string;
  /** Whether the company is currently active */
  isActive: boolean;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  /** Version number for optimistic concurrency control */
  __v: number;
}

/**
 * API response structure for companies endpoint
 */
export interface CompaniesResponse {
  /** Success status of the API call */
  success: boolean;
  /** Response data containing companies array */
  data: {
    companies: Company[];
  };
}

/**
 * Options for the useCompanies hook
 */
export interface UseCompaniesOptions {
  /** Page number for pagination */
  page?: number;
  /** Number of companies per page */
  limit?: number;
  /** Whether the query should be enabled */
  enabled?: boolean;
}

/**
 * Return type for the useCompanies hook
 */
export interface UseCompaniesReturn {
  /** Array of company data */
  companies: Company[];
  /** Loading state */
  loading: boolean;
  /** Error message if fetch fails */
  error: string | null;
  /** Function to manually refetch companies */
  refetch: () => void;
  /** Whether there are more pages available */
  hasMore: boolean;
  /** Current page number */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
}

/**
 * Custom hook to fetch companies data from the backend API
 *
 * This hook manages the state and logic for fetching company data with pagination support.
 * It handles loading states, error handling, and provides a refetch function.
 *
 * @param options - Configuration options for the hook
 * @returns Object containing companies data, loading state, and utility functions
 */
export function useCompanies(options: UseCompaniesOptions = {}): UseCompaniesReturn {
  // Extract options with default values
  const { page = 1, limit = 20, enabled = true } = options;

  // State management for companies data and UI states
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(1);

  /**
   * Fetches companies data from the backend API
   * This function is memoized with useCallback to prevent unnecessary re-renders
   */
  const fetchCompanies = useCallback(async () => {
    // Skip fetch if hook is disabled
    if (!enabled) return;

    // Set loading state and clear previous errors
    setLoading(true);
    setError(null);

    try {
      // Make API request to companies endpoint with pagination parameters
      const response = await fetch(`http://localhost:3000/api/companies?page=${currentPage}&limit=${limit}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the JSON response
      const data: CompaniesResponse = await response.json();

      if (data.success) {
        // Update companies data with the fetched results
        setCompanies(data.data.companies);
        // Simple pagination logic - determines if there are more pages
        setHasMore(data.data.companies.length === limit);
        // Calculate total pages based on returned data
        setTotalPages(Math.ceil(data.data.companies.length / limit) || 1);
      } else {
        throw new Error('Failed to fetch companies');
      }
    } catch (err) {
      // Handle errors and update error state
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching companies:', err);
    } finally {
      // Always reset loading state
      setLoading(false);
    }
  }, [currentPage, limit, enabled]);

  /**
   * Function to manually refetch companies data
   * Useful for refresh buttons or retry functionality
   */
  const refetch = useCallback(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  /**
   * Effect to fetch companies data when dependencies change
   * Runs on component mount and when page/limit/enabled changes
   */
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Return the hook interface
  return {
    companies,
    loading,
    error,
    refetch,
    hasMore,
    currentPage,
    totalPages,
  };
}
