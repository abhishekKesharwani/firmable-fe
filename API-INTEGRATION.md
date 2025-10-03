# Company Search Dashboard - Comprehensive API Integration

## Overview
This React application integrates with the comprehensive search API backend running on `http://localhost:8080`.

## API Integration Features

### 🔗 API Endpoint
- **Base URL**: `http://localhost:8080`
- **Search Endpoint**: `/api/search/comprehensive` (POST)
- **Health Check**: `/health`

### 📊 Search Request Format
The application sends POST requests with all parameters in the JSON body:

**URL:**
```
POST http://localhost:8080/api/search/comprehensive
```

**JSON Body (with filters):**
```json
{
    "query": "software",
    "filters": {
        "industry": [
            "computer software"
        ],
        "year_founded_d": {
            "from": 1972,
            "to": 2020
        }
    },
    "facetFields": [
        "industry_s",
        "country_s",
        "locality_ss"
    ],
    "sortField": "current_employee_estimate_l",
    "sortDirection": "year_founded_d desc",
    "page": 0,
    "pageSize": 25
}
```

**Minimal Request (no filters):**
```json
{
    "query": "*",
    "facetFields": [
        "industry_s",
        "country_s", 
        "locality_ss"
    ],
    "page": 0,
    "pageSize": 25
}
```

#### Parameters:
- `query`: Text search query in JSON body (default: "*")
- `filters`: Object containing filter criteria (optional, only included if filters are active)
  - `industry`: Array of industry names
  - `year_founded_d`: Object with `from` and `to` year range
  - `locality_ss`: Array of locations
  - `country_s`: Array of countries
- `facetFields`: Array of fields to return facet data for
- `sortField`: Field to sort by
- `sortDirection`: Sort direction with field name
- `page`: Page number (0-based)
- `pageSize`: Number of results per page (default: 25)

#### Request Format:
- **All in JSON Body**: All parameters including query are sent in the request body
- **No URL Parameters**: The API does not accept any URL query parameters
- **Conditional Filters**: The `filters` object is only included when actual filters are applied
- **Standard POST**: Clean POST request with comprehensive JSON payload

### � Response Format
The API returns a comprehensive response with:

```json
{
  "documents": [...],
  "totalResults": 123,
  "facets": {
    "country_s": {"united states": 50},
    "industry_s": {"computer software": 30},
    "locality_ss": {"san francisco": 10}
  },
  "pagination": {
    "currentPage": 0,
    "pageSize": 25,
    "totalPages": 5,
    "hasNext": true,
    "hasPrevious": false
  },
  "queryInfo": {
    "query": "software",
    "filters": {...},
    "sort": "current_employee_estimate_l year_founded_d desc",
    "executionTime": 22
  }
}
```

### 📄 Document Mapping
The application transforms API document objects to internal Company objects:

```typescript
interface Company {
  id: string;           // from doc.id
  name: string;         // from doc.name_s
  industry: string;     // from doc.industry_s
  size: string;         // from doc.size_range_s
  location: string;     // from doc.locality_ss[0]
  foundingYear: number; // from doc.year_founded_d
  website: string;      // from doc.domain_s
  description: string;  // generated or from available fields
  employees: string;    // from doc.current_employee_estimate_l
  // ... other fields
}
```

### 🎛️ Dynamic Filters
The application uses API facet data to populate filter options:
- Industries from `facets.industry_s`
- Locations from `facets.locality_ss`
- Countries from `facets.country_s`

## UI Features

### 🔧 Debug Mode
- Toggle debug panel with "Show Debug" button
- Shows current application state
- Displays raw API requests and responses
- Real-time API status monitoring

### 📊 Enhanced Status Display
- Connection status indicator
- API endpoint information
- Total results count
- Current page information
- Execution time tracking

## Testing the API Integration

### Browser Console Testing
Open the browser console for detailed logging:
- API request details
- Response parsing
- Error tracking
- Performance metrics

### Manual API Testing
Use the provided test script:
```bash
./test-api.sh
```

This tests both basic and filtered search requests.

## Development Setup

1. **Start the backend API server** on `http://localhost:8080`
2. **Ensure the comprehensive endpoint** `/api/search/comprehensive` accepts POST requests
3. **Start the frontend development server**:
   ```bash
   npm run dev
   ```
4. **Open browser** at `http://localhost:5173`
5. **Enable debug mode** to monitor API interactions

## API Requirements

The backend API should support:
- POST requests to `/api/search/comprehensive`
- JSON request body with comprehensive search format
- CORS headers for frontend domain
- Proper JSON response format matching the expected structure
- Faceted search capabilities
- Pagination support
- Complex filtering and sorting

## Error Handling

The application includes comprehensive error handling:
1. **Connection Monitoring**: Real-time API health checks
2. **Request Validation**: Proper request format validation
3. **Response Parsing**: Safe JSON parsing with fallbacks
4. **User Feedback**: Clear error messages and retry options
5. **Debug Information**: Detailed logging for troubleshooting

## Performance Features

- **Page Size**: 25 results per page (configurable)
- **Efficient Pagination**: 0-based page indexing
- **Smart Caching**: Component-level state management
- **Real-time Updates**: Immediate API calls on filter changes