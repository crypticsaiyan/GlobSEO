import { useState } from 'react';
import { LanguageResultsCard } from '../components/LanguageResultsCard';
import { Sparkles } from 'lucide-react';

interface OutputPanelProps {
  showResults: boolean;
  selectedLanguages: string[];
}

export function OutputPanel({ showResults, selectedLanguages }: OutputPanelProps) {
  if (!showResults) {
    return (
      <div className="bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px] transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(163,255,18,0.05),transparent_50%)]"></div>
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 mx-auto">
            <Sparkles className="w-8 h-8 text-white/20" />
          </div>
          <p className="text-white/30 mb-2">
            Generated metadata will appear here
          </p>
          <p className="text-white/20 text-sm">
            Start by entering your content above
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl text-white/90 mb-2">
          Generated <span className="text-[#a3ff12]">Results</span>
        </h3>
        <p className="text-white/40 text-sm">
          SEO metadata optimized for {selectedLanguages.length} language{selectedLanguages.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Language Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedLanguages.map((language) => (
          <LanguageResultsCard key={language} language={language} />
        ))}
      </div>
    </div>
  );
}
