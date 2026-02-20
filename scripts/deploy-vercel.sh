#!/bin/bash

# OTT Platform - Vercel Deployment Script

echo "🚀 OTT Platform - Vercel Deployment"
echo "===================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "✅ Vercel CLI found"
echo ""

# Login to Vercel
echo "📝 Logging in to Vercel..."
vercel login

echo ""
echo "🔧 Deployment Configuration:"
echo "  - Frontend: Vercel"
echo "  - Backend: Railway (manual setup required)"
echo "  - Databases: Managed services (manual setup required)"
echo ""

# Ask for API Gateway URL
read -p "Enter your Railway API Gateway URL (or press Enter to skip): " API_URL

if [ -z "$API_URL" ]; then
    echo "⚠️  No API URL provided. Using placeholder."
    echo "   You'll need to update vercel.json after deployment."
else
    # Update vercel.json with actual API URL
    sed -i "s|https://your-api-gateway-url.railway.app|$API_URL|g" vercel.json
    echo "✅ Updated vercel.json with API URL"
fi

echo ""
echo "🚀 Deploying to Vercel..."
echo ""

# Deploy to Vercel
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next Steps:"
echo "  1. Set up backend services on Railway (see docs/VERCEL_DEPLOYMENT.md)"
echo "  2. Configure managed databases (Neon, MongoDB Atlas, Upstash)"
echo "  3. Update API Gateway URL in Vercel dashboard"
echo "  4. Test your deployment"
echo ""
echo "📚 Full guide: docs/VERCEL_DEPLOYMENT.md"
echo ""
