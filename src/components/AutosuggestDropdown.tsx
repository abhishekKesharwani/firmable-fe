import React from 'react';
import { Search, Clock, Building2, MapPin, Briefcase } from 'lucide-react';
import type { SuggestionItem } from '../services/api';

interface AutosuggestDropdownProps {
  suggestions: SuggestionItem[];
  isLoading: boolean;
  isVisible: boolean;
  onSuggestionClick: (suggestion: SuggestionItem) => void;
  highlightedIndex: number;
  query: string;
}

const AutosuggestDropdown: React.FC<AutosuggestDropdownProps> = ({
  suggestions,
  isLoading,
  isVisible,
  onSuggestionClick,
  highlightedIndex,
  query
}) => {
  console.log('🎯 AutosuggestDropdown render:', {
    suggestions: suggestions.length,
    isLoading,
    isVisible,
    query
  });
  
  if (!isVisible) {
    console.log('❌ Dropdown not visible, returning null');
    return null;
  }

  const getIconForType = (type: SuggestionItem['type']) => {
    switch (type) {
      case 'company':
        return Building2;
      case 'industry':
        return Briefcase;
      case 'location':
        return MapPin;
      case 'general':
      default:
        return Search;
    }
  };

  const getTypeLabel = (type: SuggestionItem['type']) => {
    switch (type) {
      case 'company':
        return 'Company';
      case 'industry':
        return 'Industry';
      case 'location':
        return 'Location';
      case 'general':
      default:
        return '';
    }
  };

  const getTypeColor = (type: SuggestionItem['type']) => {
    switch (type) {
      case 'company':
        return 'text-blue-500';
      case 'industry':
        return 'text-green-500';
      case 'location':
        return 'text-purple-500';
      case 'general':
      default:
        return 'text-gray-400';
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="font-semibold text-blue-600 dark:text-blue-400">
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  // Group suggestions by type for better organization
  const groupedSuggestions = suggestions.reduce((acc, suggestion, index) => {
    if (!acc[suggestion.type]) {
      acc[suggestion.type] = [];
    }
    acc[suggestion.type].push({ ...suggestion, originalIndex: index });
    return acc;
  }, {} as Record<SuggestionItem['type'], (SuggestionItem & { originalIndex: number })[]>);

  const typeOrder: SuggestionItem['type'][] = ['company', 'industry', 'location', 'general'];

  console.log('✅ Rendering dropdown with suggestions:', suggestions);

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto backdrop-blur-sm"
         style={{ zIndex: 9999 }}>
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Searching...</span>
        </div>
      ) : suggestions.length > 0 ? (
        <div className="py-1">
          {typeOrder.map(type => {
            const typeSuggestions = groupedSuggestions[type];
            if (!typeSuggestions || typeSuggestions.length === 0) return null;

            return (
              <div key={type}>
                {/* Type Header (only show if there are multiple types) */}
                {Object.keys(groupedSuggestions).length > 1 && getTypeLabel(type) && (
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-600">
                    {getTypeLabel(type)}s
                  </div>
                )}
                
                {/* Suggestions for this type */}
                <ul>
                  {typeSuggestions.map((suggestion) => {
                    const IconComponent = getIconForType(suggestion.type);
                    const isHighlighted = suggestion.originalIndex === highlightedIndex;
                    
                    return (
                      <li key={suggestion.originalIndex}>
                        <button
                          className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                            isHighlighted ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                          }`}
                          onClick={() => onSuggestionClick(suggestion)}
                        >
                          <IconComponent className={`w-4 h-4 flex-shrink-0 ${getTypeColor(suggestion.type)}`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {highlightMatch(suggestion.text, query)}
                            </div>
                          </div>
                          {getTypeLabel(suggestion.type) && Object.keys(groupedSuggestions).length === 1 && (
                            <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                              {getTypeLabel(suggestion.type)}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      ) : query.length >= 2 ? (
        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
          No suggestions found for "{query}"
        </div>
      ) : null}
      
      {/* Footer with tip */}
      {suggestions.length > 0 && (
        <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-3 h-3" />
            <span>Press Enter to search or click a suggestion</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutosuggestDropdown;