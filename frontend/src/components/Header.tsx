import { Moon, Sun, Github, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useState } from 'react';

export function Header() {
  const [theme, setTheme] = useState<'dark'>('dark');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="border-b border-white/10 bg-[#0a0a0a] sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#a3ff12] rounded-sm flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-black">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <span className="text-white">GlobSEO</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white/60 hover:text-white hover:bg-white/5 cursor-pointer"
              onClick={() => scrollToSection('try-it-now')}
            >
              Get started
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white/60 hover:text-white hover:bg-white/5 gap-2 cursor-pointer"
              onClick={() => scrollToSection('features')}
            >
              Features
              <Badge className="bg-[#a3ff12] text-black text-xs px-1.5 py-0 h-5">AI</Badge>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/5 gap-2 hidden md:flex cursor-pointer">
            <Github className="w-4 h-4" />
            <span className="text-sm">Github</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/5 cursor-pointer">
            <Sun className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
