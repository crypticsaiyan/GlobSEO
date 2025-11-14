#!/bin/bash

# Test script for the new translation pipeline endpoint

echo "🧪 Testing GlobSEO Translation Pipeline Integration"
echo "=================================================="
echo ""

# Check if server is running
echo "1. Checking if server is running..."
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "   ✅ Server is running"
else
    echo "   ❌ Server is not running. Please start it with: cd backend && node server.js"
    exit 1
fi

echo ""
echo "2. Testing scrape-translate-score endpoint..."
echo "   URL: https://lingo.dev"
echo "   Languages: es, fr"
echo ""

# Make the API request
RESPONSE=$(curl -s -X POST http://localhost:3001/api/scrape-translate-score \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://lingo.dev",
    "languages": ["es", "fr"]
  }')

# Check if request was successful
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "   ✅ Request successful!"
    echo ""
    echo "3. Response summary:"
    
    # Extract and display key information
    URL=$(echo "$RESPONSE" | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)
    TITLE=$(echo "$RESPONSE" | grep -o '"title":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    echo "   • URL: $URL"
    echo "   • Original Title: $TITLE"
    
    # Check for translations
    if echo "$RESPONSE" | grep -q '"translations"'; then
        echo "   • Translations: Found"
        
        # Check for Spanish translation
        if echo "$RESPONSE" | grep -q '"es"'; then
            echo "     - Spanish (es): ✅"
        fi
        
        # Check for French translation
        if echo "$RESPONSE" | grep -q '"fr"'; then
            echo "     - French (fr): ✅"
        fi
    fi
    
    # Check for SEO score
    if echo "$RESPONSE" | grep -q '"seoScore"'; then
        TOTAL_SCORE=$(echo "$RESPONSE" | grep -o '"total_score":[0-9]*' | head -1 | cut -d':' -f2)
        echo "   • SEO Score: $TOTAL_SCORE/100"
    fi
    
    echo ""
    echo "✅ Integration test PASSED!"
    echo ""
    echo "Full response saved to: test-response.json"
    echo "$RESPONSE" | python3 -m json.tool > test-response.json 2>/dev/null || echo "$RESPONSE" > test-response.json
    
else
    echo "   ❌ Request failed!"
    echo ""
    echo "Error response:"
    echo "$RESPONSE"
    exit 1
fi

echo ""
echo "=================================================="
echo "Test complete! 🎉"
