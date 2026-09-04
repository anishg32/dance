# Natya Kshethram Bharatanatyam Academy

A premium, production-ready full-stack application built for a classical Indian dance academy.

## Tech Stack
* **Framework**: Next.js 15 (App Router)
* **Database**: PostgreSQL (via Prisma ORM)
* **Authentication**: Auth.js (NextAuth)
* **Styling**: Vanilla CSS Modules (no Tailwind)
* **Animations**: Framer Motion

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file based on `.env.example`:
   ```env
   # PostgreSQL Database (e.g. Neon, Supabase)
   DATABASE_URL="postgresql://user:password@host:5432/db"
   
   # Auth Secret (generate with `npx auth secret` or `openssl rand -base64 32`)
   AUTH_SECRET="your-secure-secret"
   
   # Public URL (for production)
   NEXTAUTH_URL="https://your-domain.com"
   ```

3. **Database Migration**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```
   *Note: Never run `prisma migrate reset` in production.*

4. **Run Local Server**
   ```bash
   npm run dev
   ```

## Admin Roles
To create the first admin user, register normally, then manually update the user role in your PostgreSQL database to `ADMIN`. Future admin actions can be managed from the CMS.

## Production Deployment Checklist
- [ ] Connect a live PostgreSQL database.
- [ ] Configure `DATABASE_URL`, `AUTH_SECRET`, and `NEXTAUTH_URL` in Vercel.
- [ ] Run `npm run build` to verify the static generation.
- [ ] Deploy to Vercel.
