# Firmable Frontend

A modern, responsive React application for searching and exploring company data. Built with TypeScript, Vite, and Tailwind CSS, featuring an advanced search interface with real-time filtering, sorting, and autosuggest capabilities.

## 🚀 Features

### Core Functionality
- **Advanced Company Search**: Comprehensive search with multiple filter options
- **Real-time Autosuggest**: Intelligent suggestions for companies, industries, and locations
- **Dynamic Filtering**: Filter by industry, location, company size, founding year, and tags
- **Flexible Sorting**: Sort results by founding year, industry, size, or location
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Built-in theme switching with system preference detection
- **Pagination**: Efficient browsing through large result sets

### User Interface
- **Flipkart-style Search**: Modern, intuitive search interface
- **Company Cards**: Rich company information display with tags and metadata
- **Dynamic Navigation**: Context-aware sidebar with faceted navigation
- **Mobile-First Design**: Progressive enhancement for all screen sizes
- **Loading States**: Elegant loading animations and error handling
- **API Health Monitoring**: Real-time API connection status

### Technical Features
- **TypeScript**: Full type safety and IntelliSense support
- **Modern React**: Built with React 19 and functional components
- **Vite Build System**: Fast development and optimized production builds
- **Tailwind CSS**: Utility-first styling with dark mode support
- **RESTful API Integration**: Comprehensive backend integration with proxy support
- **Error Boundaries**: Graceful error handling and recovery

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - UI library with hooks and context
- **TypeScript 5.8.3** - Static typing and enhanced developer experience
- **Vite 7.1.7** - Build tool and development server
- **Tailwind CSS 4.1.13** - Utility-first CSS framework
- **Lucide React 0.544.0** - Beautiful, customizable icons

### Development Tools
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Automatic CSS vendor prefixing

## 📁 Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── AutosuggestDropdown.tsx    # Smart search suggestions
│   ├── CompanyCard.tsx            # Company information display
│   ├── DynamicNavigation.tsx      # Sidebar with faceted navigation
│   ├── Header.tsx                 # Application header with theme toggle
│   ├── Pagination.tsx             # Result pagination controls
│   ├── SearchFilters.tsx          # Advanced filter interface
│   └── SortingControls.tsx        # Sort options and result count
├── contexts/                # React contexts
│   └── ThemeContext.tsx           # Theme management and persistence
├── services/                # API integration
│   └── api.ts                     # REST API client and data transformation
├── types.ts                 # TypeScript type definitions
├── utils.ts                 # Utility functions
├── App.tsx                  # Main application component
└── main.tsx                 # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Backend API server running on localhost:8080

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd firmable-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Backend Integration

The application expects a backend API server running on `localhost:8080`. The Vite development server is configured with a proxy to handle API requests:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

## 🏗️ Build and Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Code Quality
```bash
npm run lint
```

## 🔌 API Integration

### Endpoints

The application integrates with the following API endpoints:

- **POST /api/search/comprehensive** - Advanced company search
- **GET /api/autosuggest** - Search suggestions
- **GET /api/health** - API health check

### Search Request Structure
```typescript
interface ComprehensiveSearchRequest {
  query: string;                    // Search term or "*" for all
  filters?: {
    industry?: string[];            // Industry filters
    locality_ss?: string[];        // Location filters
    year_founded_d?: {             // Founding year range
      from?: number;
      to?: number;
    };
    company_size?: string[];        // Company size filters
    tags?: string[];               // Tag filters
  };
  facetFields: string[];           // Fields for faceted navigation
  sortField?: string;              // Sort field
  sortDirection?: string;          // Sort direction
  page: number;                    // Page number (0-based)
  pageSize: number;               // Results per page
}
```

### Response Format
```typescript
interface ComprehensiveApiResponse {
  documents: Company[];            // Array of company objects
  totalResults: number;           // Total number of results
  facets: {                       // Available filter options
    country_s?: { [key: string]: number };
    industry_s?: { [key: string]: number };
    locality_ss?: { [key: string]: number };
  };
  pagination: {                   // Pagination metadata
    currentPage: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  queryInfo: {                    // Query execution details
    query: string;
    filters: any;
    sort: string;
    executionTime: number;
  };
}
```

## 🎨 Component Architecture

### Main Components

#### App.tsx
The main application component that orchestrates all functionality:
- Search state management
- API integration
- Filter and sort coordination
- Responsive layout management

#### AutosuggestDropdown.tsx
Intelligent search suggestions with:
- Categorized suggestions (companies, industries, locations)
- Keyboard navigation support
- Highlighted search terms
- Type-specific icons

#### CompanyCard.tsx
Rich company information display featuring:
- Company metadata (industry, location, size, founding year)
- Interactive website links
- Tag display with overflow handling
- Responsive grid layout

#### DynamicNavigation.tsx
Context-aware sidebar navigation with:
- Faceted navigation based on search results
- Top industries and locations
- Quick filter controls
- Active filter summary

### State Management

The application uses React's built-in state management with:
- **useState** for component-level state
- **useEffect** for side effects and API calls
- **useContext** for theme management
- **useCallback** for optimized function memoization

### Theme System

Comprehensive dark/light theme support:
- System preference detection
- Manual theme switching
- Persistent theme storage
- CSS custom properties integration

## 🔧 Configuration

### Environment Variables

The application can be configured using environment variables:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=10000

# Feature Flags
VITE_ENABLE_DEBUG_MODE=false
VITE_ENABLE_ANALYTICS=false
```

### Build Configuration

Key configuration files:

- **vite.config.ts** - Vite build and development server settings
- **tsconfig.json** - TypeScript compiler configuration
- **tailwind.config.js** - Tailwind CSS customization
- **postcss.config.js** - PostCSS processing configuration

## 🐛 Error Handling

The application implements comprehensive error handling:

### API Errors
- Network timeout handling
- HTTP status code validation
- Graceful degradation for API failures
- User-friendly error messages

### Component Errors
- Error boundaries for React component crashes
- Loading state management
- Retry mechanisms for failed operations

### User Experience
- Progressive loading indicators
- Empty state handling
- Search result feedback
- API health status display

## 🚀 Performance Optimization

### Code Splitting
- Dynamic imports for non-critical components
- Route-based code splitting (when routing is added)
- Vendor chunk optimization

### API Optimization
- Request debouncing for autosuggest
- Response caching for repeated searches
- Pagination for large result sets
- Efficient data transformation

### Rendering Optimization
- React.memo for expensive components
- useCallback for stable function references
- useMemo for computed values
- Virtual scrolling for large lists (when needed)

## 🧪 Testing Strategy

### Testing Approach
- Unit tests for utility functions
- Component testing with React Testing Library
- Integration tests for API services
- E2E tests for critical user flows

### Recommended Testing Commands
```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Use ESLint configuration
- Maintain component documentation
- Write meaningful commit messages

### Pull Request Process
1. Update documentation for new features
2. Add tests for new functionality
3. Ensure all checks pass
4. Request review from maintainers

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### API Documentation
- See `API-INTEGRATION.md` for detailed API documentation
- See `CORS-SOLUTIONS.md` for CORS configuration details

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Frontend Development**: React/TypeScript implementation
- **UI/UX Design**: Responsive design and user experience
- **API Integration**: Backend service integration
- **DevOps**: Build and deployment automation

## 🔄 Version History

- **v0.0.0** - Initial development version
  - Core search functionality
  - Responsive design implementation
  - API integration
  - Theme system
  - Component architecture

---

For more information, please contact the development team or refer to the project documentation.