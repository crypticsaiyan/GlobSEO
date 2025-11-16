const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface SEOScores {
  title_quality: number;
  description_quality: number;
  keyword_optimization: number;
  content_alignment: number;
  technical_seo: number;
}

export interface SmartRewrites {
  title_variations: string[];
  description_variations: string[];
}

export interface SEOAnalysis {
  scores: SEOScores;
  total_score: number;
  issues: string[];
  recommendations: string[];
  smart_rewrites?: SmartRewrites;
}

export interface Metadata {
  url: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogUrl: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  author: string;
  canonical: string;
  robots: string;
  h1: string;
  h2: string;
  lang: string;
  language: string;
  content?: string;
}

export interface ScrapeAndScoreResponse {
  success: boolean;
  url: string;
  metadata: Metadata;
  seoScore: SEOAnalysis;
  timestamp: string;
}

export interface ScrapeTranslateScoreResponse {
  success: boolean;
  url: string;
  metadata: Metadata;
  translations: TranslationResult;
  seoScore: SEOAnalysis;
  targetLanguages: string[];
  timestamp: string;
}

export interface TranslationResult {
  [language: string]: {
    meta?: {
      title?: string;
      description?: string;
      keywords?: string;
      h1?: string;
    };
    og?: {
      title?: string;
      description?: string;
    };
    twitter?: {
      title?: string;
      description?: string;
    };
  };
}

export interface TranslateResponse {
  success: boolean;
  url: string;
  original: Metadata;
  translations: TranslationResult;
  targetLanguages: string[];
  timestamp: string;
}

class APIService {
  /**
   * Scrape metadata from a URL
   */
  async scrape(url: string): Promise<Metadata> {
    const response = await fetch(`${API_BASE_URL}/scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to scrape URL');
    }

    const data = await response.json();
    return data.metadata;
  }

  /**
   * Scrape and get SEO score in one call
   */
  async scrapeAndScore(url: string, primaryKeyword?: string, geminiApiKey?: string): Promise<ScrapeAndScoreResponse> {
    const response = await fetch(`${API_BASE_URL}/scrape-and-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, primaryKeyword, geminiApiKey })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to scrape and score');
    }

    return response.json();
  }

  /**
   * Complete pipeline: Scrape, translate metadata, and score SEO
   */
  async scrapeTranslateScore(
    url: string, 
    languages: string[], 
    primaryKeyword?: string,
    lingoApiKey?: string,
    geminiApiKey?: string
  ): Promise<ScrapeTranslateScoreResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/scrape-translate-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, languages, primaryKeyword, lingoApiKey, geminiApiKey }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to complete pipeline');
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out. The analysis is taking longer than expected.');
      }
      throw error;
    }
  }

  /**
   * Generate SEO score from existing metadata
   */
  async generateScore(params: {
    url: string;
    title?: string;
    description?: string;
    keywords?: string;
    ogTags?: Record<string, string>;
    content?: string;
    language?: string;
    primaryKeyword?: string;
  }): Promise<{ success: boolean; analysis: SEOAnalysis }> {
    const response = await fetch(`${API_BASE_URL}/seo-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate SEO score');
    }

    return response.json();
  }

  /**
   * Scrape and translate metadata
   */
  async translate(url: string, languages: string[], lingoApiKey?: string): Promise<TranslateResponse> {
    const response = await fetch(`${API_BASE_URL}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, languages, lingoApiKey })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to translate');
    }

    return response.json();
  }

  /**
   * Get list of supported languages
   */
  async getLanguages(): Promise<Array<{ code: string; name: string; native: string }>> {
    const response = await fetch(`${API_BASE_URL}/languages`);

    if (!response.ok) {
      throw new Error('Failed to fetch languages');
    }

    const data = await response.json();
    return data.supported;
  }

  /**
   * Health check
   */
  async health(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  }
}

export const api = new APIService();
export default api;
