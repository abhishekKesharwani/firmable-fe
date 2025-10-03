import type { Company, FilterState } from '../types';

// API Configuration
const API_BASE_URL = '/api'; // Use proxy instead of full URL to avoid CORS
const SEARCH_ENDPOINT = '/search/comprehensive';

// API Request Types
interface ComprehensiveSearchRequest {
  query: string;
  filters?: {
    industry?: string[];
    year_founded_d?: {
      from?: number;
      to?: number;
    };
    locality_ss?: string[];
    country_s?: string[];
    [key: string]: any;
  };
  facetFields: string[];
  sortField?: string;
  sortDirection?: string;
  page: number;
  pageSize: number;
}

// API Response Types
interface ComprehensiveApiResponse {
  documents: any[];
  totalResults: number;
  facets: {
    country_s?: { [key: string]: number };
    industry_s?: { [key: string]: number };
    locality_ss?: { [key: string]: number };
  };
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  queryInfo: {
    query: string;
    filters: any;
    sort: string;
    executionTime: number;
  };
}

// Transform API response to our Company type
const transformApiCompany = (doc: any): Company => {
  return {
    id: doc.id || Math.random(),
    name: doc.name_s || doc.name?.[0] || 'Company',
    industry: doc.industry_s || doc.industry?.[0] || 'Technology',
    size: doc.size_range_s || doc.current_employee_estimate_l?.toString() || '1-50',
    location: doc.locality_ss?.[0] || doc.locality?.[0] || 'Remote',
    foundingYear: doc.year_founded_d || new Date().getFullYear(),
    website: doc.domain_s ? `https://${doc.domain_s}` : '#',
    description: doc.description || doc.summary || `Company in ${doc.industry_s || 'various industries'}`,
    tags: doc.tags || [],
    employees: doc.current_employee_estimate_l?.toString() || doc.size_range_s || '50',
    revenue: doc.revenue || 'Not disclosed',
    status: 'Active'
  };
};

// Build comprehensive search request body
const buildSearchRequest = (
  filters: FilterState,
  page: number = 1,
  pageSize: number = 25,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc'
): ComprehensiveSearchRequest => {
  const request: ComprehensiveSearchRequest = {
    query: filters.searchTerm || '*',
    facetFields: ['industry_s', 'country_s', 'locality_ss'],
    page: page - 1, // Convert to 0-based indexing
    pageSize: pageSize
  };

  // Initialize filters object only if we have actual filters
  const hasFilters = filters.industry || filters.location || filters.foundingYear || 
                    filters.companySize || (filters.tags && filters.tags.length > 0);
  
  if (hasFilters) {
    request.filters = {};

    // Add industry filter
    if (filters.industry) {
      request.filters.industry = [filters.industry];
    }

    // Add location filter
    if (filters.location) {
      request.filters.locality_ss = [filters.location];
    }

    // Add founding year filter
    if (filters.foundingYear) {
      const yearThreshold = parseInt(filters.foundingYear);
      request.filters.year_founded_d = {
        from: yearThreshold,
        to: new Date().getFullYear()
      };
    }

    // Add company size filter
    if (filters.companySize) {
      request.filters.company_size = [filters.companySize];
    }

    // Add tags filter
    if (filters.tags && filters.tags.length > 0) {
      request.filters.tags = filters.tags;
    }
  }

  // Add sorting
  if (sortBy) {
    const sortField = sortBy === 'foundingYear' ? 'year_founded_d' :
                     sortBy === 'industry' ? 'industry_s' :
                     sortBy === 'size' ? 'current_employee_estimate_l' :
                     sortBy === 'location' ? 'locality_ss' : 'year_founded_d';
    
    const sortDirection = sortOrder === 'desc' ? 'desc' : 'asc';
    request.sortField = sortField;
    request.sortDirection = `${sortField} ${sortDirection}`;
  }

  return request;
};

