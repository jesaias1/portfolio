Write-Host "🚀 AUTOMATIC PORTFOLIO DEPLOYMENT" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
try {
    git --version | Out-Null
} catch {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host "📝 Step 1: Setting up Git repository" -ForegroundColor Blue
git init
git add .
git commit -m "Initial deployment - Ultimate Portfolio"

Write-Host ""
Write-Host "⚠️  IMPORTANT: You need to do these steps manually:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  CREATE GITHUB REPOSITORY:" -ForegroundColor White
Write-Host "   - Go to: https://github.com/new" -ForegroundColor Gray
Write-Host "   - Repository name: portfolio" -ForegroundColor Gray
Write-Host "   - Make it Public" -ForegroundColor Gray
Write-Host "   - DON'T initialize with README" -ForegroundColor Gray
Write-Host "   - Click 'Create repository'" -ForegroundColor Gray
Write-Host ""
Write-Host "2️⃣  RUN THESE COMMANDS (copy from GitHub):" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""

$github = Read-Host "Have you created the GitHub repo? (y/n)"
if ($github -ne "y") {
    Write-Host "Please create the GitHub repo first, then run this script again." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Now run these commands:" -ForegroundColor Cyan
Write-Host "git remote add origin https://github.com/YOUR_USERNAME/portfolio.git" -ForegroundColor White
Write-Host "git branch -M main" -ForegroundColor White
Write-Host "git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "Replace YOUR_USERNAME with your actual GitHub username" -ForegroundColor Yellow
Write-Host ""

$pushed = Read-Host "Have you pushed to GitHub? (y/n)"
if ($pushed -ne "y") {
    Write-Host "Please push to GitHub first." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "✅ Code pushed to GitHub!" -ForegroundColor Green
Write-Host ""

# Check if vercel CLI is installed
try {
    vercel --version | Out-Null
} catch {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host ""
Write-Host "3️⃣  DEPLOY TO VERCEL:" -ForegroundColor Blue
Write-Host "   - You'll be asked to login (opens browser)" -ForegroundColor Gray
Write-Host "   - Select your GitHub account" -ForegroundColor Gray
Write-Host "   - Choose project settings (just press Enter for defaults)" -ForegroundColor Gray
Write-Host ""
$deploy = Read-Host "Press ENTER to start Vercel deployment..."

vercel

Write-Host ""
Write-Host "✅ Deployment initiated!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  FINAL STEP - Add Environment Variables:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to your Vercel dashboard" -ForegroundColor White
Write-Host "2. Click on your project" -ForegroundColor White
Write-Host "3. Go to Settings → Environment Variables" -ForegroundColor White
Write-Host "4. Add these variables:" -ForegroundColor White
Write-Host ""
Write-Host "   NEXTAUTH_SECRET = [Generate at: https://generate-secret.vercel.app/32]" -ForegroundColor Cyan
Write-Host "   NEXTAUTH_URL = https://your-project-name.vercel.app" -ForegroundColor Cyan
Write-Host "   ADMIN_EMAIL = lin4s@live.dk" -ForegroundColor Cyan
Write-Host "   ADMIN_PASSWORD = miebs112" -ForegroundColor Cyan
Write-Host "   DATABASE_URL = file:./dev.db" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. After adding variables, redeploy:" -ForegroundColor White
Write-Host "   - Deployments tab → ... menu → Redeploy" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 YOUR PORTFOLIO WILL BE LIVE IN ~2 MINUTES!" -ForegroundColor Green
Write-Host ""
Write-Host "Access it at: https://your-project-name.vercel.app" -ForegroundColor Cyan
Write-Host "Admin panel: https://your-project-name.vercel.app/admin/login" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
