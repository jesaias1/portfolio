#!/bin/bash

echo "🎨 Setting up your Portfolio..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

echo "✅ Prisma client generated"
echo ""

# Run migrations
echo "🗄️  Setting up database..."
npx prisma migrate dev --name init

if [ $? -ne 0 ]; then
    echo "❌ Failed to run migrations"
    exit 1
fi

echo "✅ Database setup complete"
echo ""

# Seed database
echo "🌱 Seeding database with sample data..."
npx ts-node prisma/seed.ts

if [ $? -ne 0 ]; then
    echo "❌ Failed to seed database"
    exit 1
fi

echo "✅ Database seeded successfully"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "📝 Admin credentials:"
echo "   Email: admin@portfolio.com"
echo "   Password: admin123"
echo ""
echo "⚠️  IMPORTANT: Change these credentials before deploying to production!"
echo ""
echo "🚀 To start the development server:"
echo "   npm run dev"
echo ""
echo "🌐 Your portfolio will be available at:"
echo "   Portfolio: http://localhost:3000"
echo "   Admin: http://localhost:3000/admin/login"
echo ""
