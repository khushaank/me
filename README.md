# Personal Blog Fullstack Template

A fullstack bilingual (中文 / English) personal blog + portfolio named **NEURAL ATELIER**. Three-column editorial layout (sidebar / posts feed / right rail), light & dark themes, Kimi OAuth + local username/password auth, and an admin-only authoring flow.

## Features

- Three-column editorial layout: profile sidebar, post feed, CV rail
- Bilingual content (zh / en) for every post, bio paragraph, and CV entry — language toggle in the header
- Light / dark theme toggle that writes CSS variables to `document.documentElement`
- Admin-only post authoring (`/admin/new-post`) with image upload to `public/images/`
- Public guestbook (`/guestbook`) writing to the `contacts` table
- Editable profile bio, CV entries, and avatar through the settings modal (admin only)
- Dual auth: Kimi OAuth and local username/password — first local user is auto-promoted to admin
- Animated three.js shader backdrop behind the layout

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v3 + shadcn/ui
- tRPC 11 + Hono + Drizzle ORM + MySQL
- Kimi OAuth 2.0 **and** local username/password authentication (both enabled)
- React Router v7
- three.js for the ambient hero shader

## Quick Start

1. Clone / extract this template
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in `DATABASE_URL` and Kimi OAuth credentials
4. Run database migrations: `npx drizzle-kit push`
5. Seed starter content (posts, profile bio, CV entries): `npx tsx db/seed.ts`
6. Run the dev server: `npm run dev`
7. Build for production: `npm run build`

## Configuration

This template does not use `src/config.ts`. All user-visible content is driven by the database and loaded through tRPC. A few static UI strings live inline in components — edit them there:

- **`src/App.tsx`** — header wordmark, `LOG IN / 登入`, `ADMIN`, theme / language toggles, `LOADING…`
- **`src/components/LeftColumn.tsx`** — profile column (bio paragraphs render from `profileBio`)
- **`src/components/MiddleColumn.tsx`** — post feed (renders from `posts`)
- **`src/components/RightColumn.tsx`** — CV rail (renders from `cvEntries`)
- **`src/components/PostDetail.tsx`** — post detail page layout
- **`src/components/ContactModal.tsx`** — contact form (writes to `contacts`)
- **`src/components/SettingsModal.tsx`** — admin settings modal (editable profile + avatar)
- **`src/pages/Guestbook.tsx`** — guestbook page
- **`src/pages/NewPost.tsx`** — admin-only post editor
- **`src/pages/Login.tsx`** — sign-in UI (Kimi + local)
- **`db/seed.ts`** — bootstrap content for posts, bio, CV entries, and avatar

See `info.md` (outer folder) for layout character limits per field.

## Database Schema

Seven tables, defined in `db/schema.ts`:

- **`users`** — Kimi OAuth-managed (id, unionId, name, email, avatar, role)
- **`localUsers`** — local username/password records (id, username, passwordHash, name, role)
- **`posts`** — bilingual blog posts (id, year, image, sortOrder, zh*/en* title, subtitle, collection, content, detailContent)
- **`contacts`** — guestbook / contact submissions (id, name, message, createdAt)
- **`profileBio`** — single-row profile bio (id=1, zhText, enText, email, instagram)
- **`cvEntries`** — CV rows grouped by category (id, category, zh/en title, subtitle, year, sortOrder)
- **`siteSettings`** — single-row site settings (id=1, avatarImage)

## Required Assets

Images are referenced by URL from the database. Seeded defaults live under `public/images/`:

- `/images/portrait.jpg` — default profile avatar (square, 800×800+ recommended)
- `/images/hero-art.jpg`, `/images/blog-1.jpg`, … — post cover images seeded by `db/seed.ts`

New post covers should be uploaded through the admin `NewPost` editor rather than edited by hand.

## Project Structure

```
.
├── api/                # tRPC routers: auth, local-auth, blog, contact, profile, cv, settings
├── contracts/          # Shared tRPC types
├── db/                 # Drizzle schema, migrations, seed
├── public/             # Static assets (incl. seed images)
├── src/
│   ├── components/     # AuthLayout, PostDetail, {Left,Middle,Right}Column,
│   │                   # ContactModal, SettingsModal, ImageUpload, ShaderCanvas
│   ├── contexts/       # ThemeContext, LanguageContext
│   ├── data/           # blogPosts.ts (type definitions)
│   ├── hooks/          # useAuth
│   ├── pages/          # Home, Guestbook, NewPost, Login, NotFound
│   ├── providers/      # trpc
│   └── App.tsx
├── Dockerfile
├── drizzle.config.ts
├── .backend-features.json  # Declares ["auth", "db"]
└── .env.example
```

## Design

- Three-column layout: left profile (~260px), middle feed (flex), right CV rail (~260px)
- Fixed 40px top header; each column scrolls independently
- Fonts: Inter body, Space Mono for small labels, a custom serif for headlines
- CSS variables drive the theme (`--bg-warm-white`, `--text-charcoal`, `--accent-teal`, `--border-light`, …)

## Notes

- Don't re-introduce hard-coded post content into components — the DB is the source of truth
- Both auth flows stay live at the same time (`api/kimi/` and `api/local-auth-router.ts`); the first local user is auto-admin
- Content edits must go through the admin UI (`SettingsModal`, `NewPost`) or `db/seed.ts`
- Every bilingual row (`posts`, `profileBio`, `cvEntries`) requires both `zh*` and `en*` fields populated
