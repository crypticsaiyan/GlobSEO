# Syntax Highlighting Implementation

## Overview
Code syntax highlighting has been implemented across all code blocks in the GlobSEO website using `react-syntax-highlighter`. The color scheme is carefully designed to match the website's dark theme and brand colors.

## Features

### ✅ Implemented Components
- **CodeBlock** - Generic code block component with syntax highlighting
- **SchemaGenerator** - JSON-LD schema markup with syntax highlighting
- **LanguageResultsCard** - HTML meta tags and JSON output with syntax highlighting
- **OutputPanel.old** - Legacy output panel updated with syntax highlighting

### 🎨 Color Scheme
The syntax highlighting uses a custom theme based on VS Code Dark Plus, customized to match GlobSEO's brand:

- **Background**: `#0a0a0a` (matches website's dark theme)
- **Text**: `#e0e0e0` (light gray for readability)
- **Comments**: `#6a737d` (muted gray)
- **Keywords**: `#ff7b72` (red)
- **Strings**: `#a5d6ff` (light blue)
- **Functions**: `#d2a8ff` (purple)
- **Properties**: `#79c0ff` (cyan)
- **Tags**: `#7ee787` (green)
- **Attributes**: `#a3ff12` (GlobSEO accent green - brand color!)
- **Numbers/Booleans**: `#79c0ff` (cyan)
- **Classes**: `#ffa657` (orange)

## Technical Details

### Dependencies
```json
{
  "react-syntax-highlighter": "^15.x.x",
  "@types/react-syntax-highlighter": "^15.x.x"
}
```

### Theme File
Location: `/frontend/src/styles/syntaxTheme.ts`

This file exports:
- `customSyntaxTheme` - The custom color theme
- `defaultCustomStyle` - Default styling configuration

### Supported Languages
- HTML
- JSON
- JavaScript/TypeScript
- CSS
- And all other languages supported by Prism.js

## Usage Example

```tsx
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { customSyntaxTheme, defaultCustomStyle } from '../styles/syntaxTheme';

<SyntaxHighlighter
  language="json"
  style={customSyntaxTheme}
  customStyle={defaultCustomStyle}
  wrapLongLines={false}
>
  {codeString}
</SyntaxHighlighter>
```

## Benefits

1. **Enhanced Readability** - Code blocks are easier to read with syntax-aware coloring
2. **Professional Look** - Matches modern code editor aesthetics
3. **Brand Consistency** - Uses GlobSEO's accent color (#a3ff12) for important syntax elements
4. **Dark Theme Optimized** - Perfect contrast for the website's dark background
5. **Consistent Experience** - All code blocks across the site use the same theme

## Files Modified

1. `/frontend/src/components/CodeBlock.tsx`
2. `/frontend/src/components/SchemaGenerator.tsx`
3. `/frontend/src/components/LanguageResultsCard.tsx`
4. `/frontend/src/components/OutputPanel.old.tsx`
5. `/frontend/src/styles/syntaxTheme.ts` (new file)

## Future Enhancements

- Line numbers (optional)
- Copy button integration
- Highlighting specific lines
- Multiple theme support (if light mode is added)
- Language detection for auto-highlighting

---

**Implementation Date**: November 15, 2025
**Status**: ✅ Complete
