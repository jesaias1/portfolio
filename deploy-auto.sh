#!/bin/bash

echo "🚀 AUTOMATIC PORTFOLIO DEPLOYMENT"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed. Please install Git first.${NC}"
    exit 1
fi

echo -e "${BLUE}📝 Step 1: Setting up Git repository${NC}"
git init
git add .
git commit -m "Initial deployment - Ultimate Portfolio"

echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: You need to do these steps manually:${NC}"
echo ""
echo "1️⃣  CREATE GITHUB REPOSITORY:"
echo "   - Go to: https://github.com/new"
echo "   - Repository name: portfolio"
echo "   - Make it Public"
echo "   - DON'T initialize with README"
echo "   - Click 'Create repository'"
echo ""
echo "2️⃣  COPY THE COMMANDS from GitHub and paste them here"
echo "   They will look like:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
read -p "Press ENTER when you've created the repo and are ready to paste the commands..."

echo ""
echo -e "${BLUE}Now paste the commands from GitHub (usually 3 lines):${NC}"
bash

echo ""
echo -e "${GREEN}✅ Code pushed to GitHub!${NC}"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

echo ""
echo -e "${BLUE}3️⃣  DEPLOY TO VERCEL:${NC}"
echo "   - You'll be asked to login (opens browser)"
echo "   - Select your GitHub account"
echo "   - Choose project settings (just press Enter for defaults)"
echo ""
read -p "Press ENTER to start Vercel deployment..."

vercel

echo ""
echo -e "${GREEN}✅ Deployment initiated!${NC}"
echo ""
echo -e "${YELLOW}⚠️  FINAL STEP - Add Environment Variables:${NC}"
echo ""
echo "1. Go to your Vercel dashboard"
echo "2. Click on your project"
echo "3. Go to Settings → Environment Variables"
echo "4. Add these variables:"
echo ""
echo "   NEXTAUTH_SECRET = [Click here to generate: https://generate-secret.vercel.app/32]"
echo "   NEXTAUTH_URL = https://your-project-name.vercel.app"
echo "   ADMIN_EMAIL = your admin email"
echo "   ADMIN_PASSWORD = a long unique password"
echo "   DATABASE_URL = your PostgreSQL connection string"
echo ""
echo "5. After adding variables, redeploy:"
echo "   - Deployments tab → ... menu → Redeploy"
echo ""
echo -e "${GREEN}🎉 YOUR PORTFOLIO WILL BE LIVE IN ~2 MINUTES!${NC}"
echo ""
echo "Access it at: https://your-project-name.vercel.app"
echo "Admin panel: https://your-project-name.vercel.app/admin/login"
echo ""
