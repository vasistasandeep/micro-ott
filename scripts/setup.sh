#!/bin/bash

# OTT Platform Setup Script
echo "🎬 Setting up OTT Platform..."

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js 20+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker Desktop."
    exit 1
fi

echo "✅ Docker found"

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env created"
else
    echo "✅ .env already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build shared packages
echo "🔨 Building shared packages..."
npm run build --workspace=packages/shared
npm run build --workspace=packages/types

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d

echo "⏳ Waiting for services to be ready (30 seconds)..."
sleep 30

# Run migrations
echo "🗄️ Running database migrations..."
npm run migrate

# Seed database
echo "🌱 Seeding database with test content..."
npm run seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Start the platform with: npm run dev"
echo "📚 Read QUICKSTART.md for next steps"
echo ""
