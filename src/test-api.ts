import { searchCompanies } from './services/api';
import type { FilterState } from './types';

// Test function to verify API integration
export const testApiIntegration = async () => {
  console.log('🔍 Testing API Integration...');
  
  // Test basic search
  const basicFilters: FilterState = {
    searchTerm: '',
    industry: '',
    companySize: '',
    location: '',
    foundingYear: '',
    tags: []
  };

  try {
    console.log('📡 Making API request to search endpoint...');
    const result = await searchCompanies(basicFilters, 1, 9);
    
    console.log('✅ API Response:', {
      companiesCount: result.companies.length,
      totalCount: result.totalCount,
      facetsAvailable: Object.keys(result.facets),
      firstCompany: result.companies[0] || 'No companies found'
    });

    // Test search with filters
    const filteredSearch: FilterState = {
      searchTerm: 'technology',
      industry: '',
      companySize: '',
      location: '',
      foundingYear: '',
      tags: []
    };

    console.log('🔍 Testing filtered search...');
    const filteredResult = await searchCompanies(filteredSearch, 1, 9);
    
    console.log('✅ Filtered Search Result:', {
      companiesCount: filteredResult.companies.length,
      totalCount: filteredResult.totalCount,
      searchTerm: 'technology'
    });

    return true;
  } catch (error) {
    console.error('❌ API Integration Test Failed:', error);
    return false;
  }
};

// Call this in browser console to test: testApiIntegration()
(window as any).testApiIntegration = testApiIntegration;