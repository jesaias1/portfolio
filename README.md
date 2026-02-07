# ✨ Modern Portfolio with Admin Dashboard

A stunning, fully-featured portfolio website with an admin panel for easy content management. Built with Next.js 15, Framer Motion, and Prisma.

## 🚀 **QUICK DEPLOY TO VERCEL** 

See **[INSTANT-DEPLOY.md](./INSTANT-DEPLOY.md)** for fastest deployment (2 minutes)!

Or follow **[DEPLOY.md](./DEPLOY.md)** for detailed step-by-step guide.

### ⚡ Super Quick Start:
```bash
# 1. Push to GitHub
git init && git add . && git commit -m "Deploy"
gh repo create portfolio --public --source=. --push

# 2. Deploy to Vercel
npm i -g vercel
vercel
```
Done! 🎉

---

## 🎨 Features

### Portfolio Features
- **Smooth Animations**: Powered by Framer Motion with scroll-triggered effects
- **Modern Design**: Dark theme with amber accents and glass morphism effects
- **Responsive**: Mobile-first design that looks great on all devices
- **Performance Optimized**: Fast loading with optimized images and fonts

### Admin Dashboard
- **Secure Authentication**: Login system with NextAuth
- **Content Management**: Edit projects, about section, and contact info
- **Real-time Updates**: Changes reflect immediately on the portfolio
- **Intuitive Interface**: Clean, easy-to-use admin panel

### Sections
- **Hero**: Eye-catching landing section with animated elements
- **About**: Personal introduction with skills showcase
- **Projects**: Grid display of your work with filters and tags
- **Contact**: Contact form with social media links

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Setup Database**
```bash
# Generate Prisma client
npx prisma generate

# Create database and run migrations
npx prisma migrate dev --name init

# Seed database with sample data
npx ts-node prisma/seed.ts
```

3. **Configure Environment**
The `.env.local` file is already set up with default values:
- **Admin Email**: admin@portfolio.com
- **Admin Password**: admin123
- **⚠️ IMPORTANT**: Change these credentials before deploying to production!

4. **Start Development Server**
```bash
npm run dev
```

5. **Open Your Browser**
- Portfolio: http://localhost:3000
- Admin Login: http://localhost:3000/admin/login

## 🎯 Usage

### Accessing Admin Panel

1. Go to http://localhost:3000/admin/login
2. Login with:
   - Email: `admin@portfolio.com`
   - Password: `admin123`
3. You'll be redirected to the dashboard

### Managing Content

#### Projects
- View all projects in the dashboard
- Add new projects with images, descriptions, and tags
- Edit or delete existing projects
- Reorder projects by changing the order value

#### About Section
- Update your bio and professional title
- Add or remove skills
- Change profile image

#### Contact Info
- Update email address
- Add social media links (GitHub, LinkedIn, Twitter)
- All changes update immediately on the portfolio

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS with custom animations
- **Animations**: Framer Motion
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **TypeScript**: Full type safety
- **Icons**: React Icons
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
portfolio-app/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Sample data
├── src/
│   ├── app/
│   │   ├── admin/             # Admin panel pages
│   │   ├── api/               # API routes
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── Navigation.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   └── Contact.tsx
│   └── lib/
│       ├── prisma.ts          # Database client
│       └── auth.ts            # Auth configuration
├── .env.local                 # Environment variables
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🎨 Customization

### Colors
Edit the CSS variables in `src/app/globals.css`:
```css
:root {
  --accent: #f59e0b;          /* Main accent color */
  --accent-glow: rgba(245, 158, 11, 0.3);
  --background: #0a0a0a;      /* Background color */
  --foreground: #fafafa;      /* Text color */
}
```

### Fonts
The portfolio uses:
- **Display**: Playfair Display (headings)
- **Body**: Work Sans (text)

Change fonts in `src/app/layout.tsx`

### Animations
Customize animations in:
- `tailwind.config.ts` - Keyframes and animation utilities
- `src/app/globals.css` - Custom CSS animations
- Component files - Framer Motion variants

## 🔒 Security

### Before Production Deployment

1. **Change Admin Credentials**
   - Update `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local`
   - Use a strong, unique password

2. **Update NextAuth Secret**
   - Generate a new secret: `openssl rand -base64 32`
   - Update `NEXTAUTH_SECRET` in `.env.local`

3. **Database**
   - For production, consider PostgreSQL or MySQL
   - Update `DATABASE_URL` in `.env.local`
   - Update provider in `prisma/schema.prisma`

4. **Environment Variables**
   - Never commit `.env.local` to version control
   - Set environment variables in your deployment platform

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

1. Build the project:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database
npx prisma migrate reset

# Regenerate Prisma client
npx prisma generate
```

### Authentication Issues
- Clear browser cookies
- Check `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your domain

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 💡 Tips

- Add your own images to make the portfolio unique
- Customize the color scheme to match your brand
- Add more sections like testimonials or blog posts
- Integrate analytics to track visitors
- Add a resume download feature

## 📧 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and Framer Motion
