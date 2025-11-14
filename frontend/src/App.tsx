import { useState } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { InputPanel } from "./components/InputPanel";
import { OutputPanel } from "./components/OutputPanel";
import { AnnouncementBanner } from "./components/AnnouncementBanner";
import { FeaturesSection } from "./components/FeaturesSection";
import {
  api,
  type Metadata,
  type SEOAnalysis,
  type TranslationResult,
} from "./services/api";

// Language mapping: Display name -> Language code
const LANGUAGE_CODE_MAP: Record<string, string> = {
  English: "en",
  Spanish: "es",
  French: "fr",
  German: "de",
  Japanese: "ja",
  Chinese: "zh",
  Portuguese: "pt",
  Italian: "it",
};

export default function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    "English",
    "Spanish",
  ]);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [seoScore, setSeoScore] = useState<SEOAnalysis | null>(null);
  const [translations, setTranslations] = useState<TranslationResult>({});
  const [error, setError] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string>('');

  const handleGenerate = async (url: string, primaryKeyword?: string) => {
    setIsGenerating(true);
    setError(null);
    setShowResults(false);
    setProcessingStep('Scraping webpage...');

    try {
      // Convert language names to codes (excluding English as it's the source)
      const targetLanguageCodes = selectedLanguages
        .filter((lang) => lang !== "English")
        .map((lang) => LANGUAGE_CODE_MAP[lang] || lang.toLowerCase())
        .filter(Boolean);

      if (targetLanguageCodes.length > 0) {
        // Use complete pipeline with translations
        console.log("🌍 Running complete pipeline with translations...");
        
        // Simulate step updates
        setTimeout(() => setProcessingStep('Extracting metadata...'), 500);
        setTimeout(() => setProcessingStep(`Translating to ${targetLanguageCodes.length} languages...`), 1500);
        setTimeout(() => setProcessingStep('Analyzing SEO score...'), 3000);
        
        const result = await api.scrapeTranslateScore(
          url,
          targetLanguageCodes,
          primaryKeyword
        );
        
        setMetadata(result.metadata);
        setSeoScore(result.seoScore);
        setTranslations(result.translations);
        console.log("✅ Pipeline completed successfully");
      } else {
        // Only scrape and score (no translations)
        console.log("📊 Running scrape and score only...");
        
        setTimeout(() => setProcessingStep('Extracting metadata...'), 500);
        setTimeout(() => setProcessingStep('Analyzing SEO score...'), 1500);
        
        const result = await api.scrapeAndScore(url, primaryKeyword);
        
        setMetadata(result.metadata);
        setSeoScore(result.seoScore);
        setTranslations({});
      }

      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze URL");
      console.error("Error:", err);
    } finally {
      setIsGenerating(false);
      setProcessingStep('');
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
        <section id="try-it-now" className="relative py-20">
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
                  processingStep={processingStep}
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
              <br />
              {/* Output Panel - Full Width with Language Cards */}
              <OutputPanel
                showResults={showResults}
                selectedLanguages={selectedLanguages}
                metadata={metadata}
                seoScore={seoScore}
                translations={translations}
              />
            </div>
          </div>

          {/* Background decorative elements */}
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#a3ff12]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#a3ff12]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        </section>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>
        <FeaturesSection />
      </main>

      <footer className="relative border-t border-white/5 mt-24 py-16 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <p className="text-center text-white/30 text-sm">
            Built with <a href="https://lingo.dev" target="_blank" rel="noopener noreferrer" className="text-[#a3ff12] hover:text-[#92e610] transition-colors">Lingo.dev</a> —
            Multilingual Hackathon
          </p>
        </div>
      </footer>
    </div>
  );
}
