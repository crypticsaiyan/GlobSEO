import { chromium } from "playwright";
import * as cheerio from "cheerio";
import { generateSEOScore } from './seo-score.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Extract readable content from the page
 * @param {Object} $ - Cheerio instance
 * @returns {string} - Extracted content
 */
function extractContent($) {
  // Remove script, style, and other non-content elements
  $('script, style, nav, footer, aside, iframe, noscript').remove();
  
  // Get text from main content areas
  const contentSelectors = [
    'main',
    'article',
    '[role="main"]',
    '.content',
    '.main-content',
    '#content',
    '#main',
    'body'
  ];
  
  let content = '';
  for (const selector of contentSelectors) {
    const element = $(selector);
    if (element.length) {
      content = element.text();
      break;
    }
  }
  
  // Clean up whitespace and return first 2000 characters
  return content
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 2000);
}

/**
 * Scrapes metadata from a given URL
 * @param {string} url - The URL to scrape
 * @param {Object} options - Scraping options
 * @param {boolean} options.includeContent - Include page content (default: true)
 * @returns {Promise<Object>} - Metadata object
 */
export async function scrapeMetadata(url, options = {}) {
  const { includeContent = true } = options;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    const html = await page.content();
    
    // Load HTML into cheerio for parsing
    const $ = cheerio.load(html);
    
    // Extract metadata
    const metadata = {
      url: url,
      title: $('title').text() || $('meta[property="og:title"]').attr('content') || '',
      description: $('meta[name="description"]').attr('content') || 
                   $('meta[property="og:description"]').attr('content') || '',
      keywords: $('meta[name="keywords"]').attr('content') || '',
      ogTitle: $('meta[property="og:title"]').attr('content') || '',
      ogDescription: $('meta[property="og:description"]').attr('content') || '',
      ogImage: $('meta[property="og:image"]').attr('content') || '',
      ogType: $('meta[property="og:type"]').attr('content') || '',
      ogUrl: $('meta[property="og:url"]').attr('content') || '',
      twitterCard: $('meta[name="twitter:card"]').attr('content') || '',
      twitterTitle: $('meta[name="twitter:title"]').attr('content') || '',
      twitterDescription: $('meta[name="twitter:description"]').attr('content') || '',
      twitterImage: $('meta[name="twitter:image"]').attr('content') || '',
      author: $('meta[name="author"]').attr('content') || '',
      canonical: $('link[rel="canonical"]').attr('href') || '',
      robots: $('meta[name="robots"]').attr('content') || '',
      h1: $('h1').first().text() || '',
      h2: $('h2').first().text() || '',
      lang: $('html').attr('lang') || 'en',
      language: $('html').attr('lang') || $('meta[http-equiv="content-language"]').attr('content') || 'en',
    };
    
    // Add page content if requested
    if (includeContent) {
      metadata.content = extractContent($);
    }
    
    await browser.close();
    return metadata;
  } catch (error) {
    await browser.close();
    throw new Error(`Failed to scrape ${url}: ${error.message}`);
  }
}

/**
 * Scrape metadata and generate SEO quality score
 * @param {string} url - The URL to scrape and score
 * @param {Object} options - Options
 * @param {string} options.primaryKeyword - Primary keyword for SEO analysis
 * @returns {Promise<Object>} - Metadata and SEO score
 */
