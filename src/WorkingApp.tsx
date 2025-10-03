import { useState } from 'react';
import { Building2 } from 'lucide-react';
import SearchFilters from './components/SearchFilters';
import CompanyCard from './components/CompanyCard';
import type { FilterState, Company } from './types';
import './App.css';

// Sample data for initial testing
const sampleCompanies: Company[] = [
  {
    id: 1,
    name: "TechFlow Solutions",
    industry: "Technology",
    size: "51-200",
    location: "San Francisco, CA",
    foundingYear: 2018,
    website: "https://techflowsolutions.com",
    description: "AI-powered workflow automation for enterprise clients",
    tags: ["AI", "Automation", "Enterprise", "SaaS"],
    employees: "150",
    revenue: "$25M",
    status: "Growing"
  },
  {
    id: 2,
    name: "GreenEnergy Dynamics",
    industry: "Energy",
    size: "201-500",
    location: "Austin, TX",
    foundingYear: 2015,
    website: "https://greenergy.com",
    description: "Renewable energy solutions and smart grid technology",
    tags: ["Renewable Energy", "Smart Grid", "Sustainability"],
    employees: "320",
    revenue: "$45M",
    status: "Stable"
  },
  {
    id: 3,
    name: "FinanceBot Inc",
    industry: "Financial Services",
    size: "11-50",
    location: "New York, NY",
    foundingYear: 2020,
    website: "https://financebot.io",
    description: "AI-driven personal finance management platform",
    tags: ["FinTech", "AI", "Personal Finance", "Mobile App"],
    employees: "45",
    revenue: "$8M",
    status: "Growing"
  }
];

function WorkingApp() {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    industry: '',
    companySize: '',
    location: '',
    foundingYear: '',
    tags: []
  });

  // Simple filtering logic
  const filteredCompanies = sampleCompanies.filter(company => {
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch = 
        company.name.toLowerCase().includes(searchLower) ||
        company.description.toLowerCase().includes(searchLower);
      
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

    return true;
  });

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <Building2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Company Search Dashboard</h1>
          </div>
          <p className="text-gray-600 mt-1">Discover and explore companies across various industries</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters 
              filters={filters} 
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            {/* Results Count */}
            <div className="mb-6">
              <span className="font-medium">{filteredCompanies.length}</span> companies found
            </div>

            {/* Companies Grid */}
            {filteredCompanies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {filteredCompanies.map((company: Company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or filters to find more companies.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default WorkingApp;