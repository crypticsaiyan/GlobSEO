#!/usr/bin/env node

/**
 * Cache Utilities for Translation Optimization
 * Implements both in-memory and persistent file-based caching
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'translations.json');
const CACHE_EXPIRY_HOURS = 24; 

// In-memory cache
const memoryCache = new Map();

/**
 * Generate cache key from content and target languages
 * @param {Object} content - Content to translate
 * @param {string} sourceLang - Source language code
 * @param {Array<string>} targetLangs - Target language codes
 * @returns {string} - MD5 hash cache key
 */
export function getCacheKey(content, sourceLang, targetLangs) {
  const normalizedContent = JSON.stringify(content);
  const sortedTargets = [...targetLangs].sort().join(',');
  const cacheString = `${sourceLang}:${sortedTargets}:${normalizedContent}`;
  
  return crypto.createHash('md5').update(cacheString).digest('hex');
}

/**
 * Initialize cache directory and load persistent cache
 */
export function initializeCache() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  // Load persistent cache into memory
  if (fs.existsSync(CACHE_FILE)) {
    try {
      const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      let validEntries = 0;
      let expiredEntries = 0;

      for (const [key, entry] of Object.entries(cacheData)) {
        if (isCacheValid(entry)) {
          memoryCache.set(key, entry);
          validEntries++;
        } else {
          expiredEntries++;
        }
      }

      console.log(`Cache loaded: ${validEntries} valid entries, ${expiredEntries} expired`);
    } catch (error) {
      console.warn('Failed to load cache:', error.message);
    }
  }
}

/**
 * Check if cache entry is still valid
 * @param {Object} entry - Cache entry
 * @returns {boolean}
 */
function isCacheValid(entry) {
  if (!entry || !entry.timestamp) return false;
  
  const now = Date.now();
  const age = now - entry.timestamp;
  const maxAge = CACHE_EXPIRY_HOURS * 60 * 60 * 1000;
  
  return age < maxAge;
}

/**
 * Get translation from cache
 * @param {string} cacheKey - Cache key
 * @returns {Object|null} - Cached translations or null
 */
export function getCachedTranslation(cacheKey) {
  const entry = memoryCache.get(cacheKey);
  
  if (!entry) {
    return null;
  }

  if (!isCacheValid(entry)) {
    memoryCache.delete(cacheKey);
    return null;
  }

  console.log(`Cache HIT for key: ${cacheKey.substring(0, 8)}...`);
  return entry.translations;
}

/**
 * Store translation in cache
 * @param {string} cacheKey - Cache key
 * @param {Object} translations - Translations to cache
 * @param {Array<string>} targetLanguages - Target languages
 */
export function setCachedTranslation(cacheKey, translations, targetLanguages) {
  const entry = {
    translations,
    targetLanguages,
    timestamp: Date.now(),
    created: new Date().toISOString()
  };

  memoryCache.set(cacheKey, entry);
  console.log(`Cached translation for key: ${cacheKey.substring(0, 8)}...`);

  persistCache();
}

/**
 * Get missing languages that need translation
 * @param {Object} existingTranslations - Already translated languages
 * @param {Array<string>} requestedLanguages - Requested target languages
 * @returns {Array<string>} - Languages that need translation
 */
export function getMissingLanguages(existingTranslations, requestedLanguages) {
  if (!existingTranslations || Object.keys(existingTranslations).length === 0) {
    return requestedLanguages;
  }

  const missing = requestedLanguages.filter(lang => !existingTranslations[lang]);
  
  if (missing.length > 0) {
    console.log(`🔍 Missing languages: ${missing.join(', ')}`);
  } else {
    console.log(`✅ All languages already translated`);
  }

  return missing;
}

/**
 * Merge existing translations with new ones
 * @param {Object} existing - Existing translations
 * @param {Object} newTranslations - New translations to merge
 * @returns {Object} - Merged translations
 */
export function mergeTranslations(existing, newTranslations) {
  return {
    ...existing,
    ...newTranslations
  };
}

/**
 * Persist cache to disk
 */
function persistCache() {
  try {
    const cacheData = {};
    
    for (const [key, entry] of memoryCache.entries()) {
      if (isCacheValid(entry)) {
        cacheData[key] = entry;
      }
    }

    fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
  } catch (error) {
    console.warn('Failed to persist cache:', error.message);
  }
}

/**
 * Clear expired cache entries
 */
export function cleanupCache() {
  let removed = 0;
  
  for (const [key, entry] of memoryCache.entries()) {
    if (!isCacheValid(entry)) {
      memoryCache.delete(key);
      removed++;
    }
  }

  if (removed > 0) {
    console.log(`Cleaned up ${removed} expired cache entries`);
    persistCache();
  }
}

/**
 * Get cache statistics
 * @returns {Object} - Cache stats
 */
export function getCacheStats() {
  const stats = {
    totalEntries: memoryCache.size,
    validEntries: 0,
    expiredEntries: 0,
    cacheSize: 0
  };

  for (const entry of memoryCache.values()) {
    if (isCacheValid(entry)) {
      stats.validEntries++;
    } else {
      stats.expiredEntries++;
    }
  }

  try {
    if (fs.existsSync(CACHE_FILE)) {
      stats.cacheSize = fs.statSync(CACHE_FILE).size;
    }
  } catch (error) {
    // Ignore
  }

  return stats;
}

/**
 * Clear all cache
 */
export function clearCache() {
  memoryCache.clear();
  
  if (fs.existsSync(CACHE_FILE)) {
    fs.unlinkSync(CACHE_FILE);
  }

  console.log('Cache cleared');
}

// Initialize cache on module load
initializeCache();

// Cleanup expired entries every hour
setInterval(cleanupCache, 60 * 60 * 1000);
