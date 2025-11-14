import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { X, Link2 } from 'lucide-react';

interface InputPanelProps {
  onGenerate: () => void;
  isGenerating: boolean;
  selectedLanguages: string[];
  setSelectedLanguages: (languages: string[]) => void;
}

export function InputPanel({ onGenerate, isGenerating, selectedLanguages, setSelectedLanguages }: InputPanelProps) {
  const availableLanguages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Portuguese', 'Italian'];

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/10 rounded-xl p-7 transition-all duration-300 hover:border-white/20 shadow-xl">
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
          <label className="block text-sm text-white/50 mb-2.5">
            Webpage URL
          </label>
          <Input
            type="url"
            placeholder="https://example.com"
            className="bg-[#0a0a0a] border-white/10 focus:border-[#a3ff12]/50 focus:ring-[#a3ff12]/20 text-white placeholder:text-white/30 h-11 transition-all"
          />
        </div>

        <div className="relative flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <span className="text-xs text-white/40 bg-[#0a0a0a] px-2">or</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>

        <div>
          <label className="block text-sm text-white/50 mb-2.5">
            Page Content
          </label>
          <Textarea
            placeholder="Paste your page content here..."
            rows={7}
            className="bg-[#0a0a0a] border-white/10 focus:border-[#a3ff12]/50 focus:ring-[#a3ff12]/20 text-white placeholder:text-white/30 resize-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm text-white/50 mb-3">
            Target Languages
          </label>
          <div className="flex flex-wrap gap-2">
            {availableLanguages.map(lang => (
              <Badge
                key={lang}
                variant={selectedLanguages.includes(lang) ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  selectedLanguages.includes(lang)
                    ? 'bg-[#a3ff12] text-black hover:bg-[#92e610] shadow-lg shadow-[#a3ff12]/20'
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
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full bg-[#a3ff12] hover:bg-[#92e610] text-black h-12 rounded-lg transition-all duration-300 disabled:opacity-50 shadow-lg shadow-[#a3ff12]/20 hover:shadow-xl hover:shadow-[#a3ff12]/30"
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              Generating...
            </div>
          ) : (
            'Generate SEO Metadata'
          )}
        </Button>
      </div>
    </div>
  );
}