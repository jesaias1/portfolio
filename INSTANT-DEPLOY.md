# ⚡ INSTANT DEPLOY TO VERCEL

## 🚀 Fastest Way (2 minutes)

### Prerequisites
- GitHub account
- Vercel account (sign up with GitHub at vercel.com)

### Steps:

#### 1. Push to GitHub (1 minute)

Open Terminal in the portfolio folder and run:

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create portfolio --public --source=. --push
```

Don't have `gh` CLI? Use this instead:
```bash
git init
git add .
git commit -m "Initial commit"
# Then go to github.com/new, create repo, and follow the commands shown
```

#### 2. Deploy to Vercel (1 minute)

**Option A - Using Vercel CLI (Fastest):**
```bash
npm i -g vercel
vercel login
vercel
```
Follow the prompts, and you're done! ✅

**Option B - Using Vercel Dashboard:**
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repo
4. Click "Deploy"

#### 3. Set Environment Variables

After first deploy, add these in Vercel Dashboard → Settings → Environment Variables:

```env
NEXTAUTH_SECRET=
```
Generate one here: https://generate-secret.vercel.app/32

```env
NEXTAUTH_URL=https://your-project.vercel.app
```
(Use your actual Vercel URL)

Then redeploy!

---

## 🎯 Your Live Site

- **Portfolio:** `https://your-project.vercel.app`
- **Admin:** `https://your-project.vercel.app/admin/login`
- **Login:** `lin4s@live.dk` / `miebs112`

---

## 📝 Environment Variables (Complete List)

Set these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `file:./dev.db` | SQLite database (for testing) |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` | Your Vercel URL |
| `NEXTAUTH_SECRET` | Generated 32-char string | Auth secret key |
| `ADMIN_EMAIL` | `lin4s@live.dk` | Your admin email |
| `ADMIN_PASSWORD` | `miebs112` | Your admin password |

---

## 🔄 Automatic Deployments

Every time you push to GitHub, Vercel automatically deploys! 🎉

```bash
# Make changes
git add .
git commit -m "Your update message"
git push
```

---

## 🗄️ Using a Real Database (Production)

SQLite (`file:./dev.db`) works for testing but isn't persistent on Vercel. For production:

### Recommended: Vercel Postgres

1. In Vercel Dashboard → Storage → Create Database
2. Select "Postgres"
3. Copy the `POSTGRES_PRISMA_URL`
4. Update environment variables:
   - `DATABASE_URL` = your postgres URL
5. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
6. Push changes - Vercel will auto-deploy!

### Free Alternatives:
- **Neon** (https://neon.tech) - Serverless Postgres
- **Supabase** (https://supabase.com) - Free tier
- **Railway** (https://railway.app) - Easy setup

---

## 🎨 See It Live

After deployment:
1. Open your Vercel URL
2. See your portfolio live! 🚀
3. Go to `/admin/login` to edit content
4. Changes reflect immediately

---

## 💡 Pro Tips

**Development:**
```bash
npm run dev
```

**Check deployment:**
```bash
vercel ls
```

**View logs:**
```bash
vercel logs
```

**Force redeploy:**
```bash
vercel --prod --force
```

---

## ⚡ One-Line Deploy

If you have Vercel CLI installed:

```bash
git init && git add . && git commit -m "Deploy" && vercel
```

Done! Your site is live! 🎉

---

## 🆘 Common Issues

**"Cannot connect to database"**
- Use a real database (Vercel Postgres, Neon, Supabase)
- SQLite doesn't persist on Vercel

**"NEXTAUTH_SECRET is not set"**
- Add it in Vercel Environment Variables
- Generate: `openssl rand -base64 32`

**"Admin login not working"**
- Check NEXTAUTH_URL matches your domain
- Verify ADMIN_EMAIL and ADMIN_PASSWORD are set
- Redeploy after changing env vars

**Build fails**
- Check build logs in Vercel
- Run `npm run build` locally first
- Make sure all dependencies are in package.json

---

## 📱 Share Your Portfolio

Once deployed, share your link:
- Portfolio: `https://your-name.vercel.app`
- LinkedIn, Resume, GitHub profile
- Business cards
- Email signature

Want a custom domain? Vercel makes it easy:
1. Buy domain anywhere
2. Vercel → Settings → Domains
3. Follow DNS instructions
4. Done! ✅

---

# 🎉 You're Live!

Your portfolio is now:
- ✅ Hosted on Vercel (Fast, Global CDN)
- ✅ Auto-deploying from GitHub
- ✅ Fully editable via admin panel
- ✅ Production-ready

**Now go create amazing projects to showcase!** 🚀
