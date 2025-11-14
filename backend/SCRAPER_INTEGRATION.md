# Scraper + SEO Score Integration Guide

## Overview

The scraper has been enhanced to integrate SEO quality scoring directly into the scraping process. You can now scrape metadata AND get an AI-powered SEO quality score in a single command!

## What's New

### Enhanced scraper.js Features

1. **Content Extraction** - Now extracts page content for AI analysis
2. **Integrated SEO Scoring** - Generate SEO scores during scraping
3. **Flexible Modes** - Choose between metadata-only or full SEO analysis
4. **Improved CLI** - Better command-line interface with options

### New Metadata Fields

The scraper now extracts additional fields:
- `content` - Main page content (first 2000 chars)
- `h2` - First H2 heading
- `language` - Detected page language

## Usage Modes

### Mode 1: Standard Metadata Scraping

Extract metadata only (original behavior):

```bash
node scraper.js https://example.com
```

**Output:**
```json
{
  "url": "https://example.com",
  "title": "Example Domain",
  "description": "...",
  "content": "...",
  // ... all metadata fields
}
```

**NPM Script:**
```bash
npm run scrape -- https://example.com
```

---

### Mode 2: Scrape + SEO Score

Scrape metadata AND generate SEO quality score:

```bash
node scraper.js https://example.com --score
# or shorthand:
node scraper.js https://example.com -s
```

**With Primary Keyword:**
```bash
node scraper.js https://example.com --score --keyword "example domain"
# or shorthand:
node scraper.js https://example.com -s -k "example domain"
```

**NPM Script:**
```bash
npm run scrape-score -- https://example.com
```

**Output Example:**
```
═══════════════════════════════════════════════════════
📊 SEO QUALITY SCORE REPORT
═══════════════════════════════════════════════════════

URL: https://example.com
Title: Example Domain
Description: This domain is for use in illustrative...

Scores:
────────────────────────────────────────────────────────
  Title Quality:        15/20 ███████████████
  Description Quality:  12/20 ████████████
  Keyword Optimization: 10/20 ██████████
  Content Alignment:    14/20 ██████████████
  Technical SEO:        13/20 █████████████
────────────────────────────────────────────────────────
  🎯 TOTAL SCORE:        64/100
  ⚠️  Grade: Fair

🔍 Issues:
  1. Meta description is missing
  2. No Open Graph tags found
  3. Consider adding more descriptive keywords

💡 Recommendations:
  1. Add a compelling meta description (70-160 chars)
  2. Implement Open Graph tags for social sharing
  3. Optimize title for click-through rate

═══════════════════════════════════════════════════════
⏱️  Completed in 4.2s

Full JSON output:
{
  "metadata": { ... },
  "seoScore": { ... },
  "timestamp": "2025-11-14T..."
}
```

## CLI Options Reference

```
Usage:
  node scraper.js <url> [options]

Options:
  --score, -s              Generate SEO quality score
  --keyword, -k <keyword>  Primary keyword for SEO analysis

Examples:
  node scraper.js https://example.com
  node scraper.js https://example.com --score
  node scraper.js https://example.com -s -k "example domain"
```

## Programmatic Usage

### Import and Use in Your Code

```javascript
import { scrapeMetadata, scrapeAndScore } from './scraper.js';

// Standard scraping
const metadata = await scrapeMetadata('https://example.com');
console.log(metadata.title);

// Scraping without content (faster)
const lightMetadata = await scrapeMetadata('https://example.com', { 
  includeContent: false 
});

// Scrape and score
const result = await scrapeAndScore('https://example.com', {
  primaryKeyword: 'example domain'
});
console.log(result.seoScore.total_score);
console.log(result.seoScore.recommendations);
```

## API Integration

The enhanced scraper is already integrated with the server API endpoints:

### 1. Scrape Only
```bash
POST /api/scrape
{
  "url": "https://example.com"
}
```

### 2. Scrape and Score (Combined)
```bash
POST /api/scrape-and-score
{
  "url": "https://example.com",
  "primaryKeyword": "example domain"  // optional
}
```

### 3. Score Only (Existing Metadata)
```bash
POST /api/seo-score
{
  "url": "https://example.com",
  "title": "...",
  "description": "...",
  // ... other metadata
}
```

## NPM Scripts

```bash
# Standard scraping
npm run scrape -- https://example.com

# Scrape with SEO score
npm run scrape-score -- https://example.com

# Test SEO scoring
npm run test-seo

# Start API server
npm start
```

## Real-World Examples

### Example 1: Analyze Your Blog Post

```bash
node scraper.js https://yourblog.com/seo-tips --score -k "SEO tips"
```