// Main search function
export const searchCompanies = async (
  filters: FilterState,
  page: number = 1,
  pageSize: number = 25,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc'
): Promise<{
  companies: Company[];
  totalCount: number;
  facets: {
    locations: string[];
    countries: string[];
    industries: string[];
    companySizes: string[];
  };
}> => {
  try {
    const requestBody = buildSearchRequest(filters, page, pageSize, sortBy, sortOrder);
    const url = `${API_BASE_URL}${SEARCH_ENDPOINT}`;

    console.log('🔍 API Request Details:');
    console.log('  Method: POST');
    console.log('  URL:', url);
    console.log('  Request Body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📡 Response Status:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    const data: ComprehensiveApiResponse = await response.json();
    
    console.log('✅ API Response Data:');
    console.log('  Documents found:', data.totalResults || 0);
    console.log('  Documents returned:', data.documents?.length || 0);
    console.log('  Facets available:', Object.keys(data.facets || {}));
    console.log('  Execution time:', data.queryInfo?.executionTime || 0, 'ms');

    // Transform API response
    const companies = data.documents.map(transformApiCompany);
    const totalCount = data.totalResults || 0;

    // Extract facets for filter options
    const facets = {
      locations: Object.keys(data.facets?.locality_ss || {}),
      countries: Object.keys(data.facets?.country_s || {}),
      industries: Object.keys(data.facets?.industry_s || {}),
      companySizes: [] // Will be populated from data if available
    };

    return {
      companies,
      totalCount,
      facets
    };

  } catch (error) {
    console.error('❌ Search API Error:', error);
    
    // Return empty results on error
    return {
      companies: [],
      totalCount: 0,
      facets: {
        locations: [],
        countries: [],
        industries: [],
        companySizes: []
      }
    };
  }
};

// Health check function
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('/api/health', { // Use proxy path
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn('API health check failed:', error);
    return false;
  }
};

// Autosuggest types
export interface SuggestionItem {
  text: string;
  type: 'company' | 'industry' | 'location' | 'general';
  category?: string;
  count?: number;
}

interface AutosuggestResponse {
  allSuggestions: any[];
  companyNames: any[];
  industries: any[];
  locations: any[];
  queryTemplates: any[];
  // Legacy support
  suggestions?: SuggestionItem[];
  query?: string;
  limit?: number;
  total?: number;
}

// Autosuggest function
export const getAutosuggest = async (query: string, limit: number = 5): Promise<SuggestionItem[]> => {
  try {
    if (!query.trim() || query.length < 2) {
      return [];
    }

    const url = `${API_BASE_URL}/autosuggest?query=${encodeURIComponent(query)}&limit=${limit}`;
    
    console.log('🔍 Autosuggest Request:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AutosuggestResponse = await response.json();
    
    console.log('✅ Autosuggest Response Raw:', data);
    console.log('📋 Data type:', typeof data);
    console.log('🔍 Data keys:', Object.keys(data));
    console.log('📝 AllSuggestions:', data.allSuggestions);
    console.log('🎯 AllSuggestions type:', typeof data.allSuggestions);
    console.log('📏 Is allSuggestions array?', Array.isArray(data.allSuggestions));
    console.log('📝 Legacy Suggestions:', data.suggestions);
    console.log('🎯 Legacy Suggestions type:', typeof data.suggestions);
    console.log('📏 Is legacy suggestions array?', Array.isArray(data.suggestions));

    // Handle different response formats
    let suggestions: SuggestionItem[] = [];

    // Check if data has allSuggestions (new API format)
    if (data.allSuggestions && Array.isArray(data.allSuggestions)) {
      console.log('🔄 Processing allSuggestions array');
      suggestions = data.allSuggestions.map(suggestion => {
        console.log('🔄 Processing suggestion:', suggestion, 'Type:', typeof suggestion);
        if (typeof suggestion === 'object' && suggestion !== null && suggestion.text) {
          // Map API types to our component types
          const mappedType = suggestion.type === 'template' ? 'general' as const :
                           suggestion.type === 'company' ? 'company' as const :
                           suggestion.type === 'industry' ? 'industry' as const :
                           suggestion.type === 'location' ? 'location' as const :
                           'general' as const;
          
          return {
            text: suggestion.text,
            type: mappedType,
            category: suggestion.description
          };
        }
        return {
          text: String(suggestion),
          type: 'general' as const
        };
      });
    }
    // Legacy support: Check if data.suggestions exists and is an array
    else if (data.suggestions && Array.isArray(data.suggestions)) {
      console.log('🔄 Processing legacy suggestions array');
      suggestions = data.suggestions.map(suggestion => {
        console.log('🔄 Processing suggestion:', suggestion, 'Type:', typeof suggestion);
        if (typeof suggestion === 'object' && suggestion !== null && suggestion.text) {
          console.log('✅ Already SuggestionItem object');
          return suggestion;
        }
        console.log('🔄 Converting string to SuggestionItem');
        return {
          text: String(suggestion),
          type: 'general' as const
        };
      });
    } 
    // Handle case where response is directly an array
    else if (Array.isArray(data)) {
      console.log('🔄 Response is direct array');
      suggestions = data.map(suggestion => ({
        text: String(suggestion),
        type: 'general' as const
      }));
    }

    console.log('🎯 Final processed suggestions:', suggestions);
    return suggestions;

  } catch (error) {
    console.error('❌ Autosuggest Error:', error);
    return [];
  }
};

// Export API configuration for other components
export const API_CONFIG = {
  BASE_URL: '/api', // Updated for proxy
  SEARCH_ENDPOINT,
  AUTOSUGGEST_ENDPOINT: '/autosuggest',
  DEFAULT_PAGE_SIZE: 25,
  DEFAULT_FACET_LIMIT: 50,
};