import React from 'react';
import { 
  Building2, 
  Search, 
  BarChart3, 
  Users, 
  MapPin,
  Globe
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  count?: number;
  isActive?: boolean;
}

interface DynamicNavigationProps {
  facets?: {
    locations: string[];
    countries: string[];
    industries: string[];
    companySizes: string[];
  };
  totalResults: number;
  currentFilters: any;
  onNavigationClick: (itemId: string) => void;
  onFilterChange?: (filterType: string, value: string) => void;
}

const DynamicNavigation: React.FC<DynamicNavigationProps> = ({
  facets,
  totalResults,
  currentFilters,
  onNavigationClick,
  onFilterChange
}) => {
  // Generate dynamic navigation items based on data
  const navigationItems: NavigationItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      count: totalResults,
      isActive: !currentFilters.industry && !currentFilters.location
    },
    {
      id: 'industries',
      label: 'Industries',
      icon: Building2,
      count: facets?.industries?.length || 0
    },
    {
      id: 'locations',
      label: 'Locations',
      icon: MapPin,
      count: facets?.locations?.length || 0
    },
    {
      id: 'countries',
      label: 'Countries',
      icon: Globe,
      count: facets?.countries?.length || 0
    },
    {
      id: 'company-sizes',
      label: 'Company Sizes',
      icon: Users,
      count: facets?.companySizes?.length || 0
    }
  ];

  // Top categories from facets data
  const topIndustries = facets?.industries?.slice(0, 5) || [];
  const topLocations = facets?.locations?.slice(0, 5) || [];

  return (
    <nav className="h-full overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {/* Main Navigation */}
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Navigation
          </h3>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigationClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className="bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Filters */}
        {topIndustries.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Top Industries
            </h3>
            <div className="space-y-1">
              {topIndustries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => onNavigationClick(`industry:${industry}`)}
                  className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="truncate">{industry}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Top Locations */}
        {topLocations.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Top Locations
            </h3>
            <div className="space-y-1">
              {topLocations.map((location) => (
                <button
                  key={location}
                  onClick={() => onNavigationClick(`location:${location}`)}
                  className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="truncate">{location}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Filter Controls */}
        <div className="mt-6">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Quick Filters
          </h3>
          <div className="space-y-2">
            {/* Industry Filter */}
            {facets?.industries && facets.industries.length > 0 && (
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">Industry</label>
                <select
                  value={currentFilters.industry || ''}
                  onChange={(e) => onFilterChange?.('industry', e.target.value)}
                  className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Industries</option>
                  {facets.industries.slice(0, 10).map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Location Filter */}
            {facets?.locations && facets.locations.length > 0 && (
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">Location</label>
                <select
                  value={currentFilters.location || ''}
                  onChange={(e) => onFilterChange?.('location', e.target.value)}
                  className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Locations</option>
                  {facets.locations.slice(0, 10).map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Current Filters Summary */}
        {(currentFilters.industry || currentFilters.location || currentFilters.searchTerm) && (
          <div className="mt-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Active Filters
            </h3>
            <div className="space-y-2">
              {currentFilters.searchTerm && (
                <div className="flex items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                  <Search className="w-3 h-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="text-xs text-blue-700 dark:text-blue-300 truncate ml-2">
                    {currentFilters.searchTerm}
                  </span>
                </div>
              )}
              {currentFilters.industry && (
                <div className="flex items-center px-3 py-2 bg-green-50 dark:bg-green-900/30 rounded-md">
                  <Building2 className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-xs text-green-700 dark:text-green-300 truncate ml-2">
                    {currentFilters.industry}
                  </span>
                </div>
              )}
              {currentFilters.location && (
                <div className="flex items-center px-3 py-2 bg-purple-50 dark:bg-purple-900/30 rounded-md">
                  <MapPin className="w-3 h-3 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <span className="text-xs text-purple-700 dark:text-purple-300 truncate ml-2">
                    {currentFilters.location}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Footer with quick actions - stays at bottom */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <button
          onClick={() => onNavigationClick('overview')}
          className="w-full px-3 py-2 text-sm font-medium text-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </nav>
  );
};

export default DynamicNavigation;