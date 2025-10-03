import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import type { FilterState } from '../types';

interface SearchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  facets?: {
    locations: string[];
    countries: string[];
    industries: string[];
    companySizes: string[];
  };
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFiltersChange, facets }) => {
  // Fallback data when facets are not available
  const fallbackIndustries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 
    'Manufacturing', 'Energy', 'Agriculture', 'Media', 'Logistics'
  ];
  
  const fallbackCompanySizes = [
    '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
  ];
  
  const fallbackTags = [
    'AI', 'Automation', 'Enterprise', 'SaaS', 'FinTech', 'HealthTech',
    'EdTech', 'IoT', 'Cloud', 'Mobile', 'Analytics', 'Security'
  ];

  // Use facets data or fallback to default options
  const availableIndustries = facets?.industries?.length ? facets.industries : fallbackIndustries;
  const availableCompanySizes = facets?.companySizes?.length ? facets.companySizes : fallbackCompanySizes;
  const availableLocations = facets?.locations || [];
  const availableTags = fallbackTags; // Keep using static tags for now
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchTerm: '',
      industry: '',
      companySize: '',
      location: '',
      foundingYear: '',
      tags: []
    });
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    updateFilter('tags', newTags);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </h2>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
        >
          <X className="w-4 h-4 mr-1" />
          Clear all
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search Companies
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by company name, description..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Industry Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Industry
        </label>
        <select
          value={filters.industry}
          onChange={(e) => updateFilter('industry', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Industries</option>
          {availableIndustries.map((industry: string) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
      </div>

      {/* Company Size Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Company Size
        </label>
        <select
          value={filters.companySize}
          onChange={(e) => updateFilter('companySize', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Sizes</option>
          {availableCompanySizes.map((size: string) => (
            <option key={size} value={size}>
              {size} employees
            </option>
          ))}
        </select>
      </div>

      {/* Location Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Location
        </label>
        <select
          value={filters.location}
          onChange={(e) => updateFilter('location', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Locations</option>
          {availableLocations.map((location: string) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Founding Year Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Founded After
        </label>
        <input
          type="number"
          placeholder="e.g., 2015"
          value={filters.foundingYear}
          onChange={(e) => updateFilter('foundingYear', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          min="1900"
          max={new Date().getFullYear()}
        />
      </div>

      {/* Tags Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tags
        </label>
        <div className="max-h-32 overflow-y-auto space-y-1">
          {availableTags.map((tag: string) => (
            <label key={tag} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.tags.includes(tag)}
                onChange={() => toggleTag(tag)}
                className="mr-2 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{tag}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;