### Example 2: Quick Metadata Check

```bash
node scraper.js https://yoursite.com
```

### Example 3: Batch Analysis Script

```javascript
import { scrapeAndScore } from './scraper.js';

const urls = [
  'https://example1.com',
  'https://example2.com',
  'https://example3.com'
];

for (const url of urls) {
  const result = await scrapeAndScore(url);
  console.log(`${url}: ${result.seoScore.total_score}/100`);
}
```

## Performance Notes

- **Standard scrape**: ~2-3 seconds
- **Scrape + Score**: ~4-6 seconds (includes AI analysis)
- Content is limited to 2000 characters for optimal AI processing
- Scraping without content (`includeContent: false`) is faster

## SEO Score Components

When using `--score`, you get:

1. **5 Scoring Dimensions** (0-20 each):
   - Title Quality
   - Description Quality
   - Keyword Optimization
   - Content Alignment
   - Technical SEO

2. **Total Score** (0-100)

3. **Issues List** - Specific problems found

4. **Recommendations** - Actionable improvements

## Grade Interpretation

- **90-100**: 🌟 Excellent - Outstanding SEO
- **75-89**: ✅ Good - Minor improvements needed
- **60-74**: ⚠️ Fair - Several areas to improve
- **0-59**: ❌ Needs Work - Major improvements required

## Configuration

### Environment Variables

Create `.env` file:

```env
# Required for SEO scoring
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
PORT=3001
NODE_ENV=development
```

Get your API key from: https://makersuite.google.com/app/apikey

### Without API Key

If `GEMINI_API_KEY` is not set, the system will:
- Standard scraping: Works normally
- SEO scoring: Falls back to rule-based scoring

## Integration with Existing Features

### With Translation Pipeline

```javascript
import { scrapeAndScore } from './scraper.js';
import { processMetadataTranslations } from './lingo-translate.js';

// 1. Scrape and score original
const result = await scrapeAndScore('https://example.com');

// 2. Translate metadata
const translations = await processMetadataTranslations(
  result.metadata, 
  ['es', 'fr', 'de']
);

// 3. Score each translation
for (const [lang, translatedMeta] of Object.entries(translations)) {
  const score = await generateSEOScore({
    url: result.metadata.url,
    title: translatedMeta.title,
    description: translatedMeta.description,
    language: lang,
    // ... other fields
  });
  console.log(`${lang}: ${score.analysis.total_score}/100`);
}
```

### With Frontend

The scraper functions are used by the API endpoints that your frontend calls:

```typescript
// Frontend code
const response = await fetch('/api/scrape-and-score', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    url: 'https://example.com',
    primaryKeyword: 'example'
  })
});

const { metadata, seoScore } = await response.json();
```

## Troubleshooting

### "GEMINI_API_KEY environment variable is not set"

**Solution:**
1. Create `.env` file in backend directory
2. Add: `GEMINI_API_KEY=your_key_here`
3. Restart the scraper/server

### Slow Performance

**Causes:**
- Website is slow to load
- AI analysis takes time
- Network latency

**Solutions:**
- Use standard scraping mode (without `--score`) for faster results
- Check website response time
- Ensure stable internet connection

### Content Not Extracted

**Possible Issues:**
- Website uses client-side rendering
- Content is loaded via JavaScript after page load

**Solution:**
The scraper uses Playwright which handles most modern websites, but some sites may need longer wait times.

## Code Changes Summary

### scraper.js Modifications

1. ✅ Added content extraction function
2. ✅ Enhanced `scrapeMetadata()` with options parameter
3. ✅ Added new `scrapeAndScore()` function
4. ✅ Improved CLI with argument parsing
5. ✅ Added visual score reporting
6. ✅ Added help message

### New Exports

```javascript
export { scrapeMetadata, scrapeAndScore };
```

### Backward Compatibility

✅ Old code continues to work:
```javascript
// This still works exactly as before
const metadata = await scrapeMetadata('https://example.com');
```

## Next Steps

1. **Try it out**: `node scraper.js https://example.com --score`
2. **Get API key**: Visit https://makersuite.google.com/app/apikey
3. **Configure .env**: Add your `GEMINI_API_KEY`
4. **Test with real sites**: Analyze your own websites
5. **Integrate with frontend**: Use the API endpoints

## Related Documentation

- `SEO_SCORE_README.md` - Complete SEO scoring documentation
- `QUICKSTART_SEO.md` - Quick start guide
- `SEO_IMPLEMENTATION_SUMMARY.md` - Implementation overview
- `frontend-integration-example.tsx` - Frontend integration code

---

**Questions?** Check the documentation files or run `node scraper.js` for help!
