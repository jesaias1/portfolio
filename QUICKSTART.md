# 🚀 Quick Start Guide

Get your portfolio running in 3 minutes!

## Method 1: Automated Setup (Recommended)

```bash
# Run the setup script
./setup.sh

# Start development server
npm run dev
```

That's it! Open http://localhost:3000 in your browser.

## Method 2: Manual Setup

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Setup database
npx prisma migrate dev --name init

# 4. Seed with sample data
npx ts-node prisma/seed.ts

# 5. Start development
npm run dev
```

## 🔐 Admin Access

- **URL**: http://localhost:3000/admin/login
- **Email**: admin@portfolio.com
- **Password**: admin123

⚠️ **Change these credentials in `.env.local` before production!**

## 🎨 First Steps

1. **Login to Admin Panel** - Access the dashboard at `/admin/login`
2. **Update About Section** - Add your bio and skills
3. **Add Your Projects** - Upload your work with images and descriptions
4. **Update Contact Info** - Add your email and social links
5. **Customize Colors** - Edit `src/app/globals.css` to match your brand

## 📱 What You Get

- ✅ Fully responsive portfolio
- ✅ Smooth animations and transitions
- ✅ Admin dashboard for content management
- ✅ Project showcase with filtering
- ✅ Contact form
- ✅ SEO optimized
- ✅ Dark theme with custom colors

## 🆘 Need Help?

Check the main README.md for detailed documentation, troubleshooting, and customization options.

## 🎯 Next Steps

1. Replace sample images with your own
2. Customize the color scheme
3. Add your real projects and information
4. Deploy to Vercel or your preferred platform

Happy building! 🎉
