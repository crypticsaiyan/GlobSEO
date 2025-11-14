import { useState } from 'react';
import { Code2, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from './ui/badge';

interface SchemaGeneratorProps {
  language: string;
  title: string;
  description: string;
  url: string;
}

export function SchemaGenerator({ language, title, description, url }: SchemaGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract domain from URL for organization name
  const getDomain = (urlString: string) => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return 'example.com';
    }
  };

  const domain = getDomain(url);
  const organizationName = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": organizationName,
    "url": url,
    "description": description
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": url,
    "inLanguage": language.toLowerCase().substring(0, 2),
    "publisher": {
      "@type": "Organization",
      "name": organizationName
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": url
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": title.split('|')[0].trim(),
        "item": url
      }
    ]
  };

  const allSchemas = {
    "@context": "https://schema.org",
    "@graph": [organizationSchema, webPageSchema, breadcrumbSchema]
  };

  const schemaJSON = JSON.stringify(allSchemas, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(schemaJSON);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div
        className="flex items-center justify-between cursor-pointer hover:bg-white/5 -mx-2 px-2 py-2 rounded transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-white/40" />
          <span className="text-xs text-white/40 uppercase tracking-wider">Schema Markup</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-[#a3ff12]/10 text-[#a3ff12] border-0 text-xs">
            JSON-LD
          </Badge>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#a3ff12]" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-white/40" />
            )}
          </button>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-white/40" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/40" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
          {/* Schema Preview */}
          <div className="bg-[#0a0a0a] rounded-lg border border-white/10 p-3 overflow-x-auto">
            <pre className="text-xs text-white/70 font-mono leading-relaxed">
              <code>{schemaJSON}</code>
            </pre>
          </div>

          {/* Schema Types Included */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/5 rounded-lg p-2 border border-white/5">
              <div className="text-xs text-white/40 mb-1">Organization</div>
              <div className="text-sm text-white/80">✓</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2 border border-white/5">
              <div className="text-xs text-white/40 mb-1">WebPage</div>
              <div className="text-sm text-white/80">✓</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2 border border-white/5">
              <div className="text-xs text-white/40 mb-1">Breadcrumb</div>
              <div className="text-sm text-white/80">✓</div>
            </div>
          </div>

          {/* Implementation Instructions */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Code2 className="w-4 h-4 text-blue-400 mt-0.5" />
              <div className="text-xs text-blue-400/90 leading-relaxed">
                <p className="font-medium mb-1">How to implement:</p>
                <p className="text-blue-400/70">
                  Copy this JSON-LD script and place it in the &lt;head&gt; section of your HTML document for better search engine understanding.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
