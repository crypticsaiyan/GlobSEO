import { Copy, Check } from 'lucide-react';
import { ReactNode } from 'react';

interface ResultCardProps {
  title: string;
  children: ReactNode;
  onCopy: () => void;
  copied: boolean;
}

export function ResultCard({ title, children, onCopy, copied }: ResultCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/20 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/[0.02]">
        <span className="text-xs text-white/40 uppercase tracking-wider">
          {title}
        </span>
        <button
          onClick={onCopy}
          className="p-1.5 hover:bg-white/10 rounded transition-colors group"
        >
          {copied ? (
            <Check className="w-4 h-4 text-[#a3ff12]" />
          ) : (
            <Copy className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
          )}
        </button>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}