import { AlertCircle, Check, Copy } from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "../components/CodeBlock";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface MetadataResult {
  url: string;
  original: any;
  translations: Record<string, any>;
  targetLanguages: string[];
  timestamp: string;
}

interface OutputPanelProps {
  showResults: boolean;
  results: MetadataResult | null;
  error: string | null;
}

export function OutputPanel({ showResults, results, error }: OutputPanelProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const generateAllLanguagesHTMLMetaTags = () => {
    if (!results) return "";

    let allTags = "";

    // Add original English version first
    allTags += `<!-- Original (English) Meta Tags -->
<html lang="en">
<head>
  <title>${results.original.title}</title>
  <meta name="description" content="${results.original.description}" />
  <meta name="keywords" content="${results.original.keywords || ""}" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="${results.original.ogTitle}" />
  <meta property="og:description" content="${
    results.original.ogDescription
  }" />
  <meta property="og:image" content="${results.original.ogImage || ""}" />
  <meta property="og:url" content="${results.original.url}" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="${
    results.original.twitterCard || "summary_large_image"
  }" />
  <meta name="twitter:title" content="${results.original.twitterTitle}" />
  <meta name="twitter:description" content="${
    results.original.twitterDescription
  }" />
  <meta name="twitter:image" content="${
    results.original.twitterImage || ""
  }" />
</head>
</html>

`;

    // Add all translated versions
    results.targetLanguages.forEach((lang) => {
      const trans = results.translations[lang] || {};
      allTags += `<!-- Meta Tags for ${lang.toUpperCase()} -->
<html lang="${lang}">
<head>
  <title>${trans.meta?.title || results.original.title}</title>
  <meta name="description" content="${
    trans.meta?.description || results.original.description
  }" />
  <meta name="keywords" content="${
    trans.meta?.keywords || results.original.keywords || ""
  }" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="${
    trans.og?.title || results.original.ogTitle
  }" />
  <meta property="og:description" content="${
    trans.og?.description || results.original.ogDescription
  }" />
  <meta property="og:image" content="${results.original.ogImage || ""}" />
  <meta property="og:url" content="${results.original.url}" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="${
    results.original.twitterCard || "summary_large_image"
  }" />
  <meta name="twitter:title" content="${
    trans.twitter?.title || results.original.twitterTitle
  }" />
  <meta name="twitter:description" content="${
    trans.twitter?.description || results.original.twitterDescription
  }" />
  <meta name="twitter:image" content="${
    results.original.twitterImage || ""
  }" />
</head>
</html>

`;
    });

    return allTags.trim();
  };

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-8 flex items-center justify-center min-h-[600px] transition-all duration-300">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
            Error
          </h3>
          <p className="text-red-700 dark:text-red-300 max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  if (!showResults || !results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Generated Metadata
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {results.url}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Languages Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Translated to:
            </span>
            {results.targetLanguages.map((lang) => (
              <Badge
                key={lang}
                variant="default"
                className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
              >
                {lang.toUpperCase()}
              </Badge>
            ))}
          </div>

          {/* HTML Meta Tags for All Languages */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                HTML Meta Tags (All Languages)
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleCopy(generateAllLanguagesHTMLMetaTags(), "html")
                }
                className="h-8"
              >
                {copied === "html" ? (
                  <>
                    <Check className="w-3 h-3 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-2" />
                    Copy All
                  </>
              )}
            </Button>
          </div>
          <CodeBlock
            code={generateAllLanguagesHTMLMetaTags()}
            language="html"
          />
        </div>          {/* JSON Output */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                JSON Output
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleCopy(JSON.stringify(results, null, 2), "json")
                }
                className="h-8"
              >
                {copied === "json" ? (
                  <>
                    <Check className="w-3 h-3 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          <CodeBlock
            code={JSON.stringify(
              {
                original: results.original,
                translations: results.translations,
                timestamp: results.timestamp,
              },
              null,
              2,
            )}
            language="json"
          />
        </div>
      </div>
    </CardContent>
  </Card>
);
}