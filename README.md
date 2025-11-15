# GlobSEO

GlobSEO analyzes website metadata, translates it to multiple languages, and provides SEO scoring to help optimize content for global audiences.

## Features

- **Metadata Extraction**: Scrapes title, description, keywords, Open Graph tags, and Twitter Card data from web pages
- **Multi-language Translation**: Translates metadata using Lingo.dev's translation service
- **SEO Analysis**: Generates detailed SEO scores and recommendations using Google Gemini AI
- **Caching System**: Optimizes performance by caching translation results
- **i18n Integration**: Can update frontend internationalization files with translated content
- **Web Interface**: Clean React-based UI for easy interaction

## Installation

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npm run install-browsers
   ```

4. Create a `.env` file with required API keys:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   LINGODOTDEV_API_KEY=your_lingodotdev_api_key_here
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. In a new terminal, start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

### Basic Workflow

1. Enter a website URL in the input field
2. Select target languages for translation
3. Click "Analyze" to start the process
4. View the results showing original metadata, translations, and SEO scores

### API Usage

The backend provides a REST API endpoint:

```bash
curl -X POST http://localhost:3001/api/scrape-translate-score \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "languages": ["es", "fr", "de"]
  }'
```

### Testing

Run the integration test script:

```bash
./test-translation-integration.sh
```

Run backend tests:

```bash
cd backend
npm test
```

## Configuration

Configuration is managed through `backend/config.json`:

- `defaultLanguages`: Default target languages for translation
- `supportedLanguages`: All available language codes
- `scraper.timeout`: Timeout for web scraping operations
- `translation.provider`: Translation service provider
- `output.updateI18n`: Whether to update frontend i18n files
- `metadata.fieldsToTranslate`: Which metadata fields to translate

Environment variables:
- `GEMINI_API_KEY`: Required for SEO analysis

## Technologies

- **Backend**: Node.js, Express.js, Playwright (scraping), Google Generative AI (SEO scoring)
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Radix UI
- **Translation**: Lingo.dev CLI for professional translations
- **Caching**: File-based caching system for translation results

## Project Structure

```bash
├── backend/           # Node.js API server
│   ├── server.js      # Main server file
│   ├── pipeline.js    # Translation pipeline logic
│   ├── utils/         # Utility modules
│   │   ├── scraper.js      # Web scraping
│   │   ├── lingo-translate.js  # Translation handling
│   │   └── seo-score.js       # SEO analysis
│   ├── tests/         # Backend tests
│   └── config.json    # Configuration
├── frontend/          # React application
│   ├── src/           # Source code
│   ├── i18n/          # Translation files
│   └── package.json   # Dependencies
└── test-translation-integration.sh  # Integration tests
```

## Development

### Running Locally

Both backend and frontend support hot reloading during development:

```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

### Adding New Languages

1. Add the language code to `supportedLanguages` in `backend/config.json`
2. The system will automatically handle translation for the new language

### Testing Changes

Use the provided test script to verify end-to-end functionality:

```bash
./test-translation-integration.sh
```

### Code Quality

Run linting on the frontend:

```bash
cd frontend
npm run lint
```

## License

ISC License
