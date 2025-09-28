'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCompanies, Company } from './useCompanies';

// Types based on the paragraphs API response structure
export interface Author {
  name: string;
  username: string;
  profileUrl: string;
}

export interface PostData {
  postId: string;
  title: string;
  content: string;
  excerpt: string;
  author: Author;
  url: string;
  publishedAt: string;
  tags: string[];
  metrics: Metrics;
  featuredImage?: string;
  readingTime: number;
}

export interface Metrics {
  claps: number;
  views: number;
  comments: number;
  shares: number;
}

export interface Paragraph {
  _id: string;
  companyName: string;
  platform: string;
  postData: PostData;
  processed: boolean;
  fetchedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalParagraphs: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ParagraphsResponse {
  success: boolean;
  data: {
    paragraphs: Paragraph[];
    pagination: Pagination;
  };
}

export interface CompanyWithParagraphs extends Company {
  paragraphs: Paragraph[];
  totalParagraphs: number;
  totalClaps: number;
  totalViews: number;
  totalComments: number;
}

export interface UseCompanyDataOptions {
  page?: number;
  limit?: number;
  enabled?: boolean;
  platform?: string;
  processed?: boolean;
}

export interface UseCompanyDataReturn {
  companiesWithParagraphs: CompanyWithParagraphs[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
  totalCompanies: number;
  totalParagraphs: number;
}

export function useCompanyData(options: UseCompanyDataOptions = {}): UseCompanyDataReturn {
  const { page = 1, limit = 20, enabled = true, platform = 'medium', processed = false } = options;

  const [companiesWithParagraphs, setCompaniesWithParagraphs] = useState<CompanyWithParagraphs[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [totalParagraphs, setTotalParagraphs] = useState(0);

  // Use the existing useCompanies hook
  const {
    companies,
    loading: companiesLoading,
    error: companiesError,
    refetch: refetchCompanies,
    hasMore: companiesHasMore,
    currentPage: companiesCurrentPage,
    totalPages: companiesTotalPages,
  } = useCompanies({ page, limit, enabled });

  // Fetch paragraphs for a specific company
  const fetchCompanyParagraphs = useCallback(
    async (companyName: string): Promise<Paragraph[]> => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/companies/${companyName}/paragraphs?platform=${platform}&processed=${processed}&page=1&limit=100`,
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
          return data.data.paragraphs;
        } else {
          throw new Error('Failed to fetch paragraphs');
        }
      } catch (err) {
        console.error(`Error fetching paragraphs for ${companyName}:`, err);
        return []; // Return empty array on error to not break the flow
      }
    },
    [platform, processed],
  );

  // Process companies and fetch their paragraphs
  const processCompaniesWithParagraphs = useCallback(
    async (companiesList: Company[]) => {
      setLoading(true);
      setError(null);

      try {
        const companiesWithData: CompanyWithParagraphs[] = [];
        let totalParagraphsCount = 0;

        // Process companies in parallel with a reasonable concurrency limit
        const batchSize = 5;
        for (let i = 0; i < companiesList.length; i += batchSize) {
          const batch = companiesList.slice(i, i + batchSize);

          const batchPromises = batch.map(async (company) => {
            const paragraphs = await fetchCompanyParagraphs(company.companyName);

            // Calculate aggregated metrics
            const totalClaps = paragraphs.reduce((sum, p) => sum + p.postData.metrics.claps, 0);
            const totalViews = paragraphs.reduce((sum, p) => sum + p.postData.metrics.views, 0);
            const totalComments = paragraphs.reduce((sum, p) => sum + p.postData.metrics.comments, 0);

            return {
              ...company,
              paragraphs,
              totalParagraphs: paragraphs.length,
              totalClaps,
              totalViews,
              totalComments,
            };
          });

          const batchResults = await Promise.all(batchPromises);
          companiesWithData.push(...batchResults);
          totalParagraphsCount += batchResults.reduce((sum, company) => sum + company.totalParagraphs, 0);
        }

        setCompaniesWithParagraphs(companiesWithData);
        setTotalCompanies(companiesList.length);
        setTotalParagraphs(totalParagraphsCount);
        setHasMore(companiesHasMore);
        setCurrentPage(companiesCurrentPage);
        setTotalPages(companiesTotalPages);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error('Error processing companies with paragraphs:', err);
      } finally {
        setLoading(false);
      }
    },
    [fetchCompanyParagraphs, companiesHasMore, companiesCurrentPage, companiesTotalPages],
  );

  // Refetch function
  const refetch = useCallback(() => {
    refetchCompanies();
  }, [refetchCompanies]);

  // Effect to process companies when they change
  useEffect(() => {
    if (companies.length > 0) {
      processCompaniesWithParagraphs(companies);
    }
  }, [companies, processCompaniesWithParagraphs]);

  // Handle companies loading and error states
  useEffect(() => {
    if (companiesError) {
      setError(companiesError);
      setLoading(false);
    } else if (companiesLoading) {
      setLoading(true);
    }
  }, [companiesLoading, companiesError]);

  return {
    companiesWithParagraphs,
    loading: loading || companiesLoading,
    error: error || companiesError,
    refetch,
    hasMore,
    currentPage,
    totalPages,
    totalCompanies,
    totalParagraphs,
  };
}
