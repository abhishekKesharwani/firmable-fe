import { useState } from 'react';
import { Building2 } from 'lucide-react';
import type { Company } from './types';
import './App.css';

// Sample data for testing
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
  }
];

function TestApp() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Building2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Company Search Dashboard</h1>
          </div>
          <p className="text-gray-600 mt-1">Test version - Discover and explore companies</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">Search</h2>
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <span className="font-medium">{sampleCompanies.length}</span> companies found
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sampleCompanies
                .filter(company => 
                  !searchTerm || 
                  company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  company.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((company) => (
                  <div key={company.id} className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{company.name}</h3>
                    <p className="text-gray-600 mb-2">{company.industry}</p>
                    <p className="text-gray-700 mb-4">{company.description}</p>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{company.location}</span>
                      <span>{company.size} employees</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TestApp;