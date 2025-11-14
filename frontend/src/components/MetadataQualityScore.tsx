import { TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Badge } from './ui/badge';

interface MetadataQualityScoreProps {
  title: string;
  description: string;
  keywords: string[];
}

export function MetadataQualityScore({ 
  title, 
  description, 
  keywords 
}: MetadataQualityScoreProps) {
  // Calculate quality metrics
  const titleLength = title.length;
  const descriptionLength = description.length;
  const keywordCount = keywords.length;

  // Scoring logic
  const titleScore = titleLength >= 50 && titleLength <= 60 ? 100 : 
                     titleLength >= 40 && titleLength <= 70 ? 80 : 60;
  
  const descriptionScore = descriptionLength >= 150 && descriptionLength <= 160 ? 100 :
                          descriptionLength >= 120 && descriptionLength <= 170 ? 80 : 60;
  
  const keywordScore = keywordCount >= 5 && keywordCount <= 8 ? 100 :
                       keywordCount >= 3 && keywordCount <= 10 ? 80 : 60;

  const overallScore = Math.round((titleScore + descriptionScore + keywordScore) / 3);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-[#a3ff12]';
    if (score >= 70) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="w-4 h-4" />;
    if (score >= 70) return <Info className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    return 'Needs Work';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-white/40" />
          <span className="text-xs text-white/40 uppercase tracking-wider">Quality Score</span>
        </div>
        <Badge className={`${getScoreColor(overallScore)} bg-white/5 border-0`}>
          {getScoreBadge(overallScore)}
        </Badge>
      </div>

      {/* Overall Score Circle */}
      <div className="flex items-center gap-4 bg-[#0a0a0a] rounded-lg p-4 border border-white/5">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-white/10"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - overallScore / 100)}`}
              className={getScoreColor(overallScore)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-semibold ${getScoreColor(overallScore)}`}>
              {overallScore}
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {/* Title Score */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {getScoreIcon(titleScore)}
              <span className="text-white/60">Title Length</span>
            </div>
            <span className={`font-medium ${getScoreColor(titleScore)}`}>
              {titleLength} chars
            </span>
          </div>

          {/* Description Score */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {getScoreIcon(descriptionScore)}
              <span className="text-white/60">Description</span>
            </div>
            <span className={`font-medium ${getScoreColor(descriptionScore)}`}>
              {descriptionLength} chars
            </span>
          </div>

          {/* Keyword Score */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {getScoreIcon(keywordScore)}
              <span className="text-white/60">Keywords</span>
            </div>
            <span className={`font-medium ${getScoreColor(keywordScore)}`}>
              {keywordCount} terms
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-1.5">
        {titleLength < 50 && (
          <div className="flex items-start gap-2 text-xs text-orange-400/80 bg-orange-400/5 rounded p-2 border border-orange-400/10">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>Title is too short. Aim for 50-60 characters for better SEO.</span>
          </div>
        )}
        {titleLength > 70 && (
          <div className="flex items-start gap-2 text-xs text-orange-400/80 bg-orange-400/5 rounded p-2 border border-orange-400/10">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>Title is too long. Keep it under 60 characters to avoid truncation.</span>
          </div>
        )}
        {descriptionLength < 120 && (
          <div className="flex items-start gap-2 text-xs text-orange-400/80 bg-orange-400/5 rounded p-2 border border-orange-400/10">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>Description is too short. Aim for 150-160 characters for optimal display.</span>
          </div>
        )}
        {keywordCount < 5 && (
          <div className="flex items-start gap-2 text-xs text-yellow-400/80 bg-yellow-400/5 rounded p-2 border border-yellow-400/10">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>Consider adding more keywords for better targeting (5-8 recommended).</span>
          </div>
        )}
      </div>
    </div>
  );
}
