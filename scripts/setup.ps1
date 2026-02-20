# OTT Platform Setup Script for Windows
Write-Host "🎬 Setting up OTT Platform..." -ForegroundColor Cyan

# Check Node.js version
$nodeVersion = (node -v).Substring(1).Split('.')[0]
if ([int]$nodeVersion -lt 20) {
    Write-Host "❌ Node.js 20+ required. Current version: $(node -v)" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js version: $(node -v)" -ForegroundColor Green

# Check Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker not found. Please install Docker Desktop." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker found" -ForegroundColor Green

# Copy environment file
if (-not (Test-Path .env)) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✅ .env created" -ForegroundColor Green
} else {
    Write-Host "✅ .env already exists" -ForegroundColor Green
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Build shared packages
Write-Host "🔨 Building shared packages..." -ForegroundColor Yellow
npm run build --workspace=packages/shared
npm run build --workspace=packages/types

# Start Docker services
Write-Host "🐳 Starting Docker services..." -ForegroundColor Yellow
docker-compose up -d

Write-Host "⏳ Waiting for services to be ready (30 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Run migrations
Write-Host "🗄️ Running database migrations..." -ForegroundColor Yellow
npm run migrate

# Seed database
Write-Host "🌱 Seeding database with test content..." -ForegroundColor Yellow
npm run seed

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Start the platform with: npm run dev" -ForegroundColor Cyan
Write-Host "📚 Read QUICKSTART.md for next steps" -ForegroundColor Cyan
Write-Host ""
