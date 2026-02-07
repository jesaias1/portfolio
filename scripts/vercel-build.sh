#!/bin/bash

echo "🔧 Running Vercel build script..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Run migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Seed database (only if fresh)
echo "🌱 Checking if database needs seeding..."
npx ts-node -e "
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    console.log('No users found, running seed...');
    process.exit(0);
  } else {
    console.log('Database already seeded, skipping...');
    process.exit(1);
  }
}

check();
"

if [ $? -eq 0 ]; then
  echo "🌱 Seeding database..."
  npx ts-node prisma/seed.ts
fi

echo "✅ Build script complete!"
