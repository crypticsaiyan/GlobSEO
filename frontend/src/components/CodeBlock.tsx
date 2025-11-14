interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <div className="bg-[#0a0a0a] rounded-lg border border-white/10 p-4 overflow-x-auto">
      <pre className="text-sm text-white/80 font-mono leading-relaxed">
        <code className="language-{language}">{code}</code>
      </pre>
    </div>
  );
}