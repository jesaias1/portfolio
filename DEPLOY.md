# 🚀 Deploy to GitHub & Vercel - Step by Step

## 📋 Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com with your GitHub)
- Git installed on your computer

## 🎯 Quick Deploy (5 minutes)

### Step 1: Prepare Your Project

1. **Extract the portfolio-ultimate.zip** to a folder on your computer
2. **Open Terminal/PowerShell** in that folder
3. **Initialize Git:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Ultimate Portfolio"
   ```

### Step 2: Push to GitHub

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it: `portfolio` (or whatever you want)
   - **Don't** initialize with README, gitignore, or license
   - Click "Create repository"

2. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
   git branch -M main
   git push -u origin main
   ```
   
   Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3: Deploy to Vercel

1. **Go to Vercel:** https://vercel.com
2. **Click "Add New Project"**
3. **Import your GitHub repository** (it should appear in the list)
4. **Configure the project:**
   - Framework Preset: **Next.js** (should auto-detect)
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)

5. **Add Environment Variables** (IMPORTANT):
   Click "Environment Variables" and add these:

   ```
   DATABASE_URL=file:./dev.db
   NEXTAUTH_URL=https://your-project-name.vercel.app
   NEXTAUTH_SECRET=generate-a-secret-key-here
   ADMIN_EMAIL=lin4s@live.dk
   ADMIN_PASSWORD=miebs112
   ```

   **To generate NEXTAUTH_SECRET:**
   - Open Terminal and run: `openssl rand -base64 32`
   - Or use: https://generate-secret.vercel.app/32
   - Copy the generated string

   **For NEXTAUTH_URL:**
   - Use your Vercel project URL (you'll get this after first deploy)
   - Format: `https://your-project-name.vercel.app`

6. **Click "Deploy"** 🚀

### Step 4: Important Post-Deployment Steps

⚠️ **CRITICAL**: After first deployment, you need to setup the database:

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Link your project:**
   ```bash
   vercel link
   ```

4. **Setup database (run these commands):**
   ```bash
   vercel env pull .env.local
   npx prisma generate
   npx prisma migrate deploy
   npx ts-node prisma/seed.ts
   ```

5. **Redeploy:**
   ```bash
   vercel --prod
   ```

## 🎨 Your Live Portfolio

After deployment completes:
- **Portfolio URL:** `https://your-project-name.vercel.app`
- **Admin Login:** `https://your-project-name.vercel.app/admin/login`
- **Credentials:** `lin4s@live.dk` / `miebs112`

## 🔄 Making Updates

Every time you want to update your portfolio:

```bash
# Make your changes locally
git add .
git commit -m "Update description here"
git push
```

Vercel will **automatically deploy** your changes! 🎉

## ⚙️ Using a Production Database (Recommended)

For a live site, you should use a real database instead of SQLite:

### Option 1: Vercel Postgres (Easiest)

1. In Vercel Dashboard → Your Project → Storage → Create Database
2. Choose "Postgres"
3. Copy the `POSTGRES_PRISMA_URL` connection string
4. Update your environment variables:
   ```
   DATABASE_URL=your_postgres_connection_string
   ```
5. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
6. Push changes and Vercel will auto-deploy

### Option 2: Free Alternatives

- **Neon** (https://neon.tech) - Free PostgreSQL
- **Supabase** (https://supabase.com) - Free PostgreSQL + more
- **Railway** (https://railway.app) - Free tier available

## 🐛 Troubleshooting

### Build fails with "Cannot find module"
```bash
# Make sure all dependencies are installed
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### Database errors
```bash
# Regenerate Prisma client
npx prisma generate
git add .
git commit -m "Regenerate Prisma client"
git push
```

### Environment variables not working
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Make sure all variables are added for "Production"
3. Redeploy: Settings → Deployments → ... → Redeploy

### Admin login not working
1. Check your environment variables are correct
2. Make sure NEXTAUTH_URL matches your actual domain
3. Run the seed script again to recreate admin user

## 📝 Custom Domain (Optional)

Want a custom domain like `yourname.com`?

1. Buy a domain (Namecheap, GoDaddy, etc.)
2. In Vercel: Project → Settings → Domains
3. Add your domain and follow DNS instructions
4. Update NEXTAUTH_URL to your custom domain

## 🎯 Quick Commands Reference

```bash
# Local development
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Pull environment variables
vercel env pull

# Add environment variable
vercel env add VARIABLE_NAME
```

## 🔒 Security Checklist

Before going live:
- ✅ Change ADMIN_PASSWORD from default
- ✅ Use a strong NEXTAUTH_SECRET
- ✅ Use production database (not SQLite)
- ✅ Enable 2FA on GitHub and Vercel
- ✅ Don't commit .env.local to GitHub (it's in .gitignore)

## 💡 Pro Tips

1. **Preview Deployments**: Every push to a branch creates a preview URL
2. **Environment per Branch**: Set different env vars for preview/production
3. **Analytics**: Enable Vercel Analytics for free visitor tracking
4. **Speed Insights**: Enable Vercel Speed Insights to monitor performance
5. **Edge Functions**: Your site runs on Vercel's global edge network (fast!)

## 🆘 Need Help?

If you get stuck:
1. Check Vercel deployment logs
2. Look at the build output for errors
3. Verify all environment variables are set
4. Make sure prisma/schema.prisma matches your database
5. Check GitHub Actions if you have them enabled

---

## 🎉 That's It!

Your portfolio is now live and automatically deploys on every push to GitHub!

Share your URL: `https://your-project-name.vercel.app` 🚀
