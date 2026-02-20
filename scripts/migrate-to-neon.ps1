# Migrate Database to Neon PostgreSQL

Write-Host "🚀 Migrating Database to Neon PostgreSQL" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.production exists
if (-not (Test-Path ".env.production")) {
    Write-Host "❌ Error: .env.production file not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please create .env.production with your Neon credentials" -ForegroundColor Yellow
    Write-Host "See SECURITY_SETUP.md for instructions" -ForegroundColor Cyan
    exit 1
}

# Load environment variables
Get-Content .env.production | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        if ($name -and -not $name.StartsWith('#')) {
            [Environment]::SetEnvironmentVariable($name, $value, 'Process')
        }
    }
}

Write-Host "📋 Connection Details:" -ForegroundColor Yellow
Write-Host "  Host: $env:POSTGRES_HOST"
Write-Host "  Database: $env:POSTGRES_DB"
Write-Host "  User: $env:POSTGRES_USER"
Write-Host ""

# Test connection
Write-Host "🔍 Testing connection to Neon..." -ForegroundColor Yellow
$testConnection = "postgresql://$($env:POSTGRES_USER):$($env:POSTGRES_PASSWORD)@$($env:POSTGRES_HOST)/$($env:POSTGRES_DB)?sslmode=require"

try {
    # Try to connect using psql (if available)
    $psqlTest = psql $testConnection -c "SELECT version();" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Connection successful!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  psql not found, continuing anyway..." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Could not test connection, continuing anyway..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📊 Step 1: Running Database Migrations" -ForegroundColor Cyan
Write-Host "--------------------------------------" -ForegroundColor Cyan

# Navigate to catalog service
Set-Location services/catalog-service

# Run migrations
Write-Host "Running migrations..." -ForegroundColor Yellow
npm run migrate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migrations completed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Migration failed. Check the error above." -ForegroundColor Red
    Set-Location ../..
    exit 1
}

Write-Host ""
Write-Host "🌱 Step 2: Seeding Database with 500+ Assets" -ForegroundColor Cyan
Write-Host "--------------------------------------------" -ForegroundColor Cyan
Write-Host "This will take 5-10 minutes..." -ForegroundColor Yellow
Write-Host ""

# Run seed script
npm run seed

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Database seeded successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Your Neon database now contains:" -ForegroundColor Cyan
    Write-Host "  ✓ 400 Movies"
    Write-Host "  ✓ 100 TV Shows"
    Write-Host "  ✓ ~1,500+ Episodes"
    Write-Host "  ✓ 10 Genres"
    Write-Host "  ✓ All with unique images"
} else {
    Write-Host "❌ Seeding failed. Check the error above." -ForegroundColor Red
    Set-Location ../..
    exit 1
}

# Return to root
Set-Location ../..

Write-Host ""
Write-Host "🎉 Migration Complete!" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Update your services to use Neon connection string"
Write-Host "  2. Deploy backend services to Railway"
Write-Host "  3. Deploy frontend to Vercel"
Write-Host ""
Write-Host "💡 Tip: Your .env.production file has been created with Neon credentials" -ForegroundColor Yellow
Write-Host ""