export async function scrapeAndScore(url, options = {}) {
  const { primaryKeyword = '' } = options;
  
  console.log(`🔍 Scraping: ${url}`);
  
  // Step 1: Scrape metadata (with content)
  const metadata = await scrapeMetadata(url, { includeContent: true });
  console.log('✅ Metadata scraped');
  
  // Step 2: Generate SEO score
  console.log('📊 Generating SEO score...');
  const seoScoreResult = await generateSEOScore({
    url: metadata.url,
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    ogTags: {
      'og:title': metadata.ogTitle,
      'og:description': metadata.ogDescription,
      'og:image': metadata.ogImage,
      'og:type': metadata.ogType,
      'og:url': metadata.ogUrl
    },
    content: metadata.content,
    language: metadata.language,
    primaryKeyword
  });
  
  if (seoScoreResult.success) {
    console.log(`✅ SEO Score: ${seoScoreResult.analysis.total_score}/100`);
  }
  
  return {
    metadata,
    seoScore: seoScoreResult.analysis,
    timestamp: new Date().toISOString()
  };
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  const urlIndex = args.findIndex(arg => !arg.startsWith('--'));
  const url = args[urlIndex];
  
  const scoreMode = args.includes('--score') || args.includes('-s');
  const keywordIndex = args.findIndex(arg => arg === '--keyword' || arg === '-k');
  const primaryKeyword = keywordIndex !== -1 ? args[keywordIndex + 1] : '';
  
  if (!url) {
    console.log('');
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║           GlobSEO Metadata Scraper                    ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('Usage:');
    console.log('  node scraper.js <url> [options]');
    console.log('');
    console.log('Options:');
    console.log('  --score, -s              Generate SEO quality score');
    console.log('  --keyword, -k <keyword>  Primary keyword for SEO analysis');
    console.log('');
    console.log('Examples:');
    console.log('  node scraper.js https://example.com');
    console.log('  node scraper.js https://example.com --score');
    console.log('  node scraper.js https://example.com -s -k "example domain"');
    console.log('');
    process.exit(1);
  }
  
  const startTime = Date.now();
  
  if (scoreMode) {
    // Scrape and score mode
    scrapeAndScore(url, { primaryKeyword })
      .then(result => {
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        
        console.log('');
        console.log('═'.repeat(60));
        console.log('📊 SEO QUALITY SCORE REPORT');
        console.log('═'.repeat(60));
        console.log('');
        console.log(`URL: ${result.metadata.url}`);
        console.log(`Title: ${result.metadata.title}`);
        console.log(`Description: ${result.metadata.description.substring(0, 100)}...`);
        console.log('');
        console.log('Scores:');
        console.log('─'.repeat(60));
        console.log(`  Title Quality:        ${result.seoScore.scores.title_quality}/20 ${'█'.repeat(result.seoScore.scores.title_quality)}`);
        console.log(`  Description Quality:  ${result.seoScore.scores.description_quality}/20 ${'█'.repeat(result.seoScore.scores.description_quality)}`);
        console.log(`  Keyword Optimization: ${result.seoScore.scores.keyword_optimization}/20 ${'█'.repeat(result.seoScore.scores.keyword_optimization)}`);
        console.log(`  Content Alignment:    ${result.seoScore.scores.content_alignment}/20 ${'█'.repeat(result.seoScore.scores.content_alignment)}`);
        console.log(`  Technical SEO:        ${result.seoScore.scores.technical_seo}/20 ${'█'.repeat(result.seoScore.scores.technical_seo)}`);
        console.log('─'.repeat(60));
        console.log(`  🎯 TOTAL SCORE:        ${result.seoScore.total_score}/100`);
        
        // Grade
        let grade, emoji;
        if (result.seoScore.total_score >= 90) {
          grade = 'Excellent';
          emoji = '🌟';
        } else if (result.seoScore.total_score >= 75) {
          grade = 'Good';
          emoji = '✅';
        } else if (result.seoScore.total_score >= 60) {
          grade = 'Fair';
          emoji = '⚠️';
        } else {
          grade = 'Needs Improvement';
          emoji = '❌';
        }
        console.log(`  ${emoji} Grade: ${grade}`);
        console.log('');
        
        if (result.seoScore.issues && result.seoScore.issues.length > 0) {
          console.log('🔍 Issues:');
          result.seoScore.issues.forEach((issue, idx) => {
            console.log(`  ${idx + 1}. ${issue}`);
          });
          console.log('');
        }
        
        if (result.seoScore.recommendations && result.seoScore.recommendations.length > 0) {
          console.log('💡 Recommendations:');
          result.seoScore.recommendations.forEach((rec, idx) => {
            console.log(`  ${idx + 1}. ${rec}`);
          });
          console.log('');
        }
        
        console.log('═'.repeat(60));
        console.log(`⏱️  Completed in ${duration}s`);
        console.log('');
        console.log('Full JSON output:');
        console.log(JSON.stringify(result, null, 2));
      })
      .catch(error => {
        console.error('');
        console.error('❌ Error:', error.message);
        console.error('');
        process.exit(1);
      });
  } else {
    // Standard scrape mode
    scrapeMetadata(url)
      .then(metadata => {
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log('');
        console.log('✅ Metadata scraped successfully');
        console.log(`⏱️  Completed in ${duration}s`);
        console.log('');
        console.log(JSON.stringify(metadata, null, 2));
      })
      .catch(error => {
        console.error('');
        console.error('❌ Error:', error.message);
        console.error('');
        process.exit(1);
      });
  }
}

