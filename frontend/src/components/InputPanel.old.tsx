import { AlertCircle, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface InputPanelProps {
  onGenerate: (url: string, languages: string[]) => void;
  isGenerating: boolean;
}

const languageMap: Record<string, string> = {
  English: "en",
  Spanish: "es",
  French: "fr",
  German: "de",
  Japanese: "ja",
  Chinese: "zh",
  Portuguese: "pt",
  Italian: "it",
  Arabic: "ar",
  Russian: "ru",
  Korean: "ko",
  Dutch: "nl",
};

export function InputPanel({ onGenerate, isGenerating }: InputPanelProps) {
  const [url, setUrl] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    "Spanish",
    "French",
  ]);
  const [urlError, setUrlError] = useState("");

  const availableLanguages = Object.keys(languageMap);

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== lang));
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleGenerate = () => {
    setUrlError("");

    if (!url.trim()) {
      setUrlError("Please enter a URL");
      return;
    }

    if (!isValidUrl(url)) {
      setUrlError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    if (selectedLanguages.length === 0) {
      setUrlError("Please select at least one target language");
      return;
    }

    const languageCodes = selectedLanguages.map((lang) => languageMap[lang]);
    onGenerate(url, languageCodes);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2 tracking-tight">
          SEO Metadata Generator
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Enter a webpage URL and select target languages to extract and
          translate SEO metadata
        </p>
      </div>

      {/* Two boxes side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* URL Input Box */}
        <Card>
          <CardHeader>
            <CardTitle>Website URL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setUrlError("");
                }}
                className={`bg-white dark:bg-[#0f0f0f] border-neutral-300 dark:border-neutral-700 focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors ${
                  urlError ? "border-red-500 dark:border-red-500" : ""
                }`}
              />
              {urlError && (
                <div className="flex items-center gap-2 mt-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>{urlError}</span>
                </div>
              )}
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                Example: https://github.com or https://example.com
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Language Selection Box */}
        <Card>
          <CardHeader>
            <CardTitle>
              Target Languages ({selectedLanguages.length} selected)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {availableLanguages.map((lang) => (
                <Badge
                  key={lang}
                  variant={
                    selectedLanguages.includes(lang) ? "default" : "outline"
                  }
                  className={`cursor-pointer transition-all ${
                    selectedLanguages.includes(lang)
                      ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200"
                      : "bg-transparent border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-600"
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
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-3">
              Click to select/deselect languages for translation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !url.trim()}
          className="w-full max-w-xs bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 text-white dark:text-neutral-900 hover:from-neutral-800 hover:to-neutral-700 dark:hover:from-neutral-200 dark:hover:to-neutral-300 transition-all duration-300 h-10 rounded-lg shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating...
            </span>
          ) : (
            "Generate SEO Metadata"
          )}
        </Button>
      </div>
    </div>
  );
}
