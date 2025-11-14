# SEO Quality Score Generator

AI-powered SEO quality analysis using Google's Gemini AI model.

## Overview

The SEO Quality Score Generator analyzes webpage metadata and content to provide:
- **Total SEO Score** (0-100) across 5 key dimensions
- **Detailed breakdown** of each scoring category
- **Specific issues** found in your SEO implementation
- **Actionable recommendations** to improve rankings and CTR

## Scoring Dimensions

Each dimension is scored from 0-20 points:

### 1. Title Quality (0-20)
- Optimal length: 30-60 characters
- Contains primary keyword
- Click-through rate potential
- No keyword stuffing
- Unique and descriptive

### 2. Description Quality (0-20)
- Optimal length: 70-160 characters
- Clear page summary
- Contains relevant keywords
- Engaging and natural language
- No spam/keyword stuffing

### 3. Keyword Optimization (0-20)
- Natural keyword placement in title/description
- Semantic/LSI keyword usage
- Keywords align with content
- No over-optimization

### 4. Content Alignment (0-20)
- Title matches actual page content
- Description accurately reflects content
- OG tags consistent with metadata
- H1/H2 alignment

### 5. Technical SEO Elements (0-20)
- Presence of Open Graph tags
- Canonical tag implementation
- Correct language usage
- Metadata completeness
- No major SEO violations

## API Endpoints

### 1. Generate SEO Score Only

```bash
POST /api/seo-score
```

**Request Body:**
```json
{
  "url": "https://example.com",
  "title": "Example Domain - A Perfect Example Website",
  "description": "This domain is for use in illustrative examples...",
  "keywords": "example, domain, documentation",
  "ogTags": {
    "og:title": "Example Domain",
    "og:description": "Example website",
    "og:type": "website"
  },
  "content": "Page content here...",
  "language": "en",
  "primaryKeyword": "example domain"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "scores": {
      "title_quality": 18,
      "description_quality": 16,
      "keyword_optimization": 17,
      "content_alignment": 19,
      "technical_seo": 18
    },
    "total_score": 88,
    "issues": [
      "Meta description could be more compelling",
      "Consider adding more LSI keywords"
    ],
    "recommendations": [
      "Add power words to improve CTR",
      "Optimize for featured snippets",
      "Include schema markup for better visibility"
    ]
  },
  "metadata": {
    "model": "gemini-1.5-flash",
    "timestamp": "2025-11-14T10:30:00.000Z",
    "url": "https://example.com"
  }
}
```

### 2. Scrape and Score (Combined)

```bash
POST /api/scrape-and-score
```

**Request Body:**
```json
{
  "url": "https://example.com",
  "primaryKeyword": "example domain"
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://example.com",
  "metadata": {
    "title": "Example Domain",
    "description": "Example description...",
    "keywords": "example, domain",
    // ... full metadata
  },
  "seoScore": {
    "scores": { /* ... */ },
    "total_score": 85,
    "issues": [ /* ... */ ],
    "recommendations": [ /* ... */ ]
  },
  "timestamp": "2025-11-14T10:30:00.000Z"
}
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key

### 3. Configure Environment

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and add your API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 4. Start the Server

```bash
npm start
# or for development with auto-reload
npm run dev
```

## Usage Examples

### Using cURL

**Scrape and Score:**
```bash
curl -X POST http://localhost:3001/api/scrape-and-score \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "primaryKeyword": "example"
  }'
```

**Score Only:**
```bash
curl -X POST http://localhost:3001/api/seo-score \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "title": "Example Domain",
    "description": "This is an example",
    "language": "en"
  }'
```

### Using JavaScript/TypeScript

```javascript
// Scrape and Score
const response = await fetch('http://localhost:3001/api/scrape-and-score', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://example.com',
    primaryKeyword: 'example'
  })
});

const { metadata, seoScore } = await response.json();
console.log('SEO Score:', seoScore.total_score);
console.log('Issues:', seoScore.issues);
console.log('Recommendations:', seoScore.recommendations);
```

### Using the Module Directly

```javascript
import { generateSEOScore } from './seo-score.js';

const result = await generateSEOScore({
  url: 'https://example.com',
  title: 'Example Domain - Perfect Example',
  description: 'This domain is for examples...',
  keywords: 'example, domain',
  ogTags: { 'og:title': 'Example' },
  content: 'Page content...',
  language: 'en',
  primaryKeyword: 'example'
});

console.log(result.analysis);
```

## CLI Testing

You can test the SEO score generator directly:

```bash
node seo-score.js
```

This will run a test analysis with sample data.

## Response Format

The API always returns a structured JSON response:

```typescript
interface SEOScoreResponse {
  success: boolean;
  analysis: {
    scores: {
      title_quality: number;        // 0-20
      description_quality: number;  // 0-20
      keyword_optimization: number; // 0-20
      content_alignment: number;    // 0-20
      technical_seo: number;        // 0-20
    };
    total_score: number;  // 0-100
    issues: string[];
    recommendations: string[];
  };
  metadata: {
    model: string;
    timestamp: string;
    url: string;
  };
}
```

## Error Handling

### Missing API Key

```json
{
  "success": false,
  "error": "Failed to generate SEO score",
  "message": "GEMINI_API_KEY environment variable is not set"
}
```

### Fallback Mode

If the AI service is unavailable, the system automatically falls back to a rule-based scoring system:

```json
{
  "success": false,
  "error": "AI service unavailable",
  "fallback": true,
  "analysis": {
    // Basic rule-based scoring
  }
}
```

## Best Practices

1. **Always provide URL** - Required for all requests
2. **Include primary keyword** - Helps AI evaluate keyword optimization
3. **Provide full content** - Better content analysis leads to more accurate scores
4. **Set correct language** - Ensures proper multilingual SEO evaluation
5. **Review recommendations** - AI provides actionable insights for improvement

## Performance

- **Average response time**: 2-5 seconds
- **Model used**: Gemini 1.5 Flash (optimized for speed)
- **Temperature**: 0.2 (consistent scoring)
- **Content limit**: First 2000 characters analyzed

## Limitations

- Content is truncated to 2000 characters for analysis
- Requires active internet connection for AI service
- API key rate limits apply based on your Google AI Studio plan
- Scores are AI-generated and may vary slightly between requests

## Troubleshooting

### "GEMINI_API_KEY environment variable is not set"
- Ensure `.env` file exists in backend directory
- Check that `GEMINI_API_KEY` is set correctly
- Restart the server after adding the key

### "Invalid response format from Gemini AI"
- Check your API key is valid
- Verify internet connection
- Review Google AI Studio quota/limits

### Low scores despite good SEO
- Ensure all metadata fields are populated
- Provide complete content for analysis
- Include primary keyword for better evaluation

## Integration with GlobSEO

The SEO Score feature integrates seamlessly with existing GlobSEO features:

1. **With Scraper**: Use `/api/scrape-and-score` for one-step analysis
2. **With Translations**: Score original and translated metadata separately
3. **With Dashboard**: Display scores in the frontend UI

## License

Part of the GlobSEO project.
