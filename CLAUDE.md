# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Yarn 4 is the package manager (`packageManager` in package.json); use `yarn add` / `yarn remove`.

```bash
yarn dev          # Start dev server (localhost:3000)
yarn build        # Production build
yarn format       # Prettier (formats all files in place; also runs on pre-commit)
npx tsc --noEmit  # Typecheck
```

There are no automated tests and no ESLint config.

## Architecture

**Next.js 13 Pages Router**, React 18, TypeScript, Tailwind CSS 3.3.

| Route            | File                              | Notes                                                    |
| ---------------- | --------------------------------- | -------------------------------------------------------- |
| `/`              | `pages/index.tsx`                 | Composes the `containers/v3/*` sections                  |
| `/guestbook`     | `pages/guestbook.tsx`             | Sign in with GitHub (NextAuth) to leave a note           |
| `/api/auth/*`    | `pages/api/auth/[...nextauth].js` | NextAuth GitHub provider                                 |
| `/api/spotify`   | `pages/api/spotify.ts`            | Now playing / last played (`utils/spotify.js`)           |
| `/api/github/prs`| `pages/api/github/prs.ts`         | Merged PRs with line counts, edge-cached for an hour     |

`components/layout` wraps every page (via `_app.tsx`) with the navbar, footer and the `/` command dock.

### Folders

- **`containers/v3/`**: page sections (hero, work, projects, highlights, certifications, open source, writing, off the clock, contributions, guestbook).
- **`components/v3/`**: site UI: `Section`, `Card`, `Reveal` and icons (`index.tsx`), navbar, footer, dock, Spotify pill, `useHoverCard`.
- **`components/lab/`**: components adapted from [ui lab](https://github.com/xevrion/ui-lab) (MIT). Each file names its source; keep the header and `THIRD_PARTY_NOTICES.md` when editing.
- **`data/profile.ts`**: static profile content (name, location, hours, socials, OpenMRS stage) and the dock's section list. `data/index.ts` holds the guestbook fallback comments.
- **`queries/`**: Supabase queries (`index.ts`) and GitHub hooks (`github.ts`).
- **`config/keys.tsx`**: all env vars; import keys from here, not `process.env`. Server-only secrets must not use the `NEXT_PUBLIC_` prefix (e.g. `GITHUB_TOKEN`).

### Data

- **Supabase** (`useSupabaseBrowser()` from `utils/supabase-browser.ts`, queried with `@supabase-cache-helpers/postgrest-react-query`): `work`, `projects`, `achivements` (sic), `certifications`, `guestbook`. `projects` and `certifications` have a `display` flag; `work.description` and `projects.icon` drive the expandable rows and card icons. Regenerate `utils/database.types.ts` after schema changes.
- **GitHub**: user stats and contributions are fetched in the browser; merged PRs go through `/api/github/prs`.
- **Medium**: posts via `api.rss2json.com`.
- Images referenced from the database live in `public/logos`, `public/certs` and `public/project-icons`. Remote image domains must be listed in `next.config.js`.

## Style guide

- **Theme colours are CSS variables** in `styles/globals.scss` (`--bg`, `--card`, `--fg`, `--fg-muted`, `--line`, …), defined for `:root` and `.dark`. Use them as `bg-[var(--card)]`. Dark mode is `next-themes` with the `dark` class on `<html>`.
- Tailwind 3.3 can't put an opacity modifier on a CSS-variable colour, and its opacity scale has no 15/35/45… steps; use `color-mix(...)` or an explicit value like `bg-green-500/[0.15]`. Colour names such as `deep-purple` and `light-blue` come from Material Tailwind (`withMT` in `tailwind.config.js`).
- Font: Geist (Geist Mono for `font-mono`), loaded in `pages/_document.tsx`.
- Layout: a single `max-w-[672px]` column. Sections use `<Section id title meta action>` from `components/v3`.
- `@/` maps to the repo root; use `cn()` from `utils/cn.ts` for conditional classes.
- Prettier: `singleQuote: true`, `semi: true`, `trailingComma: "none"`, `printWidth: 80`.

### Motion

- Easing: `ease-out` / `ease-in-out` Tailwind classes use strong curves (`cubic-bezier(0.23,1,0.32,1)` / `(0.77,0,0.175,1)`).
- Presses scale to `0.96` (buttons, pills) or `0.985` (cards); hover only applies on real pointers (`hoverOnlyWhenSupported`).
- Scroll-in reveals are the CSS `.reveal` class via `<Reveal>`, not Framer Motion.
- `components/lab` uses `motion` (`motion/react`); other components use `framer-motion`. Animate with full `transform` strings, and use `useReducedMotion` from `utils/use-reduced-motion.ts`.
- Respect `prefers-reduced-motion`: keep fades, drop movement and looping animations.
