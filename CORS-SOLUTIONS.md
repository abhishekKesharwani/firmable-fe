# CORS Solutions for Frontend-Backend Communication

## Problem
When your frontend (React app on `http://localhost:5175`) tries to make requests to your backend API (`http://localhost:8080`), browsers block these requests due to CORS (Cross-Origin Resource Sharing) policy because they're on different ports.

## ✅ Solution 1: Vite Proxy (Implemented)

**Status: ACTIVE** - This solution is now configured in your project.

### Configuration
In `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

### How it works:
- Frontend makes requests to `/api/search/comprehensive`
- Vite proxy forwards these to `http://localhost:8080/api/search/comprehensive`
- No CORS issues because browser thinks it's same-origin

### Benefits:
- ✅ No backend changes required
- ✅ Simple configuration
- ✅ Perfect for development
- ✅ Transparent to the frontend code

## 🔧 Solution 2: Backend CORS Headers (Alternative)

If you control the backend server, add these headers:

### Spring Boot (Java)
```java
@CrossOrigin(origins = "http://localhost:5175")
@RestController
public class SearchController {
    // your endpoints
}
```

### Express.js (Node.js)
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5175'
}));
```

### Manual Headers
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5175');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
```

## 🌐 Solution 3: Browser Extensions (Development Only)

**Not recommended for production**

- Install "CORS Unblock" or similar browser extension
- Enable for development only
- Remember to disable for normal browsing

## 📋 Testing CORS Fix

### 1. Check Network Tab
- Open browser DevTools → Network tab
- Make a search request
- Look for successful API calls to `/api/search/comprehensive`
- No more CORS preflight failures

### 2. Console Logs
```javascript
// Should see successful API logs like:
🔍 API Request Details:
  Method: POST
  URL: /api/search/comprehensive
  Request Body: {...}
📡 Response Status: 200 OK
```

### 3. Manual Test
```bash
# Test if proxy is working
curl http://localhost:5175/api/search/comprehensive \
  -H "Content-Type: application/json" \
  -d '{"query":"*","facetFields":["industry_s"],"page":0,"pageSize":5}'
```

## 🚀 Production Deployment

### Frontend Deployment
When deploying to production, you'll need to:
1. Update API_BASE_URL to your production API URL
2. Ensure production API server has proper CORS headers
3. Or deploy frontend and backend on same domain

### Example for Production
```typescript
// src/services/api.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api.example.com/api'  // Production API
  : '/api';  // Development proxy
```

## 🔍 Troubleshooting

### Common Issues:

1. **Proxy not working**
   - Restart Vite dev server after config changes
   - Check Vite config syntax
   - Ensure backend is running on port 8080

2. **404 errors on API calls**
   - Verify backend endpoint paths
   - Check API_BASE_URL configuration
   - Test backend directly with curl

3. **Still getting CORS errors**
   - Clear browser cache
   - Check if using correct port (5175)
   - Verify proxy configuration

### Debug Commands:
```bash
# Test backend directly
curl http://localhost:8080/api/search/comprehensive -H "Content-Type: application/json" -d '{"query":"*","facetFields":["industry_s"],"page":0,"pageSize":5}'

# Test through proxy
curl http://localhost:5175/api/search/comprehensive -H "Content-Type: application/json" -d '{"query":"*","facetFields":["industry_s"],"page":0,"pageSize":5}'
```

## 📚 Additional Resources

- [Vite Proxy Documentation](https://vitejs.dev/config/server-options.html#server-proxy)
- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Understanding CORS](https://web.dev/cross-origin-resource-sharing/)