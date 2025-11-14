import { Globe, Zap, Code, Languages } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Optimize your content for 100+ languages and reach audiences worldwide'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Generate metadata in seconds using state-of-the-art AI models'
    },
    {
      icon: Code,
      title: 'Developer First',
      description: 'RESTful API, SDKs, and CLI tools for seamless integration'
    },
    {
      icon: Languages,
      title: 'AI-Powered',
      description: 'Leverage GPT-4 and Claude for contextual, natural translations'
    }
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 tracking-tight">
            Why <span className="text-[#a3ff12]">GlobSEO</span>?
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Everything you need to scale your content globally
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#141414] border border-white/10 rounded-lg p-6 hover:border-[#a3ff12]/50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#a3ff12]/10 flex items-center justify-center mb-4 group-hover:bg-[#a3ff12]/20 transition-colors">
                <feature.icon className="w-6 h-6 text-[#a3ff12]" />
              </div>
              <h3 className="text-lg text-white/90 mb-2">{feature.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Background grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(163, 255, 18, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(163, 255, 18, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}></div>
      </div>
    </section>
  );
}
