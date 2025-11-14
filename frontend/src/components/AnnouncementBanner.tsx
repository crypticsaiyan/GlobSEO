import { Sparkles } from 'lucide-react';

export function AnnouncementBanner() {
  return (
    <div className="bg-[#a3ff12] text-black py-3 px-6 text-center">
      <div className="flex items-center justify-center gap-2 text-sm">
        <Sparkles className="w-4 h-4" />
        <span>
          Big update launching soon.{' '}
          <a href="#" className="underline hover:no-underline">
            Join the early access list
          </a>
        </span>
      </div>
    </div>
  );
}
