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
- The Supabase client used in browser components is `utils/supabase-browser.ts`; `utils/supabase-server.ts` is for server-side usage.
- Static content (nav links, skills, testimonials) lives in `data/index.ts`.

### Styling conventions

- **Tailwind CSS** is the primary styling tool. Use the `cn()` utility (`utils/cn.ts`) for conditional/merged class names — it wraps `clsx` + `tailwind-merge`.
- Custom design tokens in `tailwind.config.js`: `primary` (#1E1E1E), `secondary` (#fafafa), `textPrimary` (#747474), `textSecondary` (#949494), `darkBg` (#161616).
- Font is **Helvetica Neue** loaded via CDN in `styles/globals.scss`. Use the `.titleFont` CSS class for bold headers (applies `font-weight: bolder; letter-spacing: -2px`).
- Dark mode is `class`-based via `next-themes`. Use `dark:` Tailwind variants throughout; never hard-code theme logic outside of Tailwind classes or the `useTheme()` hook.
- Card/panel pattern: `bg-secondary dark:bg-darkBg rounded-2xl border border-grey-200 dark:border-[#27272a]`.

### Animations

Framer Motion is used for all entry animations. Standard pattern for staggered section entry:

```tsx
<motion.div
  transition={{ delay: 0.2 }}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
```

### Path aliases

`@/` maps to the repo root (configured in `tsconfig.json`). Always use `@/` imports rather than relative paths.

### Image domains

External image domains must be whitelisted in `next.config.js` under `images.domains`.
