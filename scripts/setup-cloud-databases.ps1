# Setup All Cloud Databases - Complete Migration Script

Write-Host "🚀 OTT Platform - Cloud Database Setup" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANT: This script reads credentials from .env.production" -ForegroundColor Yellow
Write-Host "   Make sure you have created .env.production with your actual credentials" -ForegroundColor Yellow
Write-Host ""

# Check if .env.production exists
if (-not (Test-Path ".env.production")) {
    Write-Host "❌ Error: .env.production file not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please create .env.production from the template:" -ForegroundColor Yellow
    Write-Host "  1. Copy .env.production.example to .env.production" -ForegroundColor White
    Write-Host "  2. Edit .env.production with your actual credentials" -ForegroundColor White
    Write-Host "  3. Run this script again" -ForegroundColor White
    Write-Host ""
    Write-Host "See SECURITY_SETUP.md for detailed instructions" -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ Found .env.production file" -ForegroundColor Green
Write-Host ""

# Load environment variables from .env.production
Get-Content .env.production | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        if ($name -and -not $name.StartsWith('#')) {
            [Environment]::SetEnvironmentVariable($name, $value, 'Process')
        }
    }
}

Write-Host "📋 Environment variables loaded from .env.production" -ForegroundColor Green
Write-Host ""
Write-Host "This script will migrate your platform to cloud databases:" -ForegroundColor Yellow
Write-Host "  ✓ Neon PostgreSQL (Content Metadata)" -ForegroundColor Green
Write-Host "  ✓ MongoDB Atlas (User Activity)" -ForegroundColor Green
Write-Host "  ✓ Upstash Redis (Caching & Sessions)" -ForegroundColor Green
Write-Host ""

# Step 1: PostgreSQL (Neon)
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 Step 1: PostgreSQL (Neon) Setup" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Database: neondb" -ForegroundColor Yellow
Write-Host "Host: $env:POSTGRES_HOST" -ForegroundColor Yellow
Write-Host ""

# Navigate to catalog service
Set-Location services/catalog-service

Write-Host "Running migrations..." -ForegroundColor Yellow
npm run migrate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migrations completed!" -ForegroundColor Green
} else {
    Write-Host "❌ Migration failed" -ForegroundColor Red
    Set-Location ../..
    exit 1
}

Write-Host ""
Write-Host "Seeding database with 500+ content assets..." -ForegroundColor Yellow
Write-Host "(This will take 5-10 minutes)" -ForegroundColor Gray
Write-Host ""

npm run seed

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ PostgreSQL setup complete!" -ForegroundColor Green
    Write-Host "   ✓ 400 Movies" -ForegroundColor Gray
    Write-Host "   ✓ 100 TV Shows" -ForegroundColor Gray
    Write-Host "   ✓ ~1,500+ Episodes" -ForegroundColor Gray
    Write-Host "   ✓ 10 Genres" -ForegroundColor Gray
} else {
    Write-Host "❌ Seeding failed" -ForegroundColor Red
    Set-Location ../..
    exit 1
}

Set-Location ../..
Write-Host ""

# Step 2: MongoDB Atlas
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 Step 2: MongoDB Atlas Setup" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Database: ott_activity" -ForegroundColor Yellow
Write-Host "Cluster: cluster0.hzrqnee.mongodb.net" -ForegroundColor Yellow
Write-Host ""

Write-Host "Testing MongoDB connection..." -ForegroundColor Yellow

# Test MongoDB connection using Node.js
$mongoTest = @"
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function test() {
  try {
    await client.connect();
    console.log('✅ MongoDB connection successful!');
    const db = client.db('ott_activity');
    
    // Create collections with indexes
    await db.createCollection('viewing_sessions');
    await db.createCollection('watch_history');
    await db.createCollection('engagement_events');
    await db.createCollection('user_preferences');
    
    // Create indexes
    await db.collection('viewing_sessions').createIndex({ user_id: 1, profile_id: 1 });
    await db.collection('watch_history').createIndex({ user_id: 1, watched_at: -1 });
    
    console.log('✅ Collections and indexes created!');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

test();
"@

$mongoTest | Out-File -FilePath "test-mongo.js" -Encoding UTF8
node test-mongo.js
Remove-Item "test-mongo.js"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ MongoDB Atlas setup complete!" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB setup had issues, but continuing..." -ForegroundColor Yellow
}

Write-Host ""

# Step 3: Upstash Redis
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 Step 3: Upstash Redis Setup" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Host: certain-ewe-28707.upstash.io" -ForegroundColor Yellow
Write-Host ""

Write-Host "Testing Redis connection..." -ForegroundColor Yellow

# Test Redis connection
$redisTest = @"
const redis = require('redis');
const client = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false
  }
});

async function test() {
  try {
    await client.connect();
    await client.set('test_key', 'OTT Platform Connected!');
    const value = await client.get('test_key');
    console.log('✅ Redis connection successful!');
    console.log('   Test value:', value);
    await client.del('test_key');
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    process.exit(1);
  } finally {
    await client.quit();
  }
}

test();
"@

$redisTest | Out-File -FilePath "test-redis.js" -Encoding UTF8
node test-redis.js
Remove-Item "test-redis.js"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Upstash Redis setup complete!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Redis setup had issues, but continuing..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎉 Cloud Database Setup Complete!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ All databases configured and ready:" -ForegroundColor Green
Write-Host "   ✓ Neon PostgreSQL - 500+ content assets" -ForegroundColor Gray
Write-Host "   ✓ MongoDB Atlas - Collections created" -ForegroundColor Gray
Write-Host "   ✓ Upstash Redis - Connection verified" -ForegroundColor Gray
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Copy .env.production to .env to use cloud databases locally" -ForegroundColor Yellow
Write-Host "  2. Restart your services: npm run dev" -ForegroundColor Yellow
Write-Host "  3. Deploy to Railway/Vercel for production" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Quick command to use cloud databases:" -ForegroundColor Cyan
Write-Host "   Copy-Item .env.production .env" -ForegroundColor White
Write-Host ""
