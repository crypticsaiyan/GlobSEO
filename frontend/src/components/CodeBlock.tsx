import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { customSyntaxTheme, defaultCustomStyle } from '../styles/syntaxTheme';

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <div className="bg-[#0a0a0a] rounded-lg border border-white/10 p-4 overflow-x-auto">
      <SyntaxHighlighter
        language={language.toLowerCase()}
        style={customSyntaxTheme}
        customStyle={{
          ...defaultCustomStyle,
          fontSize: '0.875rem',
        }}
        wrapLongLines={false}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}