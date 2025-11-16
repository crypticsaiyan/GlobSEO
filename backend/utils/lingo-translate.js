#!/usr/bin/env node

/**
 * Frontend Translation Script using Lingo.dev CLI
 * This script integrates with the frontend to translate scraped metadata
 */

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import os from 'os';
import {
  getCacheKey,
  getCachedTranslation,
  setCachedTranslation,
  getMissingLanguages,
  mergeTranslations
} from './cache-utils.js';

import { log, colors } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const FRONTEND_DIR = path.resolve(__dirname, '../../frontend');
const I18N_DIR = path.join(FRONTEND_DIR, 'i18n');


/**
 * Setup i18n.json configuration for Lingo.dev CLI
 * @param {string} sourceLang - Source language code
 * @param {Array<string>} targetLangs - Target language codes (ONLY these will be translated)
 */
function setupI18nConfig(sourceLang, targetLangs) {
  const i18nConfigPath = path.join(FRONTEND_DIR, 'i18n.json');
  
  // ALWAYS create fresh config with ONLY the requested languages
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
  
  // Write the config (overwrites existing)
  fs.writeFileSync(i18nConfigPath, JSON.stringify(config, null, 2));
  log.info(`Updated i18n.json with targets: ${targetLangs.join(', ')}`);
  
  return config;
}

/**
 * Translate content using lingo.dev CLI
 * @param {Object} content - Content to translate
 * @param {string} sourceLang - Source language code
 * @param {string} targetLang - Target language code
 * @returns {Promise<Object>} - Translated content
 */
async function translateWithLingo(content, sourceLang, targetLang, lingoApiKey) {
  // Create a unique temporary directory for this translation request
  const tempDir = path.join(os.tmpdir(), `lingo-translate-${crypto.randomBytes(8).toString('hex')}`);
  const tempI18nDir = path.join(tempDir, 'i18n');

  try {
    // Ensure temp directory exists
    fs.mkdirSync(tempI18nDir, { recursive: true });

    // Copy the i18n.json config to temp directory
    const configPath = path.join(FRONTEND_DIR, 'i18n.json');
    if (fs.existsSync(configPath)) {
      fs.copyFileSync(configPath, path.join(tempDir, 'i18n.json'));
    }

    // Ensure source locale file exists with content
    const sourceFile = path.join(tempI18nDir, `${sourceLang}.json`);

    // Write source content to temp file
    fs.writeFileSync(sourceFile, JSON.stringify(content, null, 2));

    log.info(`Translating from ${sourceLang} to ${targetLang}...`);

    // Setup i18n.json config in temp directory
    const i18nConfigPath = path.join(tempDir, 'i18n.json');
    const config = {
      "$schema": "https://lingo.dev/schema/i18n.json",
      "version": "1.10",
      "locale": {
        "source": sourceLang,
        "targets": [targetLang]
      },
      "buckets": {
        "json": {
          "include": ["i18n/[locale].json"]
        }
      }
    };
    fs.writeFileSync(i18nConfigPath, JSON.stringify(config, null, 2));

    // Run Lingo.dev CLI in temp directory
    try {
      await new Promise((resolve, reject) => {
        exec('npx lingo.dev run', {
          stdio: 'inherit',
          cwd: tempDir,
          env: {
            ...process.env,
            LINGODOTDEV_API_KEY: lingoApiKey || process.env.LINGODOTDEV_API_KEY
          }
        }, (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else {
            resolve({ stdout, stderr });
          }
        });
      });

      // Read translated content
      const targetFile = path.join(tempI18nDir, `${targetLang}.json`);
      if (fs.existsSync(targetFile)) {
        const translated = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
        return translated;
      } else {
        throw new Error('Translation output file not found');
      }
    } catch (execError) {
      console.error(`[ERROR] Lingo CLI command failed: ${execError.message}`);

      // Check if this is an authentication error
      const fullError = `${execError.message} ${execError.stderr || ''}`;
      if (fullError.includes('Authentication failed') || fullError.includes('unauthorized')) {
        throw new Error('Invalid Lingo.dev API key. Please check your API key and try again.');
      }

      throw execError;
    }
  } catch (error) {
    console.error(`[ERROR] Translation failed: ${error.message}`);
    throw error;
  } finally {
    // Clean up temp directory
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch (cleanupError) {
      console.warn(`Failed to cleanup temp directory: ${cleanupError.message}`);
    }
  }
}

