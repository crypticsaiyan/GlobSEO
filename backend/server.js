#!/usr/bin/env node

/**
 * GlobSEO Backend API Server
 * Express server that handles metadata scraping and translation requests
 */

import express from 'express';
import cors from 'cors';
import { scrapeMetadata } from './scraper.js';
import { processMetadataTranslations } from './lingo-translate.js';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Increase timeout for translation requests (default is 2 minutes)
app.use((req, res, next) => {
  // Set timeout to 3 minutes for API routes
  if (req.path.startsWith('/api/')) {
    req.setTimeout(180000); // 3 minutes
    res.setTimeout(180000); // 3 minutes
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GlobSEO API is running' });
});

/**
 * POST /api/scrape
 * Scrape metadata from a URL
 * 
 * Body: { url: string }
 * Returns: { metadata: Object }
 */
app.post('/api/scrape', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ 
        error: 'URL is required',
        message: 'Please provide a valid URL in the request body'
      });
    }

    console.log(`📍 Scraping: ${url}`);

    const metadata = await scrapeMetadata(url);

    res.json({
      success: true,
      url,
      metadata,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to scrape metadata',
      message: error.message
    });
  }
});

/**
 * POST /api/translate
 * Scrape and translate metadata
 * 
 * Body: { url: string, languages: string[] }
 * Returns: { original: Object, translations: Object }
 */
app.post('/api/translate', async (req, res) => {
  try {
    const { url, languages = ['es', 'fr'] } = req.body;

    if (!url) {
      return res.status(400).json({ 
        error: 'URL is required',
        message: 'Please provide a valid URL in the request body'
      });
    }

    if (!Array.isArray(languages) || languages.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid languages',
        message: 'Please provide an array of language codes (e.g., ["es", "fr"])'
      });
    }

    console.log(`🔍 Scraping and translating: ${url}`);
    console.log(`🌍 Target languages: ${languages.join(', ')}`);
    console.log(`⏱️  Request started at: ${new Date().toISOString()}`);

    // Step 1: Scrape metadata
    console.log('📥 Step 1: Scraping metadata...');
    const metadata = await scrapeMetadata(url);
    console.log('✅ Metadata scraped successfully');

    // Step 2: Translate metadata
    console.log('🔄 Step 2: Starting translations...');
    const startTime = Date.now();
    const translations = await processMetadataTranslations(metadata, languages);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ All translations complete in ${duration}s`);

    // Step 3: Save results
    const result = {
      success: true,
      url,
      original: metadata,
      translations,
      targetLanguages: languages,
      timestamp: new Date().toISOString()
    };

    // Save to output directory
    const outputDir = path.join(process.cwd(), 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFile = path.join(outputDir, `metadata-${timestamp}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
    console.log(`💾 Saved to: ${outputFile}`);

    res.json(result);

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to translate metadata',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * GET /api/languages
 * Get list of supported languages
 */
app.get('/api/languages', (req, res) => {
  res.json({
    supported: [
      { code: 'en', name: 'English', native: 'English' },
      { code: 'es', name: 'Spanish', native: 'Español' },
      { code: 'fr', name: 'French', native: 'Français' },
      { code: 'de', name: 'German', native: 'Deutsch' },
      { code: 'it', name: 'Italian', native: 'Italiano' },
      { code: 'pt', name: 'Portuguese', native: 'Português' },
      { code: 'ja', name: 'Japanese', native: '日本語' },
      { code: 'ko', name: 'Korean', native: '한국어' },
      { code: 'zh', name: 'Chinese', native: '中文' },
      { code: 'ar', name: 'Arabic', native: 'العربية' },
      { code: 'ru', name: 'Russian', native: 'Русский' },
      { code: 'nl', name: 'Dutch', native: 'Nederlands' },
      { code: 'pl', name: 'Polish', native: 'Polski' },
      { code: 'tr', name: 'Turkish', native: 'Türkçe' },
      { code: 'sv', name: 'Swedish', native: 'Svenska' },
      { code: 'da', name: 'Danish', native: 'Dansk' }
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║                                                        ║');
  console.log('║          🌍 GlobSEO Backend API Server                ║');
  console.log('║                                                        ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('');
  console.log('📡 Available Endpoints:');
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log(`   GET  http://localhost:${PORT}/api/languages`);
  console.log(`   POST http://localhost:${PORT}/api/scrape`);
  console.log(`   POST http://localhost:${PORT}/api/translate`);
  console.log('');
  console.log('📚 Documentation: README.md');
  console.log('');
});

export default app;
