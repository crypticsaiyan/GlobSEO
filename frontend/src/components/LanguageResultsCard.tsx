import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, Code2, FileJson } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { SchemaGenerator } from './SchemaGenerator';
import { SocialCardPreview } from './SocialCardPreview';
import type { Metadata, SEOAnalysis, TranslationResult } from '../services/api';

interface LanguageResultsCardProps {
  language: string;
  metadata: Metadata | null;
  seoScore: SEOAnalysis | null;
  translations: TranslationResult;
}

// Language mapping: Display name -> Language code
const LANGUAGE_CODE_MAP: Record<string, string> = {
  'English': 'en',
  'Spanish': 'es',
  'French': 'fr',
  'German': 'de',
  'Japanese': 'ja',
  'Chinese': 'zh',
  'Portuguese': 'pt',
  'Italian': 'it',
};

export function LanguageResultsCard({ language, metadata, seoScore, translations }: LanguageResultsCardProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Get language code from display name
  const langCode = LANGUAGE_CODE_MAP[language] || language.toLowerCase();
  
  // Get the data for this language
  // For English, use original metadata
  // For other languages, use translations if available
  const isEnglish = language === 'English';
  const translatedData = translations[langCode];
  
  // Get metadata values
  const getMetadataValue = (field: 'title' | 'description' | 'keywords' | 'ogTitle' | 'ogDescription' | 'twitterTitle' | 'twitterDescription' | 'h1') => {
    if (isEnglish && metadata) {
      return metadata[field] || '';
    }
    
    if (translatedData) {
      // Translation structure: { meta: {...}, og: {...}, twitter: {...} }
      if (field === 'title' || field === 'description' || field === 'keywords' || field === 'h1') {
        return translatedData.meta?.[field] || '';
      }
      if (field === 'ogTitle') {
        return translatedData.og?.title || '';
      }
      if (field === 'ogDescription') {
        return translatedData.og?.description || '';
      }
      if (field === 'twitterTitle') {
        return translatedData.twitter?.title || '';
      }
      if (field === 'twitterDescription') {
        return translatedData.twitter?.description || '';
      }
    }
    
    // Fallback to original metadata
    return metadata?.[field] || '';
  };

  const title = getMetadataValue('title');
  const description = getMetadataValue('description');
  const keywords = getMetadataValue('keywords');
  const keywordsArray = keywords ? keywords.split(',').map((k: string) => k.trim()).filter(Boolean) : [];
  
  const ogTitle = getMetadataValue('ogTitle') || title;
  const ogDescription = getMetadataValue('ogDescription') || description;
  
  // Get URL and image from original metadata (these don't get translated)
  const url = metadata?.url || metadata?.ogUrl || metadata?.canonical || '';
  const ogImage = metadata?.ogImage || '';

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(`${language}-${id}`);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getLanguageFlag = (lang: string) => {
    const flags: Record<string, string> = {
      English: '🇬🇧',
      Spanish: '🇪🇸',
      French: '🇫🇷',
      German: '🇩🇪',
      Japanese: '🇯🇵',
      Chinese: '🇨🇳',
      Portuguese: '🇵🇹',
      Italian: '🇮🇹',
    };
    return flags[lang] || '🌐';
  };

  const htmlMeta = `<meta name="description" content="${description}">
<meta name="keywords" content="${keywords}">
<meta property="og:title" content="${ogTitle}">
<meta property="og:description" content="${ogDescription}">
<meta name="twitter:card" content="summary_large_image">`;

  const jsonOutput = {
    title,
    description,
    keywords: keywordsArray,
    language: langCode,
  };

  return (
    <div className="bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/10 rounded-xl overflow-hidden transition-all hover:border-white/20 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Language Header */}
      <div className="p-5 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#a3ff12]/10 flex items-center justify-center text-xl">
              {getLanguageFlag(language)}
            </div>
            <div>
              <h3 className="text-white/90">{language}</h3>
              <p className="text-xs text-white/40">SEO Metadata</p>
            </div>
          </div>
          <Badge className="bg-[#a3ff12]/10 text-[#a3ff12] border-0 hover:bg-[#a3ff12]/20">
            Ready
          </Badge>
        </div>
      </div>

      {/* Results Sections */}
      <div className="p-5 space-y-4">
        {/* SEO Title */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/40 uppercase tracking-wider">SEO Title</span>
            <button
              onClick={() => handleCopy(title, 'title')}
              className="p-1.5 hover:bg-white/10 rounded transition-colors cursor-pointer"
            >
              {copied === `${language}-title` ? (
                <Check className="w-3.5 h-3.5 text-[#a3ff12]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-white/40" />
              )}
            </button>
          </div>
          <p className="text-white/80 text-sm leading-relaxed bg-[#0a0a0a] rounded-lg p-3 border border-white/5">
            {title || 'No title available'}
          </p>
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/40 uppercase tracking-wider">Meta Description</span>
            <button
              onClick={() => handleCopy(description, 'description')}
              className="p-1.5 hover:bg-white/10 rounded transition-colors cursor-pointer"
            >
              {copied === `${language}-description` ? (
                <Check className="w-3.5 h-3.5 text-[#a3ff12]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-white/40" />
              )}
            </button>
          </div>
          <p className="text-white/70 text-sm leading-relaxed bg-[#0a0a0a] rounded-lg p-3 border border-white/5">
            {description || 'No description available'}
          </p>
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/40 uppercase tracking-wider">Keywords</span>
            <button
              onClick={() => handleCopy(keywords, 'keywords')}
              className="p-1.5 hover:bg-white/10 rounded transition-colors cursor-pointer"
            >
              {copied === `${language}-keywords` ? (
                <Check className="w-3.5 h-3.5 text-[#a3ff12]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-white/40" />
              )}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {keywordsArray.length > 0 ? (
              keywordsArray.map((keyword: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-white/5 text-white/70 border-0 hover:bg-white/10 transition-colors text-sm"
                >
                  {keyword}
                </Badge>
              ))
            ) : (
              <span className="text-white/40 text-xs">No keywords available</span>
            )}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        {/* Schema Generator */}
        <SchemaGenerator
          language={language}
          title={title}
          description={description}
          url={url}
        />

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        {/* Social Card Preview */}
        <SocialCardPreview
          language={language}
          title={title}
          description={description}
          url={url}
          imageUrl={ogImage}
        />

        {/* Collapsible HTML Meta Tags */}
        <div className="border-t border-white/5 pt-4">
          <div
            className="flex items-center justify-between cursor-pointer hover:bg-white/5 -mx-2 px-2 py-2 rounded-lg transition-all"
            onClick={() => toggleSection('html')}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-500/10 rounded">
                <Code2 className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <span className="text-sm font-medium text-white">HTML Meta Tags</span>
                <p className="text-xs text-white/40">Copy-paste ready meta tags</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-500/10 text-orange-400 border-0 text-xs font-medium">
                HTML
              </Badge>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(htmlMeta, 'html');
                }}
                className="p-1.5 hover:bg-white/10 rounded transition-colors group cursor-pointer"
                title="Copy HTML meta tags"
              >
                {copied === `${language}-html` ? (
                  <Check className="w-3.5 h-3.5 text-[#a3ff12]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-white/40 group-hover:text-white/60" />
                )}
              </button>
              {expandedSections.has('html') ? (
                <ChevronUp className="w-4 h-4 text-white/40" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/40" />
              )}
            </div>
          </div>
          {expandedSections.has('html') && (
            <div className="mt-2 bg-[#0a0a0a] rounded-lg border border-white/10 p-4 overflow-x-auto animate-in slide-in-from-top-2 duration-200 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/50 font-medium">Meta Tags</span>
                <span className="text-xs text-white/30">{htmlMeta.split('\n').length} tags</span>
              </div>
              <pre className="text-xs text-white/70 font-mono leading-relaxed">
                <code>{htmlMeta}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Collapsible JSON Output */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer hover:bg-white/5 -mx-2 px-2 py-2 rounded-lg transition-all"
            onClick={() => toggleSection('json')}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-cyan-500/10 rounded">
                <FileJson className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <span className="text-sm font-medium text-white">JSON Output</span>
                <p className="text-xs text-white/40">Structured data export</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-cyan-500/10 text-cyan-400 border-0 text-xs font-medium">
                JSON
              </Badge>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(JSON.stringify(jsonOutput, null, 2), 'json');
                }}
                className="p-1.5 hover:bg-white/10 rounded transition-colors group cursor-pointer"
                title="Copy JSON output"
              >
                {copied === `${language}-json` ? (
                  <Check className="w-3.5 h-3.5 text-[#a3ff12]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-white/40 group-hover:text-white/60" />
                )}
              </button>
              {expandedSections.has('json') ? (
                <ChevronUp className="w-4 h-4 text-white/40" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/40" />
              )}
            </div>
          </div>
          {expandedSections.has('json') && (
            <div className="mt-2 bg-[#0a0a0a] rounded-lg border border-white/10 p-4 overflow-x-auto animate-in slide-in-from-top-2 duration-200 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/50 font-medium">JSON Data</span>
                <span className="text-xs text-white/30">{Object.keys(jsonOutput).length} fields</span>
              </div>
              <pre className="text-xs text-white/70 font-mono leading-relaxed">
                <code>{JSON.stringify(jsonOutput, null, 2)}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
