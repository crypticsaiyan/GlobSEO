#!/usr/bin/env node

/**
 * Frontend Translation Script using Lingo.dev CLI
 * This script integrates with the frontend to translate scraped metadata
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getCacheKey,
  getCachedTranslation,
  setCachedTranslation,
  getMissingLanguages,
  mergeTranslations
} from './cache-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const FRONTEND_DIR = path.resolve(__dirname, '../frontend');
const I18N_DIR = path.join(FRONTEND_DIR, 'i18n');

/**
 * Initialize Lingo.dev CLI in the frontend directory
 * @param {string} sourceLang - Source language code
 * @param {Array<string>} targetLangs - Target language codes
 */
function initializeLingoConfig(sourceLang = 'en', targetLangs = ['es', 'fr']) {
  const i18nConfigPath = path.join(FRONTEND_DIR, 'i18n.json');
  
  // Create i18n.json if it doesn't exist
  if (!fs.existsSync(i18nConfigPath)) {
    const config = {
      "$schema": "https://lingo.dev/schema/i18n.json",
      "version": "1.10",
      "locale": {
        "source": sourceLang,
        "targets": targetLangs
      },
      "buckets": {
        "json": {
          "include": ["i18n/[locale].json"]
        }
      }
    };
    
    fs.writeFileSync(i18nConfigPath, JSON.stringify(config, null, 2));
    console.log(`✅ Created i18n.json configuration`);
  }
  
  // Ensure i18n directory exists
  if (!fs.existsSync(I18N_DIR)) {
    fs.mkdirSync(I18N_DIR, { recursive: true });
    console.log(`✅ Created i18n directory`);
  }
}

/**
 * Setup i18n.json configuration for Lingo.dev CLI
 * @param {string} sourceLang - Source language code
 * @param {Array<string>} targetLangs - Target language codes (ONLY these will be translated)
 */
function setupI18nConfig(sourceLang, targetLangs) {
  const i18nConfigPath = path.join(FRONTEND_DIR, 'i18n.json');
  
  // ALWAYS create fresh config with ONLY the requested languages
  // This prevents Lingo from translating all languages in the config
  const config = {
    "$schema": "https://lingo.dev/schema/i18n.json",
    "version": "1.10",
    "locale": {
      "source": sourceLang,
      "targets": targetLangs  // ONLY the languages requested by the user
    },
    "buckets": {
      "json": {
        "include": ["i18n/[locale].json"]
      }
    }
  };
  
  // Write the config (overwrites existing)
  fs.writeFileSync(i18nConfigPath, JSON.stringify(config, null, 2));
  console.log(`📝 Updated i18n.json with targets: ${targetLangs.join(', ')}`);
  
  return config;
}

/**
 * Translate content using lingo.dev CLI
 * @param {Object} content - Content to translate
 * @param {string} sourceLang - Source language code
 * @param {string} targetLang - Target language code
 * @returns {Promise<Object>} - Translated content
 */
async function translateWithLingo(content, sourceLang, targetLang) {
  try {
    // Ensure source locale file exists with content
    const sourceFile = path.join(I18N_DIR, `${sourceLang}.json`);
    
    // Read existing content or create new
    let existingContent = {};
    if (fs.existsSync(sourceFile)) {
      existingContent = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
    }
    
    // Merge new content with existing
    const mergedContent = {
      ...existingContent,
      ...content
    };
    
    // Write source file
    if (!fs.existsSync(I18N_DIR)) {
      fs.mkdirSync(I18N_DIR, { recursive: true });
    }
    fs.writeFileSync(sourceFile, JSON.stringify(mergedContent, null, 2));
    
    console.log(`🔄 Translating from ${sourceLang} to ${targetLang}...`);
    
    // Setup i18n.json config
    setupI18nConfig(sourceLang, [targetLang]);
    
    // Run Lingo.dev CLI
    try {
      execSync('npx lingo.dev@latest run', { 
        stdio: 'inherit',
        cwd: FRONTEND_DIR,
        env: { ...process.env }
      });

      // Read translated content
      const targetFile = path.join(I18N_DIR, `${targetLang}.json`);
      if (fs.existsSync(targetFile)) {
        const translated = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
        return translated;
      } else {
        throw new Error('Translation output file not found');
      }
    } catch (execError) {
      console.error(`❌ Lingo CLI command failed: ${execError.message}`);
      throw execError;
    }
  } catch (error) {
    console.error(`❌ Translation failed: ${error.message}`);
    throw error;
  }
}

