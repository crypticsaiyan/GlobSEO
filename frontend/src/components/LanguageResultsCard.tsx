import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, Wand2 } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { MetadataQualityScore } from './MetadataQualityScore';
import { SmartRewriteSuggestions } from './SmartRewriteSuggestions';
import { SchemaGenerator } from './SchemaGenerator';
import { SocialCardPreview } from './SocialCardPreview';

interface LanguageResultsCardProps {
  language: string;
}

// Mock data generator for different languages
const generateMockData = (language: string) => {
  const mockData: Record<string, any> = {
    English: {
      title: "GlobSEO - Multilingual SEO Metadata Generator | Boost Global Rankings",
      description: "Generate optimized SEO metadata in multiple languages with GlobSEO. AI-powered title tags, meta descriptions, and keywords for international search visibility.",
      keywords: ["multilingual SEO", "metadata generator", "SEO optimization", "international SEO", "AI SEO tools"],
    },
    Spanish: {
      title: "GlobSEO - Generador de Metadatos SEO Multilingüe | Mejora tu Ranking Global",
      description: "Genera metadatos SEO optimizados en múltiples idiomas con GlobSEO. Títulos, meta descripciones y palabras clave impulsadas por IA para visibilidad internacional.",
      keywords: ["SEO multilingüe", "generador de metadatos", "optimización SEO", "SEO internacional", "herramientas SEO IA"],
    },
    French: {
      title: "GlobSEO - Générateur de Métadonnées SEO Multilingue | Améliorez votre Classement",
      description: "Générez des métadonnées SEO optimisées dans plusieurs langues avec GlobSEO. Balises de titre, méta descriptions et mots-clés alimentés par l'IA.",
      keywords: ["SEO multilingue", "générateur de métadonnées", "optimisation SEO", "SEO international", "outils SEO IA"],
    },
    German: {
      title: "GlobSEO - Mehrsprachiger SEO-Metadaten-Generator | Verbessern Sie Ihr Ranking",
      description: "Generieren Sie optimierte SEO-Metadaten in mehreren Sprachen mit GlobSEO. KI-gestützte Title-Tags, Meta-Beschreibungen und Keywords.",
      keywords: ["mehrsprachiges SEO", "Metadaten-Generator", "SEO-Optimierung", "internationales SEO", "KI-SEO-Tools"],
    },
    Japanese: {
      title: "GlobSEO - 多言語SEOメタデータジェネレーター | グローバルランキング向上",
      description: "GlobSEOで複数の言語に最適化されたSEOメタデータを生成。AI搭載のタイトルタグ、メタディスクリプション、キーワード。",
      keywords: ["多言語SEO", "メタデータジェネレーター", "SEO最適化", "国際SEO", "AI SEOツール"],
    },
    Chinese: {
      title: "GlobSEO - 多语言SEO元数据生成器 | 提升全球排名",
      description: "使用GlobSEO生成多种语言的优化SEO元数据。AI驱动的标题标签、元描述和关键词，提升国际搜索可见性。",
      keywords: ["多语言SEO", "元数据生成器", "SEO优化", "国际SEO", "AI SEO工具"],
    },
    Portuguese: {
      title: "GlobSEO - Gerador de Metadados SEO Multilíngue | Melhore seu Ranking Global",
      description: "Gere metadados SEO otimizados em vários idiomas com GlobSEO. Tags de título, meta descrições e palavras-chave com IA.",
      keywords: ["SEO multilíngue", "gerador de metadados", "otimização SEO", "SEO internacional", "ferramentas SEO IA"],
    },
    Italian: {
      title: "GlobSEO - Generatore di Metadati SEO Multilingue | Migliora il Ranking Globale",
      description: "Genera metadati SEO ottimizzati in più lingue con GlobSEO. Tag del titolo, meta descrizioni e parole chiave basate sull'IA.",
      keywords: ["SEO multilingue", "generatore di metadati", "ottimizzazione SEO", "SEO internazionale", "strumenti SEO IA"],
    }
  };

  return mockData[language] || mockData.English;
};

