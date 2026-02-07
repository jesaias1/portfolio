# 🚀 Deployment Guide

## Deploying to Vercel (Recommended)

Vercel is the easiest way to deploy your Next.js portfolio.

### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   Add these in Vercel dashboard:
   ```
   DATABASE_URL=your_production_database_url
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your_generated_secret
   ADMIN_EMAIL=your_admin_email
   ADMIN_PASSWORD=your_secure_password
   ```

   Generate NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your site
   - You'll get a URL like `your-portfolio.vercel.app`

5. **Setup Database**
   After first deployment, run:
   ```bash
   # Using Vercel CLI
   vercel env pull
   npx prisma migrate deploy
   npx prisma db seed
   ```

### Using a Production Database

For production, switch from SQLite to PostgreSQL:

1. **Get a PostgreSQL Database**
   - [Vercel Postgres](https://vercel.com/storage/postgres)
   - [Supabase](https://supabase.com) (Free tier available)
   - [Railway](https://railway.app)
   - [Neon](https://neon.tech)

2. **Update Prisma Schema**
   In `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // Changed from sqlite
     url      = env("DATABASE_URL")
   }
   ```

3. **Update Environment Variable**
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

4. **Deploy Changes**
   ```bash
   git add .
   git commit -m "Switch to PostgreSQL"
   git push
   ```

## Deploying to Other Platforms

### Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables
4. Note: Netlify requires a `netlify.toml` file for Next.js

### Railway

1. Connect GitHub repo
2. Add environment variables
3. Railway auto-detects Next.js
4. Includes free PostgreSQL database

### DigitalOcean App Platform

1. Create new app from GitHub
2. Select Node.js environment
3. Build: `npm run build`
4. Run: `npm start`
5. Add environment variables

## Post-Deployment Checklist

- [ ] Change admin credentials from defaults
- [ ] Test admin login
- [ ] Test all forms and features
- [ ] Add custom domain (optional)
- [ ] Enable SSL/HTTPS
- [ ] Setup database backups
- [ ] Configure monitoring
- [ ] Test on mobile devices
- [ ] Add Google Analytics (optional)
- [ ] Submit to search engines

## Security Best Practices

1. **Strong Passwords**
   - Use a password manager
   - Create unique, complex admin password
   - Change default credentials immediately

2. **Environment Variables**
   - Never commit `.env.local` to git
   - Use different secrets for production
   - Rotate secrets periodically

3. **Database Security**
   - Use SSL connections
   - Regular backups
   - Monitor access logs

4. **HTTPS**
   - Always use HTTPS in production
   - Enable HSTS headers
   - Use secure cookies

## Performance Optimization

1. **Images**
   - Use Next.js Image component
   - Optimize images before upload
   - Consider using a CDN

2. **Caching**
   - Enable ISR for static content
   - Use CDN caching
   - Configure browser caching

3. **Monitoring**
   - Setup Vercel Analytics
   - Monitor Core Web Vitals
   - Track error rates

## Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Verify all dependencies installed
- Check for TypeScript errors

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check database is accessible
- Ensure migrations are run

### Authentication Not Working
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Production](https://www.prisma.io/docs/guides/deployment)

---

Good luck with your deployment! 🎉
