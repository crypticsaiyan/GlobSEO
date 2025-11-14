import { TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';

interface SEOScores {
  title_quality: number;
  description_quality: number;
  keyword_optimization: number;
  content_alignment: number;
  technical_seo: number;
}

interface SEOAnalysis {
  scores: SEOScores;
  total_score: number;
  issues: string[];
  recommendations: string[];
}

interface SEOScoreCardProps {
  analysis: SEOAnalysis | null;
  isLoading?: boolean;
}

export function SEOScoreCard({ analysis, isLoading }: SEOScoreCardProps) {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/10 rounded-xl p-7 animate-pulse">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-white/5"></div>
          <div className="h-6 w-32 bg-white/5 rounded"></div>
        </div>
        <div className="space-y-4">
          <div className="h-24 bg-white/5 rounded-lg"></div>
          <div className="h-16 bg-white/5 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <TrendingUp className="w-8 h-8 text-white/20" />
        </div>
        <p className="text-white/30 mb-2">SEO score will appear here</p>
        <p className="text-white/20 text-sm">Analyze a webpage to see the results</p>
      </div>
    );
  }

  const { total_score, scores, issues, recommendations } = analysis;

  // Determine grade and color
  const getGradeInfo = (score: number) => {
    if (score >= 90) return { grade: 'Excellent', emoji: '🌟', color: 'text-green-400', bg: 'bg-green-400/10' };
    if (score >= 75) return { grade: 'Good', emoji: '✅', color: 'text-blue-400', bg: 'bg-blue-400/10' };
    if (score >= 60) return { grade: 'Fair', emoji: '⚠️', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
    return { grade: 'Needs Work', emoji: '❌', color: 'text-red-400', bg: 'bg-red-400/10' };
  };

  const gradeInfo = getGradeInfo(total_score);

  const scoreCategories = [
    { label: 'Title Quality', value: scores.title_quality, key: 'title_quality' },
    { label: 'Description Quality', value: scores.description_quality, key: 'description_quality' },
    { label: 'Keyword Optimization', value: scores.keyword_optimization, key: 'keyword_optimization' },
    { label: 'Content Alignment', value: scores.content_alignment, key: 'content_alignment' },
    { label: 'Technical SEO', value: scores.technical_seo, key: 'technical_seo' },
  ];

  return (
    <div className="bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/10 rounded-xl p-7 transition-all duration-300 hover:border-white/20 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#a3ff12]/10 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-[#a3ff12]" />
          </div>
          <h3 className="text-white/90 tracking-tight text-xl">SEO Quality Score</h3>
        </div>
      </div>

      {/* Total Score */}
      <div className={`${gradeInfo.bg} rounded-xl p-6 mb-6 text-center`}>
        <div className="text-6xl font-bold mb-2">
          <span className={gradeInfo.color}>{total_score}</span>
          <span className="text-2xl text-white/30">/100</span>
        </div>
        <div className={`text-lg font-medium ${gradeInfo.color}`}>
          {gradeInfo.emoji} {gradeInfo.grade}
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm text-white/50 font-medium">Score Breakdown</h4>
        {scoreCategories.map(({ label, value }) => (
          <div key={label}>
            <div className="flex justify-between mb-1.5">
              <span className="text-sm text-white/70">{label}</span>
              <span className="text-sm font-medium text-white/90">{value}/20</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  value >= 18 ? 'bg-green-400' :
                  value >= 15 ? 'bg-blue-400' :
                  value >= 12 ? 'bg-yellow-400' :
                  'bg-red-400'
                }`}
                style={{ width: `${(value / 20) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Issues */}
      {issues && issues.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <h4 className="text-sm text-white/70 font-medium">Issues Found</h4>
          </div>
          <ul className="space-y-2">
            {issues.map((issue, idx) => (
              <li key={idx} className="text-sm text-white/50 flex gap-2">
                <span className="text-red-400 flex-shrink-0">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-[#a3ff12]" />
            <h4 className="text-sm text-white/70 font-medium">Recommendations</h4>
          </div>
          <ul className="space-y-2">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="text-sm text-white/50 flex gap-2">
                <span className="text-[#a3ff12] flex-shrink-0">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
