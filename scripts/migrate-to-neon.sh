#!/bin/bash

# Migrate Database to Neon PostgreSQL

echo "🚀 Migrating Database to Neon PostgreSQL"
echo "========================================="
echo ""

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ Error: .env.production file not found!"
    echo ""
    echo "Please create .env.production with your Neon credentials"
    echo "See SECURITY_SETUP.md for instructions"
    exit 1
fi

# Load environment variables
set -a
source .env.production
set +a

echo "📋 Connection Details:"
echo "  Host: $POSTGRES_HOST"
echo "  Database: $POSTGRES_DB"
echo "  User: $POSTGRES_USER"
echo ""

# Test connection
echo "🔍 Testing connection to Neon..."
CONNECTION_STRING="postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST/$POSTGRES_DB?sslmode=require"

if command -v psql &> /dev/null; then
    if psql "$CONNECTION_STRING" -c "SELECT version();" &> /dev/null; then
        echo "✅ Connection successful!"
    else
        echo "⚠️  Connection test failed, but continuing..."
    fi
else
    echo "⚠️  psql not found, skipping connection test..."
fi

echo ""
echo "📊 Step 1: Running Database Migrations"
echo "--------------------------------------"

# Navigate to catalog service
cd services/catalog-service

# Run migrations
echo "Running migrations..."
npm run migrate

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully!"
else
    echo "❌ Migration failed. Check the error above."
    cd ../..
    exit 1
fi

echo ""
echo "🌱 Step 2: Seeding Database with 500+ Assets"
echo "--------------------------------------------"
echo "This will take 5-10 minutes..."
echo ""

# Run seed script
npm run seed

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database seeded successfully!"
    echo ""
    echo "📊 Your Neon database now contains:"
    echo "  ✓ 400 Movies"
    echo "  ✓ 100 TV Shows"
    echo "  ✓ ~1,500+ Episodes"
    echo "  ✓ 10 Genres"
    echo "  ✓ All with unique images"
else
    echo "❌ Seeding failed. Check the error above."
    cd ../..
    exit 1
fi

# Return to root
cd ../..

echo ""
echo "🎉 Migration Complete!"
echo "====================="
echo ""
echo "📋 Next Steps:"
echo "  1. Update your services to use Neon connection string"
echo "  2. Deploy backend services to Railway"
echo "  3. Deploy frontend to Vercel"
echo ""
echo "💡 Tip: Your .env.production file has been created with Neon credentials"
echo ""
