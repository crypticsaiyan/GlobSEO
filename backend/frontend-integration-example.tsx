/**
 * Frontend Integration Example for SEO Quality Score
 * 
 * This example shows how to integrate the SEO score feature
 * into your React/TypeScript frontend
 */

// ============================================
// 1. TYPE DEFINITIONS
// ============================================

export interface SEOScores {
  title_quality: number;
  description_quality: number;
  keyword_optimization: number;
  content_alignment: number;
  technical_seo: number;
}

export interface SEOAnalysis {
  scores: SEOScores;
  total_score: number;
  issues: string[];
  recommendations: string[];
}

export interface SEOScoreResponse {
  success: boolean;
  analysis: SEOAnalysis;
  metadata: {
    model: string;
    timestamp: string;
    url: string;
  };
}

export interface ScrapeAndScoreResponse {
  success: boolean;
  url: string;
  metadata: any;
  seoScore: SEOAnalysis;
  timestamp: string;
}

// ============================================
// 2. API SERVICE
// ============================================

const API_BASE_URL = 'http://localhost:3001/api';

export class SEOScoreService {
  /**
   * Scrape a URL and get SEO score in one call
   */
  static async scrapeAndScore(
    url: string,
    primaryKeyword?: string
  ): Promise<ScrapeAndScoreResponse> {
    const response = await fetch(`${API_BASE_URL}/scrape-and-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, primaryKeyword })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to scrape and score');
    }

    return response.json();
  }

  /**
   * Generate SEO score from existing metadata
   */
  static async generateScore(params: {
    url: string;
    title?: string;
    description?: string;
    keywords?: string;
    ogTags?: Record<string, string>;
    content?: string;
    language?: string;
    primaryKeyword?: string;
  }): Promise<SEOScoreResponse> {
    const response = await fetch(`${API_BASE_URL}/seo-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate score');
    }

    return response.json();
  }

  /**
   * Get score grade and emoji based on total score
   */
  static getScoreGrade(score: number): { grade: string; emoji: string; color: string } {
    if (score >= 90) {
      return { grade: 'Excellent', emoji: '🌟', color: 'text-green-600' };
    } else if (score >= 75) {
      return { grade: 'Good', emoji: '✅', color: 'text-blue-600' };
    } else if (score >= 60) {
      return { grade: 'Fair', emoji: '⚠️', color: 'text-yellow-600' };
    } else {
      return { grade: 'Needs Improvement', emoji: '❌', color: 'text-red-600' };
    }
  }
}

// ============================================
// 3. REACT COMPONENT EXAMPLE
// ============================================

import React, { useState } from 'react';

export function SEOScorePanel() {
  const [url, setUrl] = useState('');
  const [primaryKeyword, setPrimaryKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScrapeAndScoreResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await SEOScoreService.scrapeAndScore(url, primaryKeyword);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Input Section */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-2xl font-bold">SEO Quality Analyzer</h2>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Website URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Primary Keyword (Optional)
          </label>
          <input
            type="text"
            value={primaryKeyword}
            onChange={(e) => setPrimaryKeyword(e.target.value)}
            placeholder="e.g., SEO tools"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze SEO Quality'}
        </button>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      {result?.seoScore && (
        <SEOScoreResults analysis={result.seoScore} />
      )}
    </div>
  );
}

// ============================================
// 4. SCORE DISPLAY COMPONENT
// ============================================

interface SEOScoreResultsProps {
  analysis: SEOAnalysis;
}

export function SEOScoreResults({ analysis }: SEOScoreResultsProps) {
  const { grade, emoji, color } = SEOScoreService.getScoreGrade(analysis.total_score);

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* Total Score */}
      <div className="text-center">
        <div className="text-6xl font-bold mb-2">
          {analysis.total_score}
          <span className="text-3xl text-gray-500">/100</span>
        </div>
        <div className={`text-2xl font-semibold ${color}`}>
          {emoji} {grade}
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Score Breakdown</h3>
        {Object.entries(analysis.scores).map(([key, value]) => (
          <ScoreBar
            key={key}
            label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            score={value}
            maxScore={20}
          />
        ))}
      </div>

      {/* Issues */}
      {analysis.issues.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            🔍 Issues Found
          </h3>
          <ul className="space-y-2">
            {analysis.issues.map((issue, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-red-500">•</span>
                <span className="text-gray-700">{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            💡 Recommendations
          </h3>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ============================================
// 5. SCORE BAR COMPONENT
// ============================================

interface ScoreBarProps {
  label: string;
  score: number;
  maxScore: number;
}

function ScoreBar({ label, score, maxScore }: ScoreBarProps) {
  const percentage = (score / maxScore) * 100;
  const color = 
    percentage >= 90 ? 'bg-green-500' :
    percentage >= 75 ? 'bg-blue-500' :
    percentage >= 60 ? 'bg-yellow-500' :
    'bg-red-500';

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-semibold">{score}/{maxScore}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ============================================
// 6. USAGE IN APP
// ============================================

/*
// In your App.tsx or routes:

import { SEOScorePanel } from './components/SEOScorePanel';

function App() {
  return (
    <div>
      <SEOScorePanel />
    </div>
  );
}

// Or integrate into existing metadata panel:

import { SEOScoreService } from './services/seo-score';

function MetadataPanel({ metadata }) {
  const [seoScore, setSeoScore] = useState(null);

  useEffect(() => {
    async function getScore() {
      const score = await SEOScoreService.generateScore({
        url: metadata.url,
        title: metadata.title,
        description: metadata.description,
        // ... other fields
      });
      setSeoScore(score.analysis);
    }
    getScore();
  }, [metadata]);

  return (
    <div>
      {seoScore && <SEOScoreResults analysis={seoScore} />}
    </div>
  );
}
*/

// ============================================
// 7. CUSTOM HOOKS
// ============================================

export function useSEOScore() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SEOAnalysis | null>(null);

  const analyze = async (url: string, primaryKeyword?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await SEOScoreService.scrapeAndScore(url, primaryKeyword);
      setResult(data.seoScore);
      return data.seoScore;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { analyze, loading, error, result };
}

// Usage:
// const { analyze, loading, result } = useSEOScore();
// await analyze('https://example.com', 'keyword');
