import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import type { SortOption } from '../types';

interface SortingControlsProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  resultsCount: number;
}

const sortOptions: SortOption[] = [
  { value: 'foundingYear', label: 'Founding Year' },
  { value: 'industry', label: 'Industry' },
  { value: 'size', label: 'Company Size' },
  { value: 'location', label: 'Location' }
];

const SortingControls: React.FC<SortingControlsProps> = ({
  sortBy,
  sortOrder,
  onSortChange,
  resultsCount
}) => {
  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      // Toggle sort order if same field
      onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with default ascending order
      onSortChange(newSortBy, 'asc');
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="text-gray-700 dark:text-gray-300">
        <span className="font-medium">{resultsCount}</span> companies found
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
        <div className="flex items-center space-x-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                sortBy === option.value
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
              }`}
            >
              <span>{option.label}</span>
              {sortBy === option.value && (
                <ArrowUpDown 
                  className={`w-3 h-3 transition-transform ${
                    sortOrder === 'desc' ? 'rotate-180' : ''
                  }`} 
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SortingControls;