/**
 * Process and translate metadata for frontend
 * OPTIMIZED: Uses caching and incremental translation
 * @param {Object} metadata - Scraped metadata
 * @param {Array<string>} targetLanguages - Target languages
 * @returns {Promise<Object>} - Translations object
 */
async function processMetadataTranslations(metadata, targetLanguages, lingoApiKey) {
  const translations = {};
  const sourceLang = metadata.lang || 'en';

  // Filter out source language from targets
  const actualTargets = targetLanguages.filter(lang => lang !== sourceLang);
  
  if (actualTargets.length === 0) {
    log.info('No translations needed (all languages same as source)');
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

  // Include the source HOST (hostname only) in the translation content used for cache key
  let sourceHost = '';
  try {
    const raw = metadata.url || metadata.canonical || metadata.domain || '';
    if (raw) {
      // If raw looks like a full URL, parse hostname; otherwise use raw as-is
      try {
        const parsed = new URL(raw);
        sourceHost = parsed.hostname;
      } catch (e) {
        // Not a full URL, assume it's already a hostname/path; strip path if present
        sourceHost = raw.split('/')[0] || raw;
      }
    }
  } catch (e) {
    sourceHost = '';
  }

  if (!sourceHost) {
    sourceHost = 'unknown-host';
  }

  translationContent._sourceHost = sourceHost;

  // OPTIMIZATION 1: Check cache first
  const cacheKey = getCacheKey(translationContent, sourceLang, actualTargets);
  log.debug(`Cache key for ${sourceHost}: ${cacheKey.substring(0, 12)}...`);
  log.debug(`Translation content title: "${translationContent.meta.title?.substring(0, 50)}..."`);
  const cachedTranslations = await getCachedTranslation(cacheKey);

  if (cachedTranslations) {
    log.cache(`HIT for ${sourceHost} - found ${Object.keys(cachedTranslations).length} translations`);
    return cachedTranslations;
  }

  log.cache(`MISS for ${sourceHost} - will translate ${actualTargets.length} languages`);

  // OPTIMIZATION 2: Check for partial translations (incremental)
  let existingTranslations = {};
  
  // Try to find partial cache matches (same content, subset of languages)
  for (const subset of getLanguageSubsets(actualTargets)) {
    const subsetKey = getCacheKey(translationContent, sourceLang, subset);
    const subsetCache = await getCachedTranslation(subsetKey);
    
    if (subsetCache) {
      existingTranslations = mergeTranslations(existingTranslations, subsetCache);
      log.cache(`Found partial cache for: ${subset.join(', ')}`);
    }
  }

  // Determine which languages still need translation
  const missingLanguages = getMissingLanguages(existingTranslations, actualTargets);
  
  if (missingLanguages.length === 0) {
    log.success('All languages found in cache!');
    await setCachedTranslation(cacheKey, existingTranslations, actualTargets);
    return existingTranslations;
  }

  log.info(`Need to translate ${missingLanguages.length}/${actualTargets.length} languages: ${missingLanguages.join(', ')}`);

  try {
    // Create a unique temporary directory for this translation request
    const tempDir = path.join(os.tmpdir(), `lingo-translate-${crypto.randomBytes(8).toString('hex')}`);
    const tempI18nDir = path.join(tempDir, 'i18n');

    // Ensure temp directory exists
    fs.mkdirSync(tempI18nDir, { recursive: true });

    // Copy the i18n.json config to temp directory and modify for multiple languages
    const configPath = path.join(FRONTEND_DIR, 'i18n.json');
    let baseConfig = {
      "$schema": "https://lingo.dev/schema/i18n.json",
      "version": "1.10",
      "locale": {
        "source": sourceLang,
        "targets": missingLanguages
      },
      "buckets": {
        "json": {
          "include": ["i18n/[locale].json"]
        }
      }
    };

    if (fs.existsSync(configPath)) {
      try {
        baseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        // Update with our specific languages
        baseConfig.locale = {
          source: sourceLang,
          targets: missingLanguages
        };
      } catch (e) {
        // Use default config if parsing fails
      }
    }

    fs.writeFileSync(path.join(tempDir, 'i18n.json'), JSON.stringify(baseConfig, null, 2));

    // Write source file to temp directory
    const sourceFile = path.join(tempI18nDir, `${sourceLang}.json`);
    fs.writeFileSync(sourceFile, JSON.stringify(translationContent, null, 2));
    log.debug(`Wrote source content to temp directory`);

    // Run Lingo.dev CLI in temp directory for all missing languages at once
    log.info(`Running Lingo.dev translation (this runs ONCE for ${missingLanguages.length} languages)...`);

    try {
      await new Promise((resolve, reject) => {
        exec('npx lingo.dev run', {
          cwd: tempDir,
          stdio: 'inherit', // Show output in real-time
          env: {
            ...process.env,
            LINGODOTDEV_API_KEY: lingoApiKey || process.env.LINGODOTDEV_API_KEY
          }
        }, (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else {
            resolve({ stdout, stderr });
          }
        });
      });

      // Read all translated languages from temp directory
      const newTranslations = {};
      for (const lang of missingLanguages) {
        const targetFile = path.join(tempI18nDir, `${lang}.json`);
        if (fs.existsSync(targetFile)) {
          try {
            newTranslations[lang] = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
            log.success(`Translated to ${lang}`);
          } catch (parseError) {
            log.error(`Failed to parse translation for ${lang}: ${parseError.message}`);
          }
        } else {
          log.error(`Translation file not found for ${lang}`);
        }
      }

      // Merge with existing translations
      const allTranslations = mergeTranslations(existingTranslations, newTranslations);

      // OPTIMIZATION 3: Cache the complete result
      await setCachedTranslation(cacheKey, allTranslations, actualTargets);

      log.cache(`SET ${Object.keys(allTranslations).length} translations for ${sourceHost} (key: ${cacheKey.substring(0, 12)}...)`);
      log.success(`All translations complete (${missingLanguages.length} new, ${Object.keys(existingTranslations).length} cached)`);

      return allTranslations;

    } catch (execError) {
      console.error(`❌ Lingo CLI execution failed: ${execError.message}`);

      // Check if this is an authentication error
      const fullError = `${execError.message} ${execError.stderr || ''}`;
      if (fullError.includes('Authentication failed') || fullError.includes('unauthorized')) {
        throw new Error('Invalid Lingo.dev API key. Please check your API key and try again.');
      }

      throw execError;
    } finally {
      // Clean up temp directory
      try {
        if (fs.existsSync(tempDir)) {
          fs.rmSync(tempDir, { recursive: true, force: true });
        }
      } catch (cleanupError) {
        console.warn(`Failed to cleanup temp directory: ${cleanupError.message}`);
      }
    }

    log.success(`All translations complete (${missingLanguages.length} new, ${Object.keys(existingTranslations).length} cached)`);
    
    return allTranslations;
    
  } catch (error) {
    console.error(`[ERROR] Translation process failed: ${error.message}`);
    
    // Check both the main error message and stderr for authentication issues
    const fullError = `${error.message} ${error.stderr || ''} ${error.stdout || ''}`;
    
    // Provide specific error messages for API key issues
    let errorMessage = error.message;
    if (fullError.includes('Authentication failed') || 
        fullError.includes('unauthorized') || 
        fullError.includes('invalid') || 
        fullError.includes('authentication') || 
        fullError.includes('API key') ||
        fullError.includes('Command failed')) {
      errorMessage = 'Invalid Lingo.dev API key. Please check your API key and try again.';
      throw new Error(errorMessage);
    } else if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('rate')) {
      errorMessage = 'Lingo.dev API quota exceeded. Please check your account limits.';
      throw new Error(errorMessage);
    } else if (error.message?.includes('network') || error.message?.includes('timeout') || error.message?.includes('ECONNREFUSED')) {
      errorMessage = 'Network error while connecting to Lingo.dev. Please try again later.';
      throw new Error(errorMessage);
    }
    
    // For other errors, return error translations but don't throw
    // Return empty translations on error
    const errorTranslations = {};
    for (const targetLang of actualTargets) {
      errorTranslations[targetLang] = existingTranslations[targetLang] || {
        ...translationContent,
        _error: `Translation failed: ${errorMessage}`
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
    log.info(`Updated ${lang}.json`);
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
    console.error(`[ERROR] File not found: ${metadataFile}`);
    process.exit(1);
  }

  try {
    // Read metadata
    const metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
    log.info(`Loaded metadata from ${metadataFile}`);

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
    log.success(`Results saved to: ${outputFile}`);
    log.info(`Updated languages: ${targetLanguages.join(', ')}`);
  } catch (error) {
    console.error(`[ERROR] Error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { translateWithLingo, processMetadataTranslations, updateI18nFiles };
