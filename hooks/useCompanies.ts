'use client';

import { useState, useEffect, useCallback } from 'react';

// Types based on the API response structure
export interface Company {
  _id: string;
  companyName: string;
  publicSpaceId: string;
  mediumLink: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CompaniesResponse {
  success: boolean;
  data: {
    companies: Company[];
  };
}

export interface UseCompaniesOptions {
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export interface UseCompaniesReturn {
  companies: Company[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}

export function useCompanies(options: UseCompaniesOptions = {}): UseCompaniesReturn {
  const { page = 1, limit = 20, enabled = true } = options;

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCompanies = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/api/companies?page=${currentPage}&limit=${limit}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CompaniesResponse = await response.json();

      if (data.success) {
        setCompanies(data.data.companies);
        // Simple pagination logic - you might want to enhance this based on your API
        setHasMore(data.data.companies.length === limit);
        setTotalPages(Math.ceil(data.data.companies.length / limit) || 1);
      } else {
        throw new Error('Failed to fetch companies');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, enabled]);

  const refetch = useCallback(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

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
