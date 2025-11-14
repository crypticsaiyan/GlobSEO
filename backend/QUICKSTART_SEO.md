# SEO Quality Score - Quick Start Guide

Get your SEO quality score in 3 easy steps!

## Step 1: Setup

### Install Dependencies
```bash
cd backend
npm install
```

### Get Your Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Configure Environment
```bash
# Create .env file
cp .env.example .env

# Edit .env and add your key
echo "GEMINI_API_KEY=your_actual_key_here" > .env
```

## Step 2: Start the Server

```bash
npm start
```

You should see:
```
✅ Server running on http://localhost:3001

📡 Available Endpoints:
   GET  http://localhost:3001/api/health
   GET  http://localhost:3001/api/languages
   POST http://localhost:3001/api/scrape
   POST http://localhost:3001/api/translate
   POST http://localhost:3001/api/seo-score
   POST http://localhost:3001/api/scrape-and-score
```

## Step 3: Test It Out!

### Option A: Run Test Suite
```bash
npm run test-seo
```

This will analyze 4 different test cases and show you how the scoring works.

### Option B: Analyze a Real Website

**Using cURL:**
```bash
curl -X POST http://localhost:3001/api/scrape-and-score \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://lingo.dev",
    "primaryKeyword": "translation management"
  }'
```

**Using the browser (Postman/Insomnia):**
1. Open your API testing tool
2. Create a POST request to: `http://localhost:3001/api/scrape-and-score`
3. Set Content-Type to `application/json`
4. Body:
```json
{
  "url": "https://lingo.dev",
  "primaryKeyword": "translation management"
}
```
5. Click Send!

### Option C: Use from JavaScript

```javascript
const response = await fetch('http://localhost:3001/api/scrape-and-score', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://lingo.dev',
    primaryKeyword: 'translation management'
  })
});

const result = await response.json();
console.log('SEO Score:', result.seoScore.total_score);
console.log('Issues:', result.seoScore.issues);
console.log('Recommendations:', result.seoScore.recommendations);
```

## Understanding the Results

You'll get a score breakdown like this:

```json
{
  "success": true,
  "seoScore": {
    "scores": {
      "title_quality": 18,         // 0-20 points
      "description_quality": 17,    // 0-20 points
      "keyword_optimization": 16,   // 0-20 points
      "content_alignment": 19,      // 0-20 points
      "technical_seo": 18           // 0-20 points
    },
    "total_score": 88,              // 0-100 total
    "issues": [
      "Specific problems found..."
    ],
    "recommendations": [
      "Actionable improvements..."
    ]
  }
}
```

### Score Interpretation
- **90-100**: 🌟 Excellent - Your SEO is top-notch!
- **75-89**: ✅ Good - Minor improvements will help
- **60-74**: ⚠️ Fair - Several areas need attention
- **0-59**: ❌ Needs Work - Focus on recommendations

## Two API Endpoints

### 1. Scrape + Score (Recommended)
Scrapes the website AND generates SEO score in one call.

```bash
POST /api/scrape-and-score
Body: { "url": "https://example.com", "primaryKeyword": "optional" }
```

### 2. Score Only
If you already have the metadata, just get the score.

```bash
POST /api/seo-score
Body: {
  "url": "https://example.com",
  "title": "Your Title",
  "description": "Your description",
  "keywords": "keyword1, keyword2",
  "content": "Page content...",
  "language": "en",
  "primaryKeyword": "main keyword"
}
```

## Troubleshooting

### "GEMINI_API_KEY environment variable is not set"
- Make sure you created `.env` file
- Check that the API key is correct
- Restart the server after adding the key

### Tests show "using fallback scoring"
- Your API key might not be set correctly
- Check internet connection
- Verify the key works at [Google AI Studio](https://makersuite.google.com/)

### Slow responses
- First request might take longer (AI model initialization)
- Typical response time: 2-5 seconds
- Large websites might take longer to scrape

## Next Steps

1. **Integrate with Frontend**: Display scores in your UI
2. **Batch Analysis**: Analyze multiple pages
3. **Track Progress**: Compare scores over time
4. **A/B Testing**: Test different titles/descriptions

## Need Help?

Check the full documentation: `SEO_SCORE_README.md`

## Example Output

```
📊 SEO Quality Scores:
────────────────────────────────────────────────────────────
   Title Quality:         18/20 ██████████████████
   Description Quality:   17/20 █████████████████
   Keyword Optimization:  16/20 ████████████████
   Content Alignment:     19/20 ███████████████████
   Technical SEO:         18/20 ██████████████████
────────────────────────────────────────────────────────────
   🎯 TOTAL SCORE:         88/100
   ✅ Grade: Good

🔍 Issues Found:
   1. Meta description could be more compelling
   2. Consider adding structured data

💡 Recommendations:
   1. Add power words to improve CTR
   2. Optimize for featured snippets
   3. Include schema markup for better visibility
```

Happy optimizing! 🚀