export function LanguageResultsCard({ language }: LanguageResultsCardProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const mockResults = generateMockData(language);

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

  const htmlMeta = `<meta name="description" content="${mockResults.description}">
<meta name="keywords" content="${mockResults.keywords.join(', ')}">
<meta property="og:title" content="${mockResults.title}">
<meta property="og:description" content="${mockResults.description}">
<meta name="twitter:card" content="summary_large_image">`;

  const jsonOutput = {
    title: mockResults.title,
    description: mockResults.description,
    keywords: mockResults.keywords,
    language: language.toLowerCase(),
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
        {/* Metadata Quality Score */}
        <MetadataQualityScore
          title={mockResults.title}
          description={mockResults.description}
          keywords={mockResults.keywords}
        />

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        {/* SEO Title */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40 uppercase tracking-wider">SEO Title</span>
            <button
              onClick={() => handleCopy(mockResults.title, 'title')}
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
            >
              {copied === `${language}-title` ? (
                <Check className="w-3.5 h-3.5 text-[#a3ff12]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-white/40" />
              )}
            </button>
          </div>
          <p className="text-white/80 text-sm leading-relaxed bg-[#0a0a0a] rounded-lg p-3 border border-white/5">
            {mockResults.title}
          </p>
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40 uppercase tracking-wider">Meta Description</span>
            <button
              onClick={() => handleCopy(mockResults.description, 'description')}
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
            >
              {copied === `${language}-description` ? (
                <Check className="w-3.5 h-3.5 text-[#a3ff12]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-white/40" />
              )}
            </button>
          </div>
          <p className="text-white/70 text-sm leading-relaxed bg-[#0a0a0a] rounded-lg p-3 border border-white/5">
            {mockResults.description}
          </p>
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40 uppercase tracking-wider">Keywords</span>
            <button
              onClick={() => handleCopy(mockResults.keywords.join(', '), 'keywords')}
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
            >
              {copied === `${language}-keywords` ? (
                <Check className="w-3.5 h-3.5 text-[#a3ff12]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-white/40" />
              )}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {mockResults.keywords.map((keyword: string, index: number) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-white/5 text-white/70 border-0 hover:bg-white/10 transition-colors text-xs"
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        {/* Smart Rewrite Suggestions (collapsible) */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer hover:bg-white/5 -mx-2 px-2 py-2 rounded transition-colors"
            onClick={() => toggleSection('rewrites')}
          >
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-white/40" />
              <span className="text-xs text-white/40 uppercase tracking-wider">Smart Rewrites</span>
            </div>
            <div className="flex items-center gap-2">
              {expandedSections.has('rewrites') ? (
                <ChevronUp className="w-4 h-4 text-white/40" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/40" />
              )}
            </div>
          </div>

          {expandedSections.has('rewrites') && (
            <div className="mt-2 bg-[#0a0a0a] rounded-lg border border-white/10 p-3 animate-in slide-in-from-top-2 duration-200">
              <SmartRewriteSuggestions
                originalTitle={mockResults.title}
                originalDescription={mockResults.description}
              />
            </div>
          )}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        {/* Schema Generator */}
        <SchemaGenerator
          language={language}
          title={mockResults.title}
          description={mockResults.description}
        />

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        {/* Social Card Preview */}
        <SocialCardPreview
          language={language}
          title={mockResults.title}
          description={mockResults.description}
        />

        {/* Collapsible HTML Meta Tags */}
        <div className="border-t border-white/5 pt-4">
          <div
            className="flex items-center justify-between cursor-pointer hover:bg-white/5 -mx-2 px-2 py-2 rounded transition-colors"
            onClick={() => toggleSection('html')}
          >
            <span className="text-xs text-white/40 uppercase tracking-wider">HTML Meta Tags</span>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(htmlMeta, 'html');
                }}
                className="p-1.5 hover:bg-white/10 rounded transition-colors"
              >
                {copied === `${language}-html` ? (
                  <Check className="w-3.5 h-3.5 text-[#a3ff12]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-white/40" />
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
            <div className="mt-2 bg-[#0a0a0a] rounded-lg border border-white/10 p-3 overflow-x-auto animate-in slide-in-from-top-2 duration-200">
              <pre className="text-xs text-white/70 font-mono leading-relaxed">
                <code>{htmlMeta}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Collapsible JSON Output */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer hover:bg-white/5 -mx-2 px-2 py-2 rounded transition-colors"
            onClick={() => toggleSection('json')}
          >
            <span className="text-xs text-white/40 uppercase tracking-wider">JSON Output</span>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(JSON.stringify(jsonOutput, null, 2), 'json');
                }}
                className="p-1.5 hover:bg-white/10 rounded transition-colors"
              >
                {copied === `${language}-json` ? (
                  <Check className="w-3.5 h-3.5 text-[#a3ff12]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-white/40" />
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
            <div className="mt-2 bg-[#0a0a0a] rounded-lg border border-white/10 p-3 overflow-x-auto animate-in slide-in-from-top-2 duration-200">
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
