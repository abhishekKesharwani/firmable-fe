export interface Company {
  id: number;
  name: string;
  industry: string;
  size: string;
  location: string;
  foundingYear: number;
  website: string;
  description: string;
  tags: string[];
  employees: string;
  revenue: string;
  status: string;
  searchType?: 'lexical' | 'semantic' | 'hybrid';
}

export interface FilterState {
  searchTerm: string;
  industry: string;
  companySize: string;
  location: string;
  foundingYear: string;
  tags: string[];
}

export interface SortOption {
  value: string;
  label: string;
}