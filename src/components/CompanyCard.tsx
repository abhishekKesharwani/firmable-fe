import React from 'react';
import { Building2, MapPin, Calendar, Users, ExternalLink, TrendingUp, Search, Brain } from 'lucide-react';
import type { Company } from '../types';

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group">
      {/* Main Content */}
      <div className="p-4">
        {/* Header with company name and status */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                {company.name}
              </h3>
              {/* Search Type Indicator */}
              {company.searchType && (
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                  company.searchType === 'lexical' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                    : company.searchType === 'semantic'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                    : 'bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-gray-300'
                }`} title={`${company.searchType.charAt(0).toUpperCase() + company.searchType.slice(1)} search result`}>
                  {company.searchType === 'lexical' && <Search className="w-2.5 h-2.5" />}
                  {company.searchType === 'semantic' && <Brain className="w-2.5 h-2.5" />}
                  {company.searchType === 'hybrid' && (
                    <div className="flex items-center">
                      <Search className="w-2 h-2" />
                      <Brain className="w-2 h-2 -ml-0.5" />
                    </div>
                  )}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Building2 className="w-4 h-4 flex-shrink-0 text-blue-500" />
              <span className="font-medium text-sm">{company.industry}</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              <TrendingUp className="w-3 h-3 mr-1" />
              {company.status}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed mb-3 line-clamp-2">
          {company.description}
        </p>

        {/* Company details in a responsive grid */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <span className="truncate">{company.location}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Users className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <span className="truncate">{company.employees}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <span>Founded {company.foundingYear}</span>
          </div>
          <div className="flex items-center gap-1">
            <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <a 
              href={company.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline text-xs font-medium transition-colors truncate"
            >
              Visit Website
            </a>
          </div>
        </div>

        {/* Tags */}
        {company.tags && company.tags.length > 0 && (
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex flex-wrap gap-1">
              {company.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                >
                  {tag}
                </span>
              ))}
              {company.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
                  +{company.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyCard;