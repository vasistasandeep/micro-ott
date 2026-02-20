# OTT Platform - Vercel Deployment Script (PowerShell)

Write-Host "🚀 OTT Platform - Vercel Deployment" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed" -ForegroundColor Green
} else {
    Write-Host "✅ Vercel CLI found" -ForegroundColor Green
}

Write-Host ""

# Login to Vercel
Write-Host "📝 Logging in to Vercel..." -ForegroundColor Yellow
vercel login

Write-Host ""
Write-Host "🔧 Deployment Configuration:" -ForegroundColor Cyan
Write-Host "  - Frontend: Vercel"
Write-Host "  - Backend: Railway (manual setup required)"
Write-Host "  - Databases: Managed services (manual setup required)"
Write-Host ""

# Ask for API Gateway URL
$apiUrl = Read-Host "Enter your Railway API Gateway URL (or press Enter to skip)"

if ([string]::IsNullOrWhiteSpace($apiUrl)) {
    Write-Host "⚠️  No API URL provided. Using placeholder." -ForegroundColor Yellow
    Write-Host "   You'll need to update vercel.json after deployment."
} else {
    # Update vercel.json with actual API URL
    $vercelJson = Get-Content "vercel.json" -Raw
    $vercelJson = $vercelJson -replace "https://your-api-gateway-url.railway.app", $apiUrl
    Set-Content "vercel.json" -Value $vercelJson
    Write-Host "✅ Updated vercel.json with API URL" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
Write-Host ""

# Deploy to Vercel
vercel --prod

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Set up backend services on Railway (see docs/VERCEL_DEPLOYMENT.md)"
Write-Host "  2. Configure managed databases (Neon, MongoDB Atlas, Upstash)"
Write-Host "  3. Update API Gateway URL in Vercel dashboard"
Write-Host "  4. Test your deployment"
Write-Host ""
Write-Host "📚 Full guide: docs/VERCEL_DEPLOYMENT.md" -ForegroundColor Yellow
Write-Host ""
