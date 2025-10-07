import { useState, useEffect, useCallback, useRef } from 'react';
import { Building2, AlertCircle, Loader2, Search, Settings } from 'lucide-react';
import CompanyCard from './components/CompanyCard';
import SortingControls from './components/SortingControls';
import Pagination from './components/Pagination';
import DynamicNavigation from './components/DynamicNavigation';
import Header from './components/Header';
import AutosuggestDropdown from './components/AutosuggestDropdown';
import { searchCompanies, checkApiHealth, getAutosuggest, type SuggestionItem } from './services/api';
import type { FilterState, Company } from './types';
import './App.css';

function App() {
  const [searchInput, setSearchInput] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    industry: '',
    companySize: '',
    location: '',
    foundingYear: '',
    tags: []
  });
  
  // Autosuggest state
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionTimeoutRef = useRef<number | null>(null);
  
  const [sortBy, setSortBy] = useState<string>('foundingYear');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiHealthy, setApiHealthy] = useState<boolean>(true);
  const [facets, setFacets] = useState<{
    locations: string[];
    countries: string[];
    industries: string[];
    companySizes: string[];
  }>({
    locations: [],
    countries: [],
    industries: [],
    companySizes: []
  });

  const itemsPerPage = 25;

  // Function to fetch data from API
  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching companies with filters:', filters, 'page:', currentPage, 'sort:', sortBy, sortOrder);
      const result = await searchCompanies(filters, currentPage, itemsPerPage, sortBy, sortOrder);
      
      console.log('API Response received:', result);
      setCompanies(result.companies);
      setTotalCount(result.totalCount);
      setFacets(result.facets);
      setApiHealthy(true);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError(`Failed to fetch companies from API: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setApiHealthy(false);
      setCompanies([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, sortBy, sortOrder]);

  // Check API health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      console.log('Checking API health...');
      const healthy = await checkApiHealth();
      console.log('API health status:', healthy);
      setApiHealthy(healthy);
      // Don't show error on initial health check - only when user tries to search
    };
    
    checkHealth();
  }, []);

  // Fetch companies when dependencies change (only if there's a search term or other filters)
  useEffect(() => {
    // Only fetch if user has entered a search term or applied filters
    if (filters.searchTerm || filters.industry || filters.location || filters.companySize || filters.foundingYear || filters.tags.length > 0) {
      fetchCompanies();
    }
  }, [fetchCompanies, filters]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, []);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    console.log('Sort changed:', newSortBy, newSortOrder);
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1); // Reset to first page when sorting changes
  };


  const handlePageChange = (page: number) => {
    console.log('Page changed to:', page);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    console.log('Retry button clicked');
    setError(null);
    fetchCompanies();
  };

  // Helper function to check if any search or filter has been applied
  const hasSearchBeenPerformed = () => {
    return !!(filters.searchTerm || filters.industry || filters.location || filters.companySize || filters.foundingYear || filters.tags.length > 0);
  };

  const handleNavigationClick = (itemId: string) => {
    console.log('Navigation clicked:', itemId);
    
    // Handle different navigation actions
    if (itemId === 'overview') {
      // Clear all filters for overview
      setFilters({
        searchTerm: '',
        industry: '',
        companySize: '',
        location: '',
        foundingYear: '',
        tags: []
      });
    } else if (itemId.startsWith('industry:')) {
      // Set industry filter
      const industry = itemId.replace('industry:', '');
      setFilters(prev => ({ ...prev, industry }));
    } else if (itemId.startsWith('location:')) {
      // Set location filter
      const location = itemId.replace('location:', '');
      setFilters(prev => ({ ...prev, location }));
    }
    
    // Reset to first page for any navigation
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    console.log('Filter changed:', filterType, value);
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    console.log('Search submitted:', searchInput);
    
    // Clear any previous errors when user starts a new search
    setError(null);
    
    setFilters(prev => ({ ...prev, searchTerm: searchInput }));
    setCurrentPage(1);
    // Hide autosuggest dropdown after search
    setShowSuggestions(false);
  };

  // Autosuggest functions
  const fetchSuggestions = useCallback(async (query: string) => {
    console.log('🔍 fetchSuggestions called with query:', query);
    
    if (query.length < 2) {
      console.log('❌ Query too short, clearing suggestions');
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    console.log('⏳ Starting autosuggest request...');
    setIsLoadingSuggestions(true);
    try {
      const suggestions = await getAutosuggest(query, 5);
      console.log('✅ Received suggestions:', suggestions);
      setSuggestions(suggestions);
      setShowSuggestions(true);
      setHighlightedIndex(-1);
      console.log('📋 Set suggestions state, showSuggestions:', true);
    } catch (error) {
      console.error('❌ Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
      console.log('⚡ Loading finished');
    }
  }, []);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('📝 Search input changed to:', value);
    setSearchInput(value);

    // Clear existing timeout
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
      console.log('🚫 Cleared previous timeout');
    }

    // Debounce autosuggest API calls
    suggestionTimeoutRef.current = setTimeout(() => {
      console.log('⏱️ Timeout fired, calling fetchSuggestions');
      fetchSuggestions(value);
    }, 300);
    console.log('⏰ Set new timeout for 300ms');
  };

  const handleSuggestionClick = (suggestion: SuggestionItem) => {
    setSearchInput(suggestion.text);
    setShowSuggestions(false);
    
    // Apply appropriate filter based on suggestion type
    switch (suggestion.type) {
      case 'company':
        setFilters(prev => ({ ...prev, searchTerm: suggestion.text }));
        break;
      case 'industry':
        setFilters(prev => ({ ...prev, industry: suggestion.text, searchTerm: '' }));
        break;
      case 'location':
        setFilters(prev => ({ ...prev, location: suggestion.text, searchTerm: '' }));
        break;
      case 'general':
      default:
        setFilters(prev => ({ ...prev, searchTerm: suggestion.text }));
        break;
    }
    
    setCurrentPage(1);
    searchInputRef.current?.blur();
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearchSubmit();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        } else {
          handleSearchSubmit();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        searchInputRef.current?.blur();
        break;
    }
  };

  const handleInputFocus = () => {
    console.log('🎯 Input focused, searchInput:', searchInput, 'suggestions:', suggestions.length);
    if (searchInput.length >= 2 && suggestions.length > 0) {
      console.log('✅ Showing suggestions on focus');
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    console.log('👋 Input blurred');
    // Delay hiding suggestions to allow for clicks on dropdown items
    setTimeout(() => {
      console.log('⏰ Hiding suggestions after blur timeout');
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      {/* Header */}
      <Header 
        apiHealthy={apiHealthy}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          {/* Left Navigation - Hidden on mobile, show as dropdown */}
          <aside className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${
            hasSearchBeenPerformed() ? 'w-32' : 'w-64'
          }`}>
            <div className="sticky top-8">
              <DynamicNavigation
                facets={facets}
                totalResults={totalCount}
                currentFilters={filters}
                onNavigationClick={handleNavigationClick}
                onFilterChange={handleFilterChange}
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Colorful Search Header */}
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 dark:from-purple-700 dark:via-blue-700 dark:to-pink-700 -mx-4 sm:-mx-6 lg:-mx-8 mb-6 shadow-2xl">
              <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="flex items-center gap-4">
                  {/* Logo/Brand Section */}
                  <div className="flex items-center gap-2 text-white font-bold text-lg sm:text-xl flex-shrink-0">
                    <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
                    <span className="hidden sm:block">Firmable</span>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="flex-1 max-w-4xl">
                    <form onSubmit={handleSearchSubmit}>
                      <div className="relative flex">
                        <div className="relative flex-1" style={{ position: 'relative', zIndex: 1 }}>
                          <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search for companies, industries, locations..."
                            value={searchInput}
                            onChange={handleSearchInputChange}
                            onKeyDown={handleSearchKeyDown}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            autoComplete="off"
                            className="w-full px-6 py-4 text-base sm:text-lg bg-white text-gray-900 placeholder-gray-500 border-none outline-none rounded-l-md focus:ring-0 shadow-lg"
                          />

                          {/* Autosuggest Dropdown */}
                          <AutosuggestDropdown
                            suggestions={suggestions}
                            isLoading={isLoadingSuggestions}
                            isVisible={showSuggestions}
                            onSuggestionClick={handleSuggestionClick}
                            highlightedIndex={highlightedIndex}
                            query={searchInput}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={!searchInput.trim()}
                          className="px-6 py-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-base font-medium rounded-r-md transition-all duration-300 shadow-lg flex items-center justify-center transform hover:scale-105"
                        >
                          <Search className="w-5 h-5" />
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  {/* Action Icons (Optional) */}
                  <div className="hidden sm:flex items-center gap-3 text-white">
                    <button className="p-2 hover:bg-blue-700 rounded-md transition-colors">
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Popular Searches - Below main search */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-black text-xs sm:text-sm font-bold bg-white/90 px-2 py-1 rounded-md backdrop-blur-sm border border-white/50 shadow-sm">Popular:</span>
                  {['Technology', 'Healthcare', 'Finance', 'AI Companies', 'Startups'].map((term, index) => {
                    const colors = [
                      'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500',
                      'bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500',
                      'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500',
                      'bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500',
                      'bg-gradient-to-r from-pink-400 to-red-400 hover:from-pink-500 hover:to-red-500'
                    ];
                    return (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          setSearchInput(term);
                          setFilters(prev => ({ ...prev, searchTerm: term }));
                          setCurrentPage(1);
                        }}
                        className={`px-3 py-1.5 text-xs text-black font-semibold rounded-full transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl transform hover:scale-105 ${colors[index % colors.length]}`}
                      >
                        {term}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                
                {/* Industry Filter */}
                {facets?.industries && facets.industries.length > 0 && (
                  <select
                    value={filters.industry || ''}
                    onChange={(e) => handleFilterChange('industry', e.target.value)}
                    className="text-sm px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Industries</option>
                    {facets.industries.slice(0, 10).map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                )}
                
                {/* Location Filter */}
                {facets?.locations && facets.locations.length > 0 && (
                  <select
                    value={filters.location || ''}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="text-sm px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Locations</option>
                    {facets.locations.slice(0, 10).map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                )}
                
                {/* Clear Filters */}
                {(filters.industry || filters.location) && (
                  <button
                    onClick={() => handleNavigationClick('overview')}
                    className="text-sm px-3 py-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 shadow-xl">
                <div className="relative">
                  <Loader2 className="w-12 h-12 animate-spin text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text mb-6" />
                  <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-purple-200 dark:border-purple-700 animate-rainbow"></div>
                </div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Searching Companies</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center max-w-md">
                  We're searching through our database to find the best matches for your query...
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span>Processing...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 mb-6">
                <div className="max-w-md mx-auto text-center">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-2">Something went wrong</h3>
                  <p className="text-red-700 dark:text-red-300 mb-6 leading-relaxed">{error}</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={handleRetry}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Try Again
                    </button>
                    <button
                      onClick={() => {
                        setError(null);
                        setSearchInput('');
                        handleNavigationClick('overview');
                      }}
                      className="px-6 py-3 border-2 border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:bg-red-900/30 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                    >
                      Clear Search
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Results Content */}
            {!loading && !error && (
              <>
                {/* Search Results Header */}
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Search Results
                      </h3>
                      {filters.searchTerm && (
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                          "{filters.searchTerm}"
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${apiHealthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>{apiHealthy ? 'Live' : 'Offline'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Active filters display */}
                  {(filters.industry || filters.location) && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Filters:</span>
                      {filters.industry && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm">
                          Industry: {filters.industry}
                          <button
                            onClick={() => handleFilterChange('industry', '')}
                            className="ml-1 hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
                          >
                            ×
                          </button>
                        </span>
                      )}
                      {filters.location && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm">
                          Location: {filters.location}
                          <button
                            onClick={() => handleFilterChange('location', '')}
                            className="ml-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5"
                          >
                            ×
                          </button>
                        </span>
                      )}
                      <button
                        onClick={() => handleNavigationClick('overview')}
                        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>

                {/* Sorting Controls */}
                <SortingControls
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={handleSortChange}
                  resultsCount={totalCount}
                />

                {/* Companies Listing */}
                {companies.length > 0 ? (
                  <div className="space-y-6 mb-8">
                    {/* Results count and pagination info */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600 dark:text-gray-400 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-medium">
                        Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount.toLocaleString()} companies
                      </span>
                      <span className="text-xs sm:text-sm">
                        Page {currentPage} of {Math.ceil(totalCount / itemsPerPage)}
                      </span>
                    </div>
                    
                    {/* Companies Grid - 3 per row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {companies.map((company: Company) => (
                        <CompanyCard key={company.id} company={company} />
                      ))}
                    </div>
                  </div>
                ) : hasSearchBeenPerformed() ? (
                  <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <div className="max-w-md mx-auto">
                      <Building2 className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">No companies found</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        We couldn't find any companies matching your search criteria. Try broadening your search or removing some filters.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          onClick={() => {
                            setSearchInput('');
                            handleNavigationClick('overview');
                          }}
                          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          Clear Search
                        </button>
                        <button
                          onClick={() => setSearchInput('Technology')}
                          className="px-6 py-2 border-2 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:bg-purple-900/30 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                        >
                          Try "Technology"
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Pagination */}
                {totalCount > itemsPerPage && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalCount}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
