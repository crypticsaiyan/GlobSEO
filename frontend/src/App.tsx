import { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { FeaturesSection } from './components/FeaturesSection';
import { api, type Metadata, type SEOAnalysis } from './services/api';

export default function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['English', 'Spanish']);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [seoScore, setSeoScore] = useState<SEOAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (url: string, primaryKeyword?: string) => {
    setIsGenerating(true);
    setError(null);
    setShowResults(false);
    
    try {
      // Scrape and get SEO score
      const result = await api.scrapeAndScore(url, primaryKeyword);
      setMetadata(result.metadata);
      setSeoScore(result.seoScore);
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze URL');
      console.error('Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <Header />
      
      <main className="relative overflow-x-hidden">
        <HeroSection />
        
        {/* Gradient separator */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        {/* Main workspace */}
        <section className="relative py-20">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4 tracking-tight">
                Try it <span className="text-[#a3ff12]">now</span>
              </h2>
              <p className="text-white/50 max-w-2xl mx-auto">
                Generate SEO-optimized metadata in multiple languages instantly. 
                Paste your content and watch the magic happen.
              </p>
            </div>

            <div className="space-y-8">
              {/* Input Panel - Full Width */}
              <div className="max-w-[800px] mx-auto">
                <InputPanel 
                  onGenerate={handleGenerate} 
                  isGenerating={isGenerating}
                  selectedLanguages={selectedLanguages}
                  setSelectedLanguages={setSelectedLanguages}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="max-w-[800px] mx-auto bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Output Panel - Full Width with Language Cards */}
              <OutputPanel 
                showResults={showResults} 
                selectedLanguages={selectedLanguages}
                metadata={metadata}
                seoScore={seoScore}
              />
            </div>
          </div>

          {/* Background decorative elements */}
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#a3ff12]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#a3ff12]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        </section>

        <FeaturesSection />
      </main>

      <footer className="relative border-t border-white/5 mt-24 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none"></div>
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl text-white/90 mb-3 tracking-tight">
              Integrate as you <span className="text-[#a3ff12]">want</span>
            </h3>
            <p className="text-white/50 max-w-2xl mx-auto">
              GlobSEO integrates seamlessly with your existing tools and workflows 
              to make multilingual SEO optimization effortless
            </p>
          </div>

          {/* Integration logos/placeholders */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
            {['CLI', 'API', 'SDK', 'CI/CD'].map((item) => (
              <div 
                key={item}
                className="bg-white/5 border border-white/10 rounded-lg p-6 text-center hover:border-[#a3ff12]/50 transition-all duration-300 hover:bg-white/10"
              >
                <div className="text-white/70 text-lg">{item}</div>
              </div>
            ))}
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

          <p className="text-center text-white/30 text-sm">
            Built with <span className="text-[#a3ff12]">Lingo.dev</span> — Multilingual Hackathon
          </p>
        </div>
      </footer>
    </div>
  );
}