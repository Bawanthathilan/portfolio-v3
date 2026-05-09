# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (localhost:3000)
npm run build     # Production build
npm run lint      # ESLint
npm run format    # Prettier (formats all files in place)
```

There are no automated tests in this project.

## Architecture

**Next.js 13 Pages Router** — all routes live in `pages/`. The app wraps every page in `components/layout/index.tsx` via `_app.tsx`, which provides the sticky Navbar, Footer, dot-grid background, and Vercel SpeedInsights.

### Two-layer component pattern

- **`containers/`** — page-section components (e.g. `containers/home/hero`, `containers/home/work`). These are composed directly in page files and may fetch data.
- **`components/`** — reusable, presentational UI (Badge, Title, Marquee, Meteors, Cursor, ProjectCard, etc). Each lives in its own folder with an `index.tsx`.

### Data layer

- Dynamic content (projects, work history, achievements) is fetched from **Supabase**. Query functions are defined in `queries/index.ts` and called with `@supabase-cache-helpers/postgrest-react-query`'s `useQuery` hook.
- The Supabase browser client is a singleton from `utils/supabase-browser.ts` (via `useSupabaseBrowser()` hook); `utils/supabase-server.ts` is for server-side usage.
- Supabase credentials and all env vars are re-exported from `config/keys.tsx` — always import keys from there, not directly from `process.env`.
- Blog posts are fetched client-side from the Medium RSS-to-JSON API (`api.rss2json.com`) using plain `@tanstack/react-query`.
- Static content (nav links, skills, testimonials) lives in `data/index.ts`.

### Pages

| Page                              | Route         | Notes                                                  |
| --------------------------------- | ------------- | ------------------------------------------------------ |
| `pages/index.tsx`                 | `/`           | Composes Hero, Work, Blog, Sessions, Comments, Contact |
| `pages/about.tsx`                 | `/about`      | Composes about section containers                      |
| `pages/guestbook.tsx`             | `/guestbook`  | Auth-gated with NextAuth                               |
| `pages/api/auth/[...nextauth].js` | `/api/auth/*` | NextAuth handler                                       |

## Style Guide

### Colors

Custom Tailwind tokens (defined in `tailwind.config.js`):

| Token           | Value     | Usage                        |
| --------------- | --------- | ---------------------------- |
| `primary`       | `#1E1E1E` | Main text / dark backgrounds |
| `secondary`     | `#fafafa` | Card / light backgrounds     |
| `textPrimary`   | `#747474` | Body text, icon color        |
| `textSecondary` | `#949494` | Muted / subtitle text        |
| `darkBg`        | `#161616` | Dark mode card backgrounds   |

### Typography

- Font: **Helvetica Neue** loaded via CDN (`fonts.cdnfonts.com`) in `styles/globals.scss`.
- Use the `.titleFont` CSS class for bold section/page headers — applies `font-weight: bolder; letter-spacing: -2px`.
- Global body is already set to Helvetica Neue; no need to specify it on individual elements.

### Dark Mode

- `next-themes` with `attribute="class"` — dark class is on `<html>`.
- Always use `dark:` Tailwind variants. Never hard-code theme logic outside of Tailwind classes or the `useTheme()` hook.
- Common patterns: `dark:bg-darkBg`, `dark:text-white`, `dark:border-[#27272a]`.

### Cards / Panels

Standard card pattern:

```tsx
<div className="bg-secondary dark:bg-darkBg rounded-2xl border border-grey-200 dark:border-[#27272a] p-8">
```

Decorative accent lines (blue gradient) used on card edges:

```tsx
<span className="absolute w-[40%] bottom-0 right-px h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0 dark:from-blue-400/0 dark:via-blue-400/40 dark:to-blue-400/0"></span>
```

### Section Layout

Each page section uses `<section className="mt-20">` with a `<Title>` component at the top:

```tsx
<section id="work" className="mt-20">
  <Title title="Work" />
  ...
</section>
```

### Animations

Framer Motion is used for all entry animations. Standard staggered entry pattern:

```tsx
<motion.div
  transition={{ delay: 0.2 }}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
```

Custom Tailwind keyframes available: `animate-meteor-effect`, `animate-radar-spin`.

### Utilities & Conventions

- Use `cn()` from `utils/cn.ts` (`clsx` + `tailwind-merge`) for all conditional/merged class names.
- `@/` maps to the repo root — always use `@/` imports, never relative paths.
- Prettier: `singleQuote: true`, `semi: true`, `trailingComma: "none"`, `printWidth: 80`.
- Most components use default exports; named exports for `Badge`, `Meteors`, `AnimatedCursor`.
- External image domains must be whitelisted in `next.config.js` under `images.domains`.