/**
 * Process and translate metadata for frontend
 * OPTIMIZED: Uses caching and incremental translation
 * @param {Object} metadata - Scraped metadata
 * @param {Array<string>} targetLanguages - Target languages
 * @returns {Promise<Object>} - Translations object
 */
async function processMetadataTranslations(metadata, targetLanguages) {
  const translations = {};
  const sourceLang = metadata.lang || 'en';

  // Filter out source language from targets
  const actualTargets = targetLanguages.filter(lang => lang !== sourceLang);
  
  if (actualTargets.length === 0) {
    console.log('⏭️  No translations needed (all languages same as source)');
    return translations;
  }

  // Prepare ONLY metadata fields for translation - NOT content
  // This ensures website content is never translated, only SEO metadata
  const translationContent = {
    meta: {
      title: metadata.title || '',
      description: metadata.description || '',
      keywords: metadata.keywords || '',
      h1: metadata.h1 || '',
    },
    og: {
      title: metadata.ogTitle || metadata.title || '',
      description: metadata.ogDescription || metadata.description || '',
    },
    twitter: {
      title: metadata.twitterTitle || metadata.title || '',
      description: metadata.twitterDescription || metadata.description || '',
    }
  };

  // OPTIMIZATION 1: Check cache first
  const cacheKey = getCacheKey(translationContent, sourceLang, actualTargets);
  const cachedTranslations = getCachedTranslation(cacheKey);
  
  if (cachedTranslations) {
    console.log('🚀 Using cached translations - NO API calls needed!');
    return cachedTranslations;
  }

  // OPTIMIZATION 2: Check for partial translations (incremental)
  let partialCacheKey = null;
  let existingTranslations = {};
  
  // Try to find partial cache matches (same content, subset of languages)
  for (const subset of getLanguageSubsets(actualTargets)) {
    const subsetKey = getCacheKey(translationContent, sourceLang, subset);
    const subsetCache = getCachedTranslation(subsetKey);
    
    if (subsetCache) {
      existingTranslations = mergeTranslations(existingTranslations, subsetCache);
      console.log(`📦 Found partial cache for: ${subset.join(', ')}`);
    }
  }

  // Determine which languages still need translation
  const missingLanguages = getMissingLanguages(existingTranslations, actualTargets);
  
  if (missingLanguages.length === 0) {
    console.log('✅ All languages found in cache!');
    setCachedTranslation(cacheKey, existingTranslations, actualTargets);
    return existingTranslations;
  }

  console.log(`🔄 Need to translate ${missingLanguages.length}/${actualTargets.length} languages: ${missingLanguages.join(', ')}`);

  try {
    // Setup i18n.json config with ONLY missing languages
    console.log(`🔧 Setting up Lingo.dev config for languages: ${missingLanguages.join(', ')}`);
    setupI18nConfig(sourceLang, missingLanguages);

    // Write source file ONCE
    const sourceFile = path.join(I18N_DIR, `${sourceLang}.json`);
    if (!fs.existsSync(I18N_DIR)) {
      fs.mkdirSync(I18N_DIR, { recursive: true });
    }
    
    let existingContent = {};
    if (fs.existsSync(sourceFile)) {
      existingContent = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
    }
    
    const mergedContent = {
      ...existingContent,
      ...translationContent
    };
    
    fs.writeFileSync(sourceFile, JSON.stringify(mergedContent, null, 2));
    console.log(`📝 Wrote source content to ${sourceLang}.json`);

    // Run Lingo.dev CLI ONCE for all missing languages
    console.log(`🔄 Running Lingo.dev translation (this runs ONCE for ${missingLanguages.length} languages)...`);
    
    try {
      execSync('npx lingo.dev@latest run', {
        cwd: FRONTEND_DIR,
        stdio: 'inherit', // Show output in real-time
        env: { ...process.env }
      });
      
    } catch (execError) {
      console.error(`❌ Lingo CLI execution failed: ${execError.message}`);
      throw execError;
    }

    // Read all newly translated files
    const newTranslations = {};
    for (const targetLang of missingLanguages) {
      const targetFile = path.join(I18N_DIR, `${targetLang}.json`);
      
      if (fs.existsSync(targetFile)) {
        const translated = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
        newTranslations[targetLang] = translated;
        console.log(`✅ Translation to ${targetLang} completed`);
      } else {
        console.warn(`⚠️  Translation file for ${targetLang} not found`);
        newTranslations[targetLang] = {
          ...translationContent,
          _error: `Translation file not generated`
        };
      }
    }

    // Merge with existing translations
    const allTranslations = mergeTranslations(existingTranslations, newTranslations);

    // OPTIMIZATION 3: Cache the complete result
    setCachedTranslation(cacheKey, allTranslations, actualTargets);

    console.log(`✅ All translations complete (${missingLanguages.length} new, ${Object.keys(existingTranslations).length} cached)`);
    
    return allTranslations;
    
  } catch (error) {
    console.error(`❌ Translation process failed: ${error.message}`);
    // Return empty translations on error
    const errorTranslations = {};
    for (const targetLang of actualTargets) {
      errorTranslations[targetLang] = existingTranslations[targetLang] || {
        ...translationContent,
        _error: `Translation failed: ${error.message}`
      };
    }
    return errorTranslations;
  }
}

