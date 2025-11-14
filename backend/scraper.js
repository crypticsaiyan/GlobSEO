import { chromium } from "playwright";
import * as cheerio from "cheerio";

/**
 * Scrapes metadata from a given URL
 * @param {string} url - The URL to scrape
 * @returns {Promise<Object>} - Metadata object
 */
export async function scrapeMetadata(url) {
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
      lang: $('html').attr('lang') || 'en',
    };
    
    await browser.close();
    return metadata;
  } catch (error) {
    await browser.close();
    throw new Error(`Failed to scrape ${url}: ${error.message}`);
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: node scraper.js <url>');
    process.exit(1);
  }
  
  scrapeMetadata(url)
    .then(metadata => {
      console.log(JSON.stringify(metadata, null, 2));
    })
    .catch(error => {
      console.error('Error:', error.message);
      process.exit(1);
    });
}
