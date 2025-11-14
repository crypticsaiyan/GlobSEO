#!/usr/bin/env node

import { scrapeMetadata } from './scraper.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Translates metadata using lingo.dev CLI
 * @param {Object} metadata - The metadata object to translate
 * @param {Array<string>} targetLanguages - Array of target language codes (e.g., ['es', 'fr', 'de'])
 * @returns {Promise<Object>} - Translated metadata for each language
 */
export async function translateMetadata(metadata, targetLanguages = ['es', 'fr']) {
  const translations = {};
  
  // Prepare text to translate (only translate user-facing content)
  const fieldsToTranslate = {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    ogTitle: metadata.ogTitle,
    ogDescription: metadata.ogDescription,
    twitterTitle: metadata.twitterTitle,
    twitterDescription: metadata.twitterDescription,
    h1: metadata.h1,
  };
  
  // Create temporary JSON file for translation
  const tempDir = path.join(process.cwd(), '.temp-translations');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const sourceFile = path.join(tempDir, 'source.json');
  fs.writeFileSync(sourceFile, JSON.stringify(fieldsToTranslate, null, 2));
  
  console.log('🌍 Starting translation process...');
  
  for (const lang of targetLanguages) {
    try {
      console.log(`📝 Translating to ${lang.toUpperCase()}...`);
      
      // Use lingo CLI to translate
      // Assuming lingo CLI is installed and configured
      const command = `lingo translate --source ${sourceFile} --target ${lang} --output ${tempDir}/translated-${lang}.json`;
      
      try {
        execSync(command, { stdio: 'pipe' });
        
        // Read the translated file
        const translatedFile = path.join(tempDir, `translated-${lang}.json`);
        if (fs.existsSync(translatedFile)) {
          const translatedContent = JSON.parse(fs.readFileSync(translatedFile, 'utf8'));
          
          // Merge translated content with original metadata
          translations[lang] = {
            ...metadata,
            ...translatedContent,
            lang: lang,
            originalLang: metadata.lang,
          };
          
          console.log(`✅ ${lang.toUpperCase()} translation complete`);
        }
      } catch (execError) {
        console.warn(`⚠️  Lingo CLI not available or failed for ${lang}, using fallback method`);
        
        // Fallback: Create a simple copy (you can integrate other translation services here)
        translations[lang] = {
          ...metadata,
          lang: lang,
          originalLang: metadata.lang,
          _note: 'Translation not available - using original content',
        };
      }
    } catch (error) {
      console.error(`❌ Failed to translate to ${lang}:`, error.message);
      translations[lang] = {
        error: error.message,
        lang: lang,
      };
    }
  }
  
  // Clean up temp files
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (cleanupError) {
    console.warn('Warning: Could not clean up temp files:', cleanupError.message);
  }
  
  return translations;
}

/**
 * Main function to scrape and translate metadata
 * @param {string} url - The URL to scrape
 * @param {Array<string>} targetLanguages - Array of target language codes
 * @returns {Promise<Object>} - Object containing original and translated metadata
 */
export async function scrapeAndTranslate(url, targetLanguages = ['es', 'fr']) {
  console.log(`🔍 Scraping metadata from: ${url}`);
  
  const metadata = await scrapeMetadata(url);
  console.log('✅ Metadata scraped successfully');
  
  const translations = await translateMetadata(metadata, targetLanguages);
  
  return {
    original: metadata,
    translations: translations,
    timestamp: new Date().toISOString(),
    targetLanguages: targetLanguages,
  };
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.argv[2];
  const languages = process.argv.slice(3);
  
  if (!url) {
    console.error('Usage: node translate-metadata.js <url> [language codes...]');
    console.error('Example: node translate-metadata.js https://example.com es fr de');
    process.exit(1);
  }
  
  const targetLanguages = languages.length > 0 ? languages : ['es', 'fr'];
  
  scrapeAndTranslate(url, targetLanguages)
    .then(result => {
      console.log('\n📊 Results:');
      console.log(JSON.stringify(result, null, 2));
      
      // Optionally save to file
      const outputFile = `metadata-${Date.now()}.json`;
      fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
      console.log(`\n💾 Saved to ${outputFile}`);
    })
    .catch(error => {
      console.error('❌ Error:', error.message);
      process.exit(1);
    });
}