/**
 * Generate all subsets of language arrays for partial cache matching
 * @param {Array<string>} languages - Language codes
 * @returns {Array<Array<string>>} - All non-empty subsets
 */
function getLanguageSubsets(languages) {
  const subsets = [];
  const n = languages.length;
  
  // Generate all subsets except empty set and full set
  for (let i = 1; i < (1 << n) - 1; i++) {
    const subset = [];
    for (let j = 0; j < n; j++) {
      if (i & (1 << j)) {
        subset.push(languages[j]);
      }
    }
    subsets.push(subset);
  }
  
  return subsets;
}

/**
 * Update frontend i18n files with translations
 * @param {Object} translations - Translations object
 */
function updateI18nFiles(translations) {
  if (!fs.existsSync(I18N_DIR)) {
    fs.mkdirSync(I18N_DIR, { recursive: true });
  }

  for (const [lang, content] of Object.entries(translations)) {
    const i18nFile = path.join(I18N_DIR, `${lang}.json`);
    
    // Read existing i18n file if it exists
    let existingContent = {};
    if (fs.existsSync(i18nFile)) {
      existingContent = JSON.parse(fs.readFileSync(i18nFile, 'utf8'));
    }

    // Merge with existing content
    const updatedContent = {
      ...existingContent,
      metadata: content,
      _updated: new Date().toISOString()
    };

    fs.writeFileSync(i18nFile, JSON.stringify(updatedContent, null, 2));
    console.log(`💾 Updated ${lang}.json`);
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error('Usage: node lingo-translate.js <metadata-file.json> [target-languages...]');
    console.error('Example: node lingo-translate.js metadata.json es fr de');
    process.exit(1);
  }

  const metadataFile = args[0];
  const targetLanguages = args.slice(1).length > 0 ? args.slice(1) : ['es', 'fr'];

  if (!fs.existsSync(metadataFile)) {
    console.error(`❌ File not found: ${metadataFile}`);
    process.exit(1);
  }

  try {
    // Read metadata
    const metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
    console.log(`📖 Loaded metadata from ${metadataFile}`);

    // Process translations
    const translations = await processMetadataTranslations(
      metadata.original || metadata,
      targetLanguages
    );

    // Update i18n files
    updateI18nFiles(translations);

    // Save complete result
    const outputFile = path.join(__dirname, `translations-${Date.now()}.json`);
    fs.writeFileSync(outputFile, JSON.stringify({
      original: metadata,
      translations,
      timestamp: new Date().toISOString()
    }, null, 2));

    console.log(`\n✨ Translation complete!`);
    console.log(`📊 Results saved to: ${outputFile}`);
    console.log(`🌍 Updated languages: ${targetLanguages.join(', ')}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { translateWithLingo, processMetadataTranslations, updateI18nFiles };
