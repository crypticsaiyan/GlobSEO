import { useState } from 'react';
import { Wand2, RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';

interface SmartRewriteSuggestionsProps {
  originalTitle: string;
  originalDescription: string;
}

export function SmartRewriteSuggestions({ 
  originalTitle, 
  originalDescription,
}: SmartRewriteSuggestionsProps) {
  const [copiedSuggestion, setCopiedSuggestion] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock suggestions - in real app, these would come from AI
  const titleSuggestions = [
    originalTitle,
    originalTitle.replace(/\|.*/, '| Rank Higher Globally'),
    originalTitle.substring(0, 55) + '...',
  ];

  const descriptionSuggestions = [
    originalDescription,
    originalDescription.replace(/\.$/, '. Start optimizing today for free.'),
    originalDescription.substring(0, 145) + '...',
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSuggestion(id);
    setTimeout(() => setCopiedSuggestion(null), 2000);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-white/40" />
          <span className="text-xs text-white/40 uppercase tracking-wider">Smart Rewrites</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRegenerate}
          disabled={isGenerating}
          className="h-7 px-2 text-xs text-white/60 hover:text-white/90 hover:bg-white/5"
        >
          <RefreshCw className={`w-3 h-3 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
          Regenerate
        </Button>
      </div>

      {/* Title Suggestions */}
      <div className="space-y-2">
        <label className="text-xs text-white/50">Title Variations</label>
        <div className="space-y-2">
          {titleSuggestions.slice(1).map((suggestion, index) => (
            <div
              key={index}
              className="flex items-start gap-2 bg-[#0a0a0a] rounded-lg p-3 border border-white/5 hover:border-[#a3ff12]/30 transition-colors group"
            >
              <div className="flex-1">
                <p className="text-sm text-white/80 leading-relaxed">{suggestion}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-white/40">{suggestion.length} chars</span>
                  {suggestion.length >= 50 && suggestion.length <= 60 && (
                    <span className="text-xs text-[#a3ff12]">✓ Optimal length</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleCopy(suggestion, `title-${index}`)}
                className="p-1.5 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100"
              >
                {copiedSuggestion === `title-${index}` ? (
                  <Check className="w-3.5 h-3.5 text-[#a3ff12]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-white/40" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Description Suggestions */}
      <div className="space-y-2">
        <label className="text-xs text-white/50">Description Variations</label>
        <div className="space-y-2">
          {descriptionSuggestions.slice(1).map((suggestion, index) => (
            <div
              key={index}
              className="flex items-start gap-2 bg-[#0a0a0a] rounded-lg p-3 border border-white/5 hover:border-[#a3ff12]/30 transition-colors group"
            >
              <div className="flex-1">
                <p className="text-sm text-white/70 leading-relaxed">{suggestion}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-white/40">{suggestion.length} chars</span>
                  {suggestion.length >= 150 && suggestion.length <= 160 && (
                    <span className="text-xs text-[#a3ff12]">✓ Optimal length</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleCopy(suggestion, `desc-${index}`)}
                className="p-1.5 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100"
              >
                {copiedSuggestion === `desc-${index}` ? (
                  <Check className="w-3.5 h-3.5 text-[#a3ff12]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-white/40" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
