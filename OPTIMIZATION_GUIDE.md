# Translation Optimization Guide

## Overview

GlobSEO has been optimized to significantly reduce requests to the Lingo translation server while maintaining full functionality. This document explains the optimizations implemented and how they work.

## Optimizations Implemented

### 1. **Translation Caching** 🚀
**Impact: Highest - Can reduce API calls to ZERO for repeated content**

- **Memory Cache**: Fast in-memory cache using MD5 hash keys
- **Persistent Cache**: Disk-based cache that survives server restarts
- **Cache Expiry**: 24-hour automatic expiration
- **Cache Key**: Generated from content + source language + target languages

**How it works:**
```javascript
// First request: Translates and caches
await api.scrapeTranslateScore(url, ['es', 'fr', 'de']);
// ➜ Makes API call to Lingo, caches result

// Second request with same content/languages: Uses cache
await api.scrapeTranslateScore(url, ['es', 'fr', 'de']);
// ➜ NO API call - returns cached result instantly
```

**Cache Location**: `/backend/.cache/translations.json`

### 2. **Incremental Translation** 📈
**Impact: High - Only translates missing languages**

Instead of re-translating all languages, the system now:
- Checks which languages are already translated
- Only requests translations for missing languages
- Merges new translations with cached ones

**Example:**
```javascript
// First request
await api.scrapeTranslateScore(url, ['es', 'fr']);
// ➜ Translates to Spanish and French

// Second request adds German
await api.scrapeTranslateScore(url, ['es', 'fr', 'de']);
// ➜ Only translates to German (reuses Spanish/French from cache)
```

### 3. **Single Batch Translation** ✅
**Already Implemented - Maintained**

The Lingo CLI runs **once** for all target languages instead of once per language.

**Before:** 3 languages = 3 API calls
**Now:** 3 languages = 1 API call

### 4. **Rate Limiting** 🛡️
**Impact: Prevents abuse and server overload**

Two levels of rate limiting:

#### General API Rate Limit
- **Limit**: 10 requests per minute per IP
- **Applies to**: All `/api/*` endpoints
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

#### Strict Translation Rate Limit
- **Limit**: 3 translation requests per 5 minutes per IP
- **Applies to**: `/api/translate`, `/api/scrape-translate-score`
- **Response**: 429 Too Many Requests with retry-after time

### 5. **Request Throttling (Frontend)** ⏱️
**Impact: Prevents accidental rapid-fire requests**

- **Throttle Time**: 3 seconds
- **Implementation**: `useThrottle` hook
- **Behavior**: Ignores rapid clicks on Generate button
- **User Feedback**: Console message when throttled

## Cache Management

### Cache Statistics
```bash
curl http://localhost:3001/api/cache/stats
```

Response:
```json
{
  "success": true,
  "stats": {
    "totalEntries": 15,
    "validEntries": 12,
    "expiredEntries": 3,
    "cacheSize": 45678,
    "cacheSizeFormatted": "44.61 KB",
    "expiryHours": 24
  }
}
```

### Clear Cache
```bash
curl -X DELETE http://localhost:3001/api/cache
```

### Automatic Cleanup
- Expired entries cleaned every hour
- Old rate limit records cleaned every 10 minutes

## Performance Improvements

### Before Optimization
- **Same content, 3 languages**: 1 API call
- **Same content again**: 1 API call (duplicate)
- **Add 1 language**: 1 API call (re-translates all)
- **Total for above scenario**: 3 API calls

### After Optimization
- **Same content, 3 languages**: 1 API call → cached
- **Same content again**: 0 API calls (cache hit)
- **Add 1 language**: 1 API call (only new language)
- **Total for above scenario**: 2 API calls (33% reduction)

### Real-World Example
Testing the same URL multiple times with different language combinations:

| Scenario | Before | After | Savings |
|----------|--------|-------|---------|
| Same URL, same languages (5x) | 5 calls | 1 call | 80% |
| Same URL, adding languages incrementally | 5 calls | 3 calls | 40% |
| Different URLs | 5 calls | 5 calls | 0% |

## Best Practices for Users

### To Maximize Cache Efficiency:
1. **Use consistent language selections** when analyzing similar content
2. **Batch similar URLs** together
3. **Don't clear cache** unless necessary

### To Avoid Rate Limiting:
1. **Wait 3+ seconds** between requests
2. **Don't spam the Generate button**
3. **For bulk operations**, space them out over 5+ minutes

## Developer Notes

### Cache File Format
```json
{
  "a3f5c8d9e1b2...": {
    "translations": {
      "es": { "meta": {...}, "og": {...}, "twitter": {...} },
      "fr": { "meta": {...}, "og": {...}, "twitter": {...} }
    },
    "targetLanguages": ["es", "fr"],
    "timestamp": 1700000000000,
    "created": "2025-11-15T10:30:00.000Z"
  }
}
```

### Extending Cache Expiry
Edit `backend/cache-utils.js`:
```javascript
const CACHE_EXPIRY_HOURS = 48; // Change from 24 to 48
```

### Adjusting Rate Limits
Edit `backend/rate-limiter.js`:
```javascript
// General rate limit
const MAX_REQUESTS = 20; // Change from 10

// Strict rate limit
const STRICT_MAX = 5; // Change from 3
const STRICT_WINDOW = 10 * 60 * 1000; // Change from 5 min
```

### Disabling Throttling (Development)
Edit `frontend/src/App.tsx`:
```typescript
// Change throttle time to 0 (disabled)
const handleGenerate = useThrottle(performGenerate, 0);
```

## Monitoring

### Backend Logs
Watch for these optimization indicators:
```
✨ Cache HIT for key: a3f5c8d9...    # Cache was used
🚀 Using cached translations           # Full cache hit
📦 Found partial cache for: es, fr    # Partial cache hit
🔄 Need to translate 1/3 languages    # Incremental translation
```

### Frontend Console
```
⏳ Request throttled - please wait    # Throttle active
```

## Troubleshooting

### Cache Not Working
1. Check if `.cache` directory exists in backend
2. Check file permissions
3. Clear cache and restart server

### Rate Limit Too Aggressive
1. Check `X-RateLimit-*` headers in response
2. Adjust limits in `rate-limiter.js`
3. Consider implementing user authentication for higher limits

### Throttle Too Slow
1. Reduce throttle time in `App.tsx`
2. Remove throttling entirely for development

## Future Enhancements

Potential optimizations for future versions:

1. **Redis Cache**: Replace file cache with Redis for better performance
2. **Cache Warming**: Pre-translate common URLs/languages
3. **Smart Cache Invalidation**: Detect when source content changes
4. **User-based Rate Limits**: Higher limits for authenticated users
5. **Batch API**: Process multiple URLs in one request
6. **WebSocket Updates**: Real-time progress for long translations
7. **CDN Caching**: Cache translation results at CDN level

## Summary

These optimizations work together to provide:
- **Faster responses** through caching
- **Lower costs** by reducing API calls
- **Better UX** through throttling
- **Server protection** through rate limiting
- **Smart resource usage** through incremental translation

The system now intelligently reuses work, preventing unnecessary API calls while maintaining full functionality.
