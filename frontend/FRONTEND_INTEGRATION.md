# Frontend Integration - SEO Quality Score

## What's Integrated

The SEO Quality Score Generator is now fully integrated into the GlobSEO frontend!

### New Components

1. **SEOScoreCard** (`src/components/SEOScoreCard.tsx`)
   - Displays total SEO score (0-100)
   - Shows grade (Excellent/Good/Fair/Needs Work) with emoji
   - Breakdown of 5 scoring dimensions with progress bars
   - Lists issues found
   - Displays actionable recommendations

2. **API Service** (`src/services/api.ts`)
   - `scrapeAndScore(url, primaryKeyword)` - Scrape + score in one call
   - `scrape(url)` - Metadata scraping only
   - `generateScore(params)` - Score existing metadata
   - `translate(url, languages)` - Scrape + translate
   - `getLanguages()` - Get supported languages
   - TypeScript interfaces for all data types

### Updated Components

1. **App.tsx**
   - Added state management for metadata and SEO score
   - Integrated API calls
   - Error handling
   - Display SEO score card and metadata side-by-side

2. **InputPanel.tsx**
   - Added URL input field
   - Added Primary Keyword field (optional)
   - Form submission handling
   - Removed unused textarea (will add translation later)
   - Updated button text to "Analyze & Generate SEO"

## Features

✅ **Real-time SEO Analysis**
- Enter any URL
- Optional primary keyword for better analysis
- Click "Analyze & Generate SEO" button
- Get instant results

✅ **Visual Score Display**
- Total score out of 100
- Color-coded grade (green/blue/yellow/red)
- 5 dimension breakdown with progress bars
- Issues list with red bullets
- Recommendations with green bullets

✅ **Metadata Display**
- Shows scraped metadata alongside SEO score
- Title, description, keywords, H1, language
- Easy to review what was analyzed

## How to Use

### 1. Start the Backend

```bash
cd backend
npm start
```

Server runs on: `http://localhost:3001`

### 2. Start the Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on: `http://localhost:5173` (or shown port)

### 3. Analyze a Website

1. Enter a URL (e.g., `https://lingo.dev`)
2. Optionally add a primary keyword (e.g., `translation`)
3. Click "Analyze & Generate SEO"
4. View results:
   - SEO Score Card (left side)
   - Scraped Metadata (right side)

## API Integration

The frontend connects to the backend via the API service:

```typescript
import { api } from './services/api';

// Scrape and score
const result = await api.scrapeAndScore('https://example.com', 'keyword');

// Access data
console.log(result.seoScore.total_score); // 88
console.log(result.metadata.title); // "Example Domain"
```

## Component Usage

### SEOScoreCard

```tsx
import { SEOScoreCard } from './components/SEOScoreCard';

<SEOScoreCard 
  analysis={seoScore} 
  isLoading={false} 
/>
```

**Props:**
- `analysis`: SEOAnalysis object or null
- `isLoading`: Optional boolean for loading state

### States

The component shows different states:
1. **Empty state**: When no analysis has been run
2. **Loading state**: Shows skeleton/pulse animation
3. **Results state**: Displays full analysis

## TypeScript Types

All types are defined in `src/services/api.ts`:

```typescript
interface SEOScores {
  title_quality: number;
  description_quality: number;
  keyword_optimization: number;
  content_alignment: number;
  technical_seo: number;
}

interface SEOAnalysis {
  scores: SEOScores;
  total_score: number;
  issues: string[];
  recommendations: string[];
}
```

## Color Coding

**Score Grades:**
- 90-100: 🌟 Excellent (Green)
- 75-89: ✅ Good (Blue)
- 60-74: ⚠️ Fair (Yellow)
- 0-59: ❌ Needs Work (Red)

**Progress Bars:**
- 18-20: Green
- 15-17: Blue
- 12-14: Yellow
- 0-11: Red

## Error Handling

The app handles errors gracefully:
- Network errors
- API errors
- Invalid URLs
- Missing backend server

Error messages are displayed in a red banner below the input panel.

## Next Steps

### Future Enhancements

1. **Translation Integration**
   - Add translation functionality
   - Show SEO scores for each translated version
   - Compare scores across languages

2. **Export Features**
   - Export results as JSON
   - Export as PDF report
   - Copy to clipboard

3. **Historical Tracking**
   - Save analysis history
   - Compare scores over time
   - Track improvements

4. **Batch Analysis**
   - Analyze multiple URLs
   - Compare competitor sites
   - Bulk export

5. **Advanced Features**
   - Custom scoring weights
   - Industry-specific analysis
   - A/B testing for metadata

## File Structure

```
frontend/src/
├── components/
│   ├── SEOScoreCard.tsx      # NEW - SEO score display
│   ├── InputPanel.tsx         # UPDATED - Form handling
│   ├── OutputPanel.tsx        # Existing
│   └── ...
├── services/
│   └── api.ts                 # NEW - API service layer
├── App.tsx                    # UPDATED - State & integration
└── ...
```

## Testing

### Test URLs

Good SEO:
```
https://lingo.dev
Keyword: translation management
Expected Score: 85-95
```

Poor SEO:
```
https://example.com
Keyword: example
Expected Score: 30-50
```

### Manual Testing

1. ✅ URL validation
2. ✅ Form submission
3. ✅ Loading states
4. ✅ Error handling
5. ✅ Score display
6. ✅ Metadata display
7. ✅ Responsive design

## Requirements

### Backend
- Node.js 18+
- Running on port 3001
- GEMINI_API_KEY configured
- All dependencies installed

### Frontend
- Node.js 18+
- Vite dev server
- All dependencies installed

## Troubleshooting

### "Failed to fetch"
- Make sure backend is running on `http://localhost:3001`
- Check CORS is enabled in backend
- Verify network connection

### "GEMINI_API_KEY not set"
- Add API key to `backend/.env`
- Restart backend server

### Scores show "N/A"
- Backend might be using fallback scoring
- Check Gemini API key is valid
- Check backend logs for errors

## Performance

**Typical Response Times:**
- Scraping: 2-3 seconds
- SEO Analysis: 3-5 seconds
- Total: 5-8 seconds

**Optimization Tips:**
- Results are real-time (no caching yet)
- Consider adding loading indicators
- May want to debounce rapid submissions

## Styling

The component uses the existing design system:
- Background: `#141414` to `#0f0f0f` gradient
- Accent: `#a3ff12` (lime green)
- Borders: `white/10` opacity
- Text: Various white opacities

All styles match the existing GlobSEO aesthetic.

## Success! 🎉

The SEO Quality Score Generator is now fully integrated and working in the frontend!

You can now:
✅ Analyze any website's SEO quality
✅ Get AI-powered recommendations
✅ See visual score breakdowns
✅ Review scraped metadata
✅ Get actionable insights

Try it out! 🚀
