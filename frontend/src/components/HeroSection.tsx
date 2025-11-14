import { Button } from '../components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-transparent">
      <div className="max-w-[1400px] mx-auto px-6 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6 tracking-tight leading-[1.1]">
              <div className="mb-2">Rank.</div>
              <div className="mb-2">Optimize.</div>
              <div className="text-[#a3ff12]">Globalize.</div>
            </h1>
            
            <p className="text-lg text-white/60 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Generate SEO metadata and optimize content using AI.
            </p>

            {/* <div className="flex items-center gap-4 justify-center lg:justify-start flex-wrap">
              <Button className="bg-[#a3ff12] hover:bg-[#92e610] text-black h-12 px-8 text-base">
                Get started
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/5 gap-2 h-12 px-6 border border-white/10">
                <Play className="w-4 h-4" />
                Watch demo
              </Button>
            </div> */}

            {/* Stats */}
            <div className="flex items-center gap-8 mt-12 justify-center lg:justify-start">
              <div>
                <div className="text-2xl text-white/90">100+</div>
                <div className="text-sm text-white/40">Languages</div>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div>
                <div className="text-2xl text-white/90">99.9%</div>
                <div className="text-sm text-white/40">Uptime</div>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div>
                <div className="text-2xl text-white/90">&lt;100ms</div>
                <div className="text-sm text-white/40">Response</div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#a3ff12]/20 via-transparent to-transparent blur-3xl"></div>
            <div className="relative">
              {/* Enhanced visual */}
              <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                
                <div className="space-y-4">
                  {/* Code-like visualization */}
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded bg-[#a3ff12]/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#a3ff12]"></div>
                    </div>
                    <div className="h-2 bg-white/10 rounded flex-1"></div>
                  </div>
                  <div className="flex items-center gap-3 pl-8">
                    <div className="w-4 h-4 rounded bg-blue-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    </div>
                    <div className="h-2 bg-white/10 rounded w-2/3"></div>
                  </div>
                  <div className="flex items-center gap-3 pl-8">
                    <div className="w-4 h-4 rounded bg-purple-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                    </div>
                    <div className="h-2 bg-white/10 rounded w-1/2"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded bg-[#a3ff12]/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#a3ff12]"></div>
                    </div>
                    <div className="h-2 bg-white/10 rounded flex-1"></div>
                  </div>
                  <div className="flex items-center gap-3 pl-8">
                    <div className="w-4 h-4 rounded bg-orange-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    </div>
                    <div className="h-2 bg-white/10 rounded w-3/4"></div>
                  </div>
                  
                  {/* Glowing accent */}
                  <div className="mt-8 p-4 bg-[#a3ff12]/5 border border-[#a3ff12]/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-[#a3ff12] animate-pulse"></div>
                      <div className="text-xs text-[#a3ff12]">Translating...</div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-1.5 bg-[#a3ff12]/30 rounded w-full"></div>
                      <div className="h-1.5 bg-[#a3ff12]/20 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none"></div>
    </section>
  );
}