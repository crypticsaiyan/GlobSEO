import { useState } from 'react';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { X, Link2, Sparkles } from 'lucide-react';

interface InputPanelProps {
  onGenerate: (url: string, primaryKeyword?: string) => Promise<void>;
  isGenerating: boolean;
  selectedLanguages: string[];
  setSelectedLanguages: (languages: string[]) => void;
}

export function InputPanel({ onGenerate, isGenerating, selectedLanguages, setSelectedLanguages }: InputPanelProps) {
  const [url, setUrl] = useState('');
  const [primaryKeyword, setPrimaryKeyword] = useState('');
  const availableLanguages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Portuguese', 'Italian'];

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      await onGenerate(url.trim(), primaryKeyword.trim() || undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/10 rounded-xl p-7 transition-all duration-300 hover:border-white/20 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[#a3ff12]/10 flex items-center justify-center">
          <Link2 className="w-4 h-4 text-[#a3ff12]" />
        </div>
        <h2 className="text-white/90 tracking-tight text-xl">
          Input Content
        </h2>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-base text-white/50 mb-2.5">
            Webpage URL *
          </label>
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="bg-[#0a0a0a] border-white/10 focus:border-[#a3ff12]/50 focus:ring-[#a3ff12]/20 text-white placeholder:text-white/30 h-11 transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-white/50 mb-2.5 text-base">
            Primary Keyword (Optional)
          </label>
          <Input
            type="text"
            placeholder="e.g., SEO optimization, web development"
            value={primaryKeyword}
            onChange={(e) => setPrimaryKeyword(e.target.value)}
            className="bg-[#0a0a0a] border-white/10 focus:border-[#a3ff12]/50 focus:ring-[#a3ff12]/20 text-white placeholder:text-white/30 h-11 transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-base text-white/50 mb-3">
            Target Languages
          </label>
          <div className="flex flex-wrap gap-2">
            {availableLanguages.map(lang => (
              <Badge
                key={lang}
                variant={selectedLanguages.includes(lang) ? "default" : "outline"}
                className={`cursor-pointer transition-all text-sm ${
                  selectedLanguages.includes(lang)
                    ? 'bg-[#a3ff12] text-black hover:bg-[#92e610]'
                    : 'bg-transparent border-white/20 text-white/60 hover:border-white/40 hover:text-white/80'
                }`}
                onClick={() => toggleLanguage(lang)}
              >
                {lang}
                {selectedLanguages.includes(lang) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isGenerating || !url.trim()}
          className="w-full bg-[#a3ff12] hover:bg-[#92e610] text-black h-12 rounded-lg transition-all duration-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              Analyzing...
            </div>
          ) : (
            'Analyze & Generate SEO'
          )}
        </Button>
      </div>
    </form>
  );
}