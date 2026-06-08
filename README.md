# Futuristic Personal Portfolio & Administrative Dashboard

A high-fidelity, premium personal portfolio and dynamic administrative hub built using the **Stitch Aetheric Flux (Obsidian Neon)** design system. It is engineered to represent the intersection of artificial intelligence and systems design.

---

## 🌟 Key Features

*   🌌 **Aetheric Flux Aesthetics:** Immersive dark command-center theme featuring glassmorphism, 1px top-left border highlights simulating light leaks, and dynamic background pulsing ambient glow meshes.
*   📊 **Asymmetric Hero Dashboard:** An interactive dual-panel grid that displays active node indicators alongside a macOS-styled simulated IDE terminal readout with syntax-highlighted profile specifications.
*   📂 **Bento Expertise Grid:** Fully responsive grid displaying languages, AI specializations, data tools, and leadership highlights with hover-reflection sheen animations.
*   ⏳ **Dynamic Operational Timeline:** Database-backed, chronological timeline of experiences and associations alternating custom cyan and purple border states.
*   🏆 **Competitive Achievements:** Dynamic showcase of competitive milestones, hackathons, and certifications with certificate lightboxes.
*   🔒 **Hidden Security Gate:** A completely hidden admin dashboard access mechanism: clicking the `"next generation"` phrase exactly 5 times redirects the user to the auth portal.
*   🛠️ **Admin Management Terminal:** Rich administration portal supporting operational timeline CRUD management, visitor metrics tracking, and avatar portrait customization with direct URL saves and local file uploads.

---

## 🛠️ Technology Stack

*   **Framework:** [Next.js 14](https://nextjs.org/) (React, App Router, TypeScript)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS variables
*   **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Auth Services, Storage Buckets)
*   **Design Tokens:** Inspired by the Stitch Design System

---

## 🚀 Setup & Local Development

### Prerequisites
- Node.js (v18.x or later)
- NPM or PNPM

### 1. Clone the repository
```bash
git clone https://github.com/Singh08042007/Personal-Portfolio.git
cd Personal-Portfolio
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory and populate it with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Database Migration & Seed
1. Head to your **Supabase Dashboard -> SQL Editor**.
2. Copy the contents of the DDL file: [`supabase/schema.sql`](supabase/schema.sql).
3. Execute the SQL script to create tables (`contacts`, `gallery`, `certifications`, `projects`, `achievements`, `timeline`, `profile`, `page_views`, `project_views`), configure RLS policies, set up storage buckets, and insert default seeds.

### 4. Install Dependencies & Start Server
```bash
npm install
npm run dev
```
Open `http://localhost:3000` to view the local application.

---

## 🔒 Security & Exclusions

*   All database tables are protected by strict **Row Level Security (RLS)** policies. Write permissions are restricted exclusively to authenticated administrators, while read permissions are open to the public.
*   Local environment credentials (`.env.local`) are explicitly excluded from version control in `.gitignore` to prevent secret leaks.

---

## ☁️ Vercel Deployment

1. Import your repository into **Vercel**.
2. Configure the environment variables on Vercel:
    - Add `NEXT_PUBLIC_SUPABASE_URL`
    - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - Add `SUPABASE_SERVICE_ROLE_KEY`
3. Click **Deploy**. Vercel will build and host your portfolio globally.
