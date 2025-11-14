#!/bin/bash

# GlobSEO - Quick Start Script
# This script helps you get started with GlobSEO + Lingo.dev CLI

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║          🌍 GlobSEO - Lingo.dev CLI Setup                ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check if API key is set
if [ -z "$LINGODOTDEV_API_KEY" ] && [ -z "$OPENAI_API_KEY" ] && [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "⚠️  No API key found!"
    echo ""
    echo "Please set one of the following environment variables:"
    echo ""
    echo "  export LINGODOTDEV_API_KEY='your-key'  (Recommended)"
    echo "  export OPENAI_API_KEY='your-key'"
    echo "  export ANTHROPIC_API_KEY='your-key'"
    echo ""
    echo "Get your Lingo.dev API key at: https://lingo.dev/auth"
    echo ""
    exit 1
fi

echo "✅ API key found"
echo ""

# Check if frontend i18n.json exists
FRONTEND_DIR="../frontend"
I18N_CONFIG="$FRONTEND_DIR/i18n.json"

if [ ! -f "$I18N_CONFIG" ]; then
    echo "📝 Initializing Lingo.dev CLI in frontend..."
    cd "$FRONTEND_DIR" || exit
    npx lingo.dev@latest init
    cd - > /dev/null || exit
    echo "✅ Frontend initialized"
else
    echo "✅ Frontend already configured"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Ready to go!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Try these commands:"
echo ""
echo "  # Scrape and translate to Spanish and French"
echo "  node pipeline.js https://example.com es fr"
echo ""
echo "  # Multiple languages"
echo "  node pipeline.js https://github.com es fr de it"
echo ""
echo "  # Just scrape (no translation)"
echo "  node scraper.js https://example.com"
echo ""
echo "  # View usage guide"
echo "  node USAGE.js"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Documentation:"
echo "  - LINGO_INTEGRATION.md  (Complete setup guide)"
echo "  - CHEATSHEET.txt        (Quick reference)"
echo "  - README.md             (Full documentation)"
echo ""
