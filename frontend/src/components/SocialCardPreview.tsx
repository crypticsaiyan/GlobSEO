import { useState } from 'react';
import { Monitor, Share2, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { Badge } from './ui/badge';

interface SocialCardPreviewProps {
  language: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
}

export function SocialCardPreview({ language, title, description, url, imageUrl }: SocialCardPreviewProps) {
  const [previewType, setPreviewType] = useState<'twitter' | 'facebook' | 'linkedin'>('twitter');
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

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

  // Extract domain and username from URL
  const getDomain = (urlString: string) => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return 'example.com';
    }
  };

  const domain = getDomain(url);
  const twitterHandle = `@${domain.split('.')[0]}`;

  // Generate platform-specific meta tags
  const getMetaTags = () => {
    const finalImageUrl = imageUrl || `${url}/og-image.jpg`;
    
    switch (previewType) {
      case 'twitter':
        return `<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="${twitterHandle}">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${finalImageUrl}">`;
      
      case 'facebook':
        return `<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${finalImageUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">`;
      
      case 'linkedin':
        return `<meta property="og:type" content="article">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${finalImageUrl}">`;
      
      default:
        return '';
    }
  };

  const handleCopyMetaTags = () => {
    navigator.clipboard.writeText(getMetaTags());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Platform-specific character limits
  const getPlatformLimits = () => {
    switch (previewType) {
      case 'twitter':
        return { title: 70, description: 200 };
      case 'facebook':
        return { title: 95, description: 300 };
      case 'linkedin':
        return { title: 200, description: 300 };
      default:
        return { title: 70, description: 200 };
    }
  };

  const limits = getPlatformLimits();
  const truncatedTitle = title.length > limits.title ? title.substring(0, limits.title) + '...' : title;
  const truncatedDescription = description.length > limits.description ? description.substring(0, limits.description) + '...' : description;

  return (
    <div className="space-y-3">
      <div
        className="flex items-center justify-between cursor-pointer hover:bg-white/5 -mx-2 px-2 py-2 rounded transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-white/40" />
          <span className="text-xs text-white/40 uppercase tracking-wider">Social Preview</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-white/5 text-white/60 border-0 text-xs">
            {getLanguageFlag(language)} {language}
          </Badge>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-white/40" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/40" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Platform Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setPreviewType('twitter')}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                previewType === 'twitter'
                  ? 'bg-[#1DA1F2] text-white shadow-lg shadow-[#1DA1F2]/20'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white/80'
              }`}
            >
              Twitter/X
            </button>
            <button
              onClick={() => setPreviewType('facebook')}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                previewType === 'facebook'
                  ? 'bg-[#1877F2] text-white shadow-lg shadow-[#1877F2]/20'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white/80'
              }`}
            >
              Facebook
            </button>
            <button
              onClick={() => setPreviewType('linkedin')}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                previewType === 'linkedin'
                  ? 'bg-[#0A66C2] text-white shadow-lg shadow-[#0A66C2]/20'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white/80'
              }`}
            >
              LinkedIn
            </button>
          </div>

          {/* Preview Card */}
          <div className="bg-[#0a0a0a] rounded-lg border border-white/10 overflow-hidden">
            {/* Image Preview - Reduced size */}
            <div className="aspect-[2.5/1] bg-gradient-to-br from-[#a3ff12]/20 via-[#a3ff12]/5 to-transparent relative overflow-hidden">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : null}
              {!imageUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-[#a3ff12]/20 flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">{getLanguageFlag(language)}</span>
                    </div>
                    <div className="text-xl font-bold text-white/20">{domain}</div>
                    {previewType === 'twitter' && (
                      <div className="text-xs text-white/10 mt-1">{twitterHandle}</div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Preview overlay */}
              <div className="absolute top-2 right-2 flex gap-2">
                <div className="bg-black/50 backdrop-blur-sm rounded px-2 py-1 text-xs text-white/80 flex items-center gap-1">
                  <Monitor className="w-3 h-3" />
                  Desktop
                </div>
              </div>

              {/* Platform-specific badges */}
              <div className="absolute bottom-2 left-2">
                <Badge className={`text-xs ${
                  previewType === 'twitter' ? 'bg-[#1DA1F2]/20 text-[#1DA1F2] border-[#1DA1F2]/30' :
                  previewType === 'facebook' ? 'bg-[#1877F2]/20 text-[#1877F2] border-[#1877F2]/30' :
                  'bg-[#0A66C2]/20 text-[#0A66C2] border-[#0A66C2]/30'
                } border`}>
                  {previewType === 'twitter' ? 'Twitter/X' : previewType === 'facebook' ? 'Facebook' : 'LinkedIn'}
                </Badge>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-3 space-y-2">
              <div className="text-xs text-white/40 uppercase">{domain}</div>
              <div className="text-sm font-medium text-white/90 line-clamp-2">
                {truncatedTitle}
              </div>
              <div className="text-xs text-white/60 line-clamp-2">
                {truncatedDescription}
              </div>
              
              {/* Platform-specific metadata */}
              <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                <div className="text-[10px] text-white/30">
                  {previewType === 'twitter' && `${truncatedTitle.length}/${limits.title} chars`}
                  {previewType === 'facebook' && 'Facebook Link Preview'}
                  {previewType === 'linkedin' && 'Article Preview'}
                </div>
              </div>
            </div>
          </div>

          {/* Social Meta Tags */}
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-white/40 uppercase tracking-wider">
                Generated Meta Tags
              </div>
              <button
                onClick={handleCopyMetaTags}
                className="p-1.5 hover:bg-white/10 rounded transition-colors"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-[#a3ff12]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-white/40" />
                )}
              </button>
            </div>
            <div className="bg-[#0a0a0a] rounded p-2 overflow-x-auto">
              <pre className="text-xs text-white/60 font-mono leading-relaxed">
                <code>{getMetaTags()}</code>
              </pre>
            </div>
            
            {/* Character count warnings */}
            <div className="mt-2 space-y-1">
              {title.length > limits.title && (
                <div className="text-xs text-orange-400/80 flex items-center gap-1">
                  <span>⚠</span>
                  <span>Title exceeds {previewType} limit ({title.length}/{limits.title} chars)</span>
                </div>
              )}
              {description.length > limits.description && (
                <div className="text-xs text-orange-400/80 flex items-center gap-1">
                  <span>⚠</span>
                  <span>Description exceeds {previewType} limit ({description.length}/{limits.description} chars)</span>
                </div>
              )}
              {title.length <= limits.title && description.length <= limits.description && (
                <div className="text-xs text-[#a3ff12]/80 flex items-center gap-1">
                  <span>✓</span>
                  <span>Meta tags are within {previewType} character limits</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
