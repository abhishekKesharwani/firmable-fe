import type { Company, FilterState } from './types';

export const filterCompanies = (companies: Company[], filters: FilterState): Company[] => {
  return companies.filter(company => {
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch = 
        company.name.toLowerCase().includes(searchLower) ||
        company.description.toLowerCase().includes(searchLower) ||
        company.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }

    // Industry filter
    if (filters.industry && company.industry !== filters.industry) {
      return false;
    }

    // Company size filter
    if (filters.companySize && company.size !== filters.companySize) {
      return false;
    }

    // Location filter
    if (filters.location && company.location !== filters.location) {
      return false;
    }

    // Founding year filter
    if (filters.foundingYear) {
      const yearThreshold = parseInt(filters.foundingYear);
      if (company.foundingYear < yearThreshold) {
        return false;
      }
    }

    // Tags filter
    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => 
        company.tags.includes(tag)
      );
      if (!hasMatchingTag) return false;
    }

    return true;
  });
};

export const sortCompanies = (companies: Company[], sortBy: string, sortOrder: 'asc' | 'desc'): Company[] => {
  const sorted = [...companies].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'foundingYear':
        comparison = a.foundingYear - b.foundingYear;
        break;
      case 'industry':
        comparison = a.industry.localeCompare(b.industry);
        break;
      case 'size':
        // Custom sorting for company size ranges
        const sizeOrder = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
        const aIndex = sizeOrder.indexOf(a.size);
        const bIndex = sizeOrder.indexOf(b.size);
        comparison = aIndex - bIndex;
        break;
      case 'location':
        comparison = a.location.localeCompare(b.location);
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });

  return sorted;
};

export const paginateResults = <T>(items: T[], page: number, itemsPerPage: number): T[] => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return items.slice(startIndex, endIndex);
};