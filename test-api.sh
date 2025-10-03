#!/bin/bash

# Test API Integration Script for Comprehensive Search API
echo "🧪 Testing Comprehensive Search API..."
echo "======================================="

API_BASE_URL="http://localhost:8080"
SEARCH_ENDPOINT="/api/search/comprehensive"

# Test 1: Basic search without filters
echo ""
echo "📋 Test 1: Basic search (query: '*')"
echo "-------------------------------------"
curl --location "${API_BASE_URL}${SEARCH_ENDPOINT}" \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --data '{
    "query": "*",
    "facetFields": ["industry_s", "country_s", "locality_ss"],
    "page": 0,
    "pageSize": 5
  }' \
  --silent --show-error | jq -r '"Total Results: " + (.totalResults | tostring) + ", First Company: " + .documents[0].name_s'

echo ""

# Test 2: Search with query term
echo "📋 Test 2: Search with query (query: 'software')"
echo "------------------------------------------------"
curl --location "${API_BASE_URL}${SEARCH_ENDPOINT}" \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --data '{
    "query": "software",
    "facetFields": ["industry_s", "country_s", "locality_ss"],
    "page": 0,
    "pageSize": 5
  }' \
  --silent --show-error | jq -r '"Total Results: " + (.totalResults | tostring) + ", Companies: " + ([.documents[].name_s] | join(", "))'

echo ""

# Test 3: Search with filters
echo "📋 Test 3: Search with filters (industry + year)"
echo "-----------------------------------------------"
curl --location "${API_BASE_URL}${SEARCH_ENDPOINT}" \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --data '{
    "query": "software",
    "filters": {
      "industry": ["computer software"],
      "year_founded_d": {
        "from": 1970,
        "to": 2000
      }
    },
    "facetFields": ["industry_s", "country_s", "locality_ss"],
    "sortField": "year_founded_d",
    "sortDirection": "year_founded_d desc",
    "page": 0,
    "pageSize": 3
  }' \
  --silent --show-error | jq -r '"Filtered Results: " + (.totalResults | tostring) + " companies"'

echo ""

# Test 4: Health Check (if available)
echo "📋 Test 4: API Health Check"
echo "---------------------------"
HEALTH_STATUS=$(curl --location "${API_BASE_URL}/health" \
  --silent --write-out "%{http_code}" --output /dev/null)

if [ "$HEALTH_STATUS" = "200" ]; then
    echo "✅ API Health: OK (Status: $HEALTH_STATUS)"
else
    echo "⚠️  API Health endpoint not available (Status: $HEALTH_STATUS)"
fi

echo ""
echo "🏁 API Testing Complete!"
echo "========================"