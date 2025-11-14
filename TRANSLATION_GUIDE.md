# 🌍 Translation Pipeline Integration Guide

## Overview

This integration connects the GlobSEO backend translation pipeline with the frontend, enabling **real-time metadata translation** for multiple languages. The system translates **only SEO metadata fields** (title, description, keywords, etc.) and **never translates the actual website content**.

## ✨ Features

- ✅ Real-time metadata translation using Lingo.dev
- ✅ Support for 8+ languages (Spanish, French, German, Japanese, Chinese, Portuguese, Italian)
- ✅ SEO score generation for original content
- ✅ Metadata-only translation (preserves original content)
- ✅ Seamless frontend-backend integration
- ✅ Automatic fallback to original metadata if translation fails

## 🚀 Quick Start

### Prerequisites

1. Node.js and npm installed
2. Lingo.dev CLI configured (for translations)
3. Backend and frontend dependencies installed

### Running the Application

#### Terminal 1 - Backend
```bash
cd backend
node server.js
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### Using the Application

1. Open your browser to `http://localhost:5173` (or the port shown in terminal)
2. Enter a URL to analyze (e.g., `https://lingo.dev`)
3. Select target languages (e.g., Spanish, French, German)
4. Click "Analyze & Generate SEO"
5. View translated metadata for each language

## 📋 What Gets Translated

### ✅ Translated Fields
- **SEO Title** (`title`)
- **Meta Description** (`description`)
- **Keywords** (`keywords`)
- **H1 Heading** (`h1`)
- **Open Graph Title** (`ogTitle`)
- **Open Graph Description** (`ogDescription`)
- **Twitter Card Title** (`twitterTitle`)
- **Twitter Card Description** (`twitterDescription`)

### ❌ NOT Translated
- **Website Content** (`content`) - This is intentionally excluded
- **URLs** (`canonical`, `ogUrl`)
- **Image URLs** (`ogImage`, `twitterImage`)
- **Technical Fields** (`robots`, `lang`, `author`)

## 🔧 Architecture

### Frontend Flow
```
User Input → App.tsx → API Service → Backend
                ↓
         OutputPanel
                ↓
      LanguageResultsCard (per language)
```

### Backend Flow
```
API Request → Scraper → Lingo Translator → SEO Scorer → Response
```

### Data Structure

**Request:**
```json
{
  "url": "https://example.com",
  "languages": ["es", "fr", "de"],
  "primaryKeyword": "optional"
}
```

**Response:**
```json
{
  "success": true,
  "metadata": {
    "title": "Original Title",
    "description": "Original description",
    "keywords": "keyword1, keyword2"
  },
  "translations": {
    "es": {
      "meta": {
        "title": "Título Original",
        "description": "Descripción original",
        "keywords": "palabra1, palabra2"
      },
      "og": {
        "title": "Título Original",
        "description": "Descripción original"
      }
    },
    "fr": { /* ... */ }
  },
  "seoScore": {
    "total_score": 85,
    "scores": { /* ... */ }
  }
}
```

## 🧪 Testing

### Automated Test
```bash
./test-translation-integration.sh
```

### Manual API Test
```bash
curl -X POST http://localhost:3001/api/scrape-translate-score \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://lingo.dev",
    "languages": ["es", "fr"]
  }'
```

### Expected Behavior

1. **English Card**: Shows original scraped metadata
2. **Spanish Card**: Shows Spanish-translated metadata
3. **French Card**: Shows French-translated metadata
4. Each card displays:
   - Translated title
   - Translated description
   - Translated keywords
   - HTML meta tags
   - JSON output
   - Schema markup
   - Social card preview

## 🐛 Troubleshooting

### Issue: Translations not appearing

**Check:**
1. Backend server is running (`http://localhost:3001/api/health`)
2. Lingo.dev CLI is configured
3. Language codes are valid (es, fr, de, etc.)
4. Browser console for errors

**Solution:**
```bash
# Check backend logs
cd backend
node server.js

# Verify Lingo.dev
npx lingo.dev@latest --version
```

### Issue: "Translation failed" error

**Cause:** Lingo.dev CLI not configured or API limits reached

**Solution:**
1. Configure Lingo.dev API key
2. Check Lingo.dev quota
3. System will fall back to original metadata

### Issue: Frontend shows mock data

**Cause:** Translations prop not passed correctly

**Solution:**
1. Verify App.tsx passes `translations` to OutputPanel
2. Verify OutputPanel passes `translations` to LanguageResultsCard
3. Check browser console for TypeScript errors

## 📁 Files Modified

### Backend
- `backend/server.js` - Added `/api/scrape-translate-score` endpoint
- `backend/lingo-translate.js` - Updated metadata-only translation

### Frontend
- `frontend/src/services/api.ts` - Added translation types and API method
- `frontend/src/App.tsx` - Added translation state and logic
- `frontend/src/components/OutputPanel.tsx` - Pass translations to cards
- `frontend/src/components/LanguageResultsCard.tsx` - Display real translations

## 🎯 Key Implementation Details

### Language Code Mapping
```typescript
const LANGUAGE_CODE_MAP = {
  'English': 'en',
  'Spanish': 'es',
  'French': 'fr',
  'German': 'de',
  'Japanese': 'ja',
  'Chinese': 'zh',
  'Portuguese': 'pt',
  'Italian': 'it',
};
```

### Translation Retrieval Logic
```typescript
// For English: use original metadata
if (language === 'English') {
  return metadata.title;
}

// For others: use translations
if (translations[langCode]) {
  return translations[langCode].meta.title;
}

// Fallback to original
return metadata.title;
```

## 🔒 Security Notes

- URLs are validated before scraping
- Translation API calls are rate-limited
- No sensitive data is stored
- Translations timeout after 3 minutes

## 📊 Performance

- **Scraping**: ~1-3 seconds
- **Translation per language**: ~2-5 seconds
- **SEO Scoring**: ~0.5-1 second
- **Total (3 languages)**: ~8-15 seconds

## 🚧 Future Enhancements

1. **Progressive Translation**: Show results as they're translated
2. **Translation Caching**: Cache common pages to avoid re-translation
3. **Batch Processing**: Translate multiple URLs at once
4. **Custom Glossaries**: Domain-specific translation terms
5. **Translation Quality Scores**: Rate translation accuracy
6. **Multi-source Languages**: Support languages other than English as source

## 📝 API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/scrape` | POST | Scrape metadata only |
| `/api/translate` | POST | Translate existing metadata |
| `/api/seo-score` | POST | Generate SEO score |
| `/api/scrape-and-score` | POST | Scrape + score (no translation) |
| `/api/scrape-translate-score` | POST | **Complete pipeline** (scrape + translate + score) |
| `/api/languages` | GET | Get supported languages |

## 💡 Tips

1. **Use specific keywords**: Better SEO scores with focused keywords
2. **Select relevant languages**: Only translate for your target markets
3. **Review translations**: Always review AI-translated content
4. **Test metadata**: Use social media debuggers to test OG tags
5. **Monitor performance**: Keep track of translation times

## 📞 Support

For issues or questions:
1. Check console logs (browser and backend)
2. Verify all dependencies are installed
3. Test backend endpoint directly with curl
4. Review TRANSLATION_INTEGRATION.md for technical details

---

**Built with ❤️ using Lingo.dev for the Multilingual Hackathon**
