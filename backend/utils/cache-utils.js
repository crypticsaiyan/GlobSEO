#!/usr/bin/env node

/**
 * Production Cache Utilities for Translation Optimization
 * Uses Redis for high-performance, scalable caching
 */

import crypto from 'crypto';
import { createClient } from 'redis';

// Redis configuration
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const CACHE_EXPIRY_SECONDS = parseInt(process.env.CACHE_EXPIRY_SECONDS) || (24 * 60 * 60); // 24 hours default
const CACHE_KEY_PREFIX = 'globseo:translation:';

// Redis client
let redisClient = null;
let useInMemoryFallback = false;
const memoryCache = new Map(); // Fallback in-memory cache

/**
 * Initialize Redis connection
 */
async function initializeRedis() {
  if (redisClient && !useInMemoryFallback) return redisClient;

  if (useInMemoryFallback) {
    return null;
  }

  // For development/testing, check if Redis environment variable is set
  if (!process.env.REDIS_URL || process.env.REDIS_URL === 'redis://localhost:6379') {
    // Try a quick connection test
    try {
      const testClient = createClient({
        url: REDIS_URL,
        socket: { connectTimeout: 1000 }
      });

      await Promise.race([
        testClient.connect(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Connection timeout')), 1000)
        )
      ]);

      await testClient.quit();
      console.log('Redis is available, using Redis cache');
    } catch (error) {
      console.log('Redis not available, using in-memory cache fallback');
      useInMemoryFallback = true;
      return null;
    }
  }

  try {
    redisClient = createClient({
      url: REDIS_URL,
      socket: {
        connectTimeout: 5000,
        lazyConnect: true,
      }
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err.message);
    });

    redisClient.on('connect', () => {
      console.log('Connected to Redis');
    });

    redisClient.on('ready', () => {
      console.log('Redis client ready');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('Failed to initialize Redis:', error.message);
    console.warn('Falling back to in-memory cache');
    useInMemoryFallback = true;
    return null;
  }
}

/**
 * Generate cache key from content and target languages
 * @param {Object} content - Content to translate
 * @param {string} sourceLang - Source language code
 * @param {Array<string>} targetLangs - Target language codes
 * @returns {string} - Redis cache key
 */
export function getCacheKey(content, sourceLang, targetLangs) {
  const normalizedContent = JSON.stringify(content);
  const sortedTargets = [...targetLangs].sort().join(',');
  const cacheString = `${sourceLang}:${sortedTargets}:${normalizedContent}`;

  const hash = crypto.createHash('md5').update(cacheString).digest('hex');
  console.log(`🔑 Cache key generated: ${hash.substring(0, 12)}... for host: ${content._sourceHost || 'unknown'}`);
  return hash;
}

/**
 * Get full Redis key with prefix
 * @param {string} cacheKey - MD5 cache key
 * @returns {string} - Full Redis key
 */
function getRedisKey(cacheKey) {
  return `${CACHE_KEY_PREFIX}${cacheKey}`;
}

/**
 * Check if cache entry is still valid (for in-memory fallback)
 * @param {Object} entry - Cache entry
 * @returns {boolean}
 */
function isCacheValid(entry) {
  if (!entry || !entry.timestamp) return false;

  const now = Date.now();
  const age = now - entry.timestamp;
  const maxAge = CACHE_EXPIRY_SECONDS * 1000;

  return age < maxAge;
}

/**
 * Get translation from cache
 * @param {string} cacheKey - Cache key
 * @returns {Object|null} - Cached translations or null
 */
export async function getCachedTranslation(cacheKey) {
  const client = await initializeRedis();

  if (!client || useInMemoryFallback) {
    // Use in-memory fallback
    const entry = memoryCache.get(cacheKey);
    if (!entry) return null;

    if (!isCacheValid(entry)) {
      memoryCache.delete(cacheKey);
      return null;
    }

    console.log(`Cache HIT (memory) for key: ${cacheKey.substring(0, 8)}...`);
    return entry.translations;
  }

  try {
    const redisKey = getRedisKey(cacheKey);
    const cachedData = await client.get(redisKey);

    if (!cachedData) {
      return null;
    }

    const entry = JSON.parse(cachedData);

    // Check if entry has expired (double-check in case Redis TTL failed)
    if (entry.timestamp && (Date.now() - entry.timestamp) > (CACHE_EXPIRY_SECONDS * 1000)) {
      await client.del(redisKey);
      return null;
    }

    console.log(`Cache HIT (redis) for key: ${cacheKey.substring(0, 8)}...`);
    return entry.translations;
  } catch (error) {
    console.error('Error getting cached translation:', error.message);
    return null;
  }
}

/**
 * Store translation in cache
 * @param {string} cacheKey - Cache key
 * @param {Object} translations - Translations to cache
 * @param {Array<string>} targetLanguages - Target languages
 */
export async function setCachedTranslation(cacheKey, translations, targetLanguages) {
  const client = await initializeRedis();

  if (!client || useInMemoryFallback) {
    // Use in-memory fallback
    const entry = {
      translations,
      targetLanguages,
      timestamp: Date.now(),
      created: new Date().toISOString()
    };
    memoryCache.set(cacheKey, entry);
    console.log(`Cached translation (memory) for key: ${cacheKey.substring(0, 8)}...`);
    return;
  }

  try {
    const entry = {
      translations,
      targetLanguages,
      timestamp: Date.now(),
      created: new Date().toISOString()
    };

    const redisKey = getRedisKey(cacheKey);
    await client.setEx(redisKey, CACHE_EXPIRY_SECONDS, JSON.stringify(entry));

    console.log(`Cached translation (redis) for key: ${cacheKey.substring(0, 8)}...`);
  } catch (error) {
    console.error('Error setting cached translation:', error.message);
  }
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
 * Clear expired cache entries (Redis handles TTL automatically, but this can be used for manual cleanup)
 */
export async function cleanupCache() {
  try {
    const client = await initializeRedis();
    if (!client) return;

    // Redis handles TTL automatically, but we can scan for expired entries if needed
    // For now, just log that cleanup is handled by Redis TTL
    console.log('Cache cleanup handled automatically by Redis TTL');
  } catch (error) {
    console.error('Error during cache cleanup:', error.message);
  }
}

/**
 * Get cache statistics
 * @returns {Object} - Cache stats
 */
export async function getCacheStats() {
  try {
    const client = await initializeRedis();

    if (!client || useInMemoryFallback) {
      // In-memory stats
      return {
        totalEntries: memoryCache.size,
        validEntries: [...memoryCache.values()].filter(entry => isCacheValid(entry)).length,
        expiredEntries: [...memoryCache.values()].filter(entry => !isCacheValid(entry)).length,
        cacheSize: 'N/A (in-memory)',
        redisConnected: false,
        cacheType: 'in-memory'
      };
    }

    // Redis stats
    const keys = await client.keys(`${CACHE_KEY_PREFIX}*`);
    const totalEntries = keys.length;

    const info = await client.info('memory');
    const memoryUsage = parseInt(info.match(/used_memory:(\d+)/)?.[1] || 0);

    return {
      totalEntries,
      validEntries: totalEntries, // Redis handles expiry
      expiredEntries: 0, // Redis handles expiry
      cacheSize: `${(memoryUsage / 1024 / 1024).toFixed(2)} MB`,
      redisConnected: true,
      cacheType: 'redis',
      redisUrl: REDIS_URL
    };
  } catch (error) {
    console.error('Error getting cache stats:', error.message);
    return {
      totalEntries: 0,
      validEntries: 0,
      expiredEntries: 0,
      cacheSize: 0,
      redisConnected: false,
      cacheType: 'error',
      error: error.message
    };
  }
}

/**
 * Clear all cache
 */
export async function clearCache() {
  try {
    const client = await initializeRedis();

    if (!client || useInMemoryFallback) {
      // Clear in-memory cache
      memoryCache.clear();
      console.log(`Cleared ${memoryCache.size} entries from in-memory cache`);
      return;
    }

    // Clear Redis cache
    const keys = await client.keys(`${CACHE_KEY_PREFIX}*`);
    if (keys.length > 0) {
      await client.del(keys);
      console.log(`Cleared ${keys.length} entries from Redis cache`);
    } else {
      console.log('Redis cache already empty');
    }
  } catch (error) {
    console.error('Error clearing cache:', error.message);
  }
}

/**
 * Health check for Redis connection
 * @returns {boolean} - True if Redis is connected and healthy
 */
export async function isRedisHealthy() {
  try {
    const client = await initializeRedis();
    if (!client) return false;

    await client.ping();
    return true;
  } catch (error) {
    console.error('Redis health check failed:', error.message);
    return false;
  }
}

// Initialize Redis connection on module load (async)
initializeRedis().catch(error => {
  console.error('Failed to initialize Redis on module load:', error.message);
});
