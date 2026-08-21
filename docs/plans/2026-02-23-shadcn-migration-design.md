# shadcn Migration Design

**Date:** 2026-02-23
**Branch:** revamp/app-router
**Approach:** Big Bang Full Rewrite

## Overview

Migrate Watchlister from entirely custom-built UI primitives and an editorial dark theme (gold/terracotta) to pure vanilla shadcn/ui using the "new-york" style with default zinc colors. Also swap fonts (Playfair Display + Libre Franklin → Inter) and icons (react-icons → lucide-react).

## Goals

- Zero custom UI primitives remaining in `/src/components/ui/`
- All shadcn components sourced from `@/components/ui` via `npx shadcn@latest add`
- Default shadcn "new-york" CSS variable system in `globals.css`
- Inter font via `next/font/google`
- lucide-react for all icons
- No editorial utilities (`film-grain`, `animate-fade-up`, `editorial-label`) remaining in pages

## Non-Goals

- Dark/light toggle (not adding next-themes)
- Preserving any gold/terracotta/editorial visual identity
- Keeping Playfair Display, Libre Franklin, or react-icons

## Technical Context

- **Framework:** Next.js (App Router), React 19
- **CSS:** Tailwind CSS v4.2.0 with `@theme` directive (no `tailwind.config.ts`)
- **Current components:** 6 custom UI primitives + 10 feature components
- **Current pages:** 5 main + 3 loading states + 2 auth routes

## Section 1: Installation & Setup

### shadcn init

```bash
npx shadcn@latest init
```

Configuration:
- Style: `new-york`
- Base color: `zinc`
- CSS variables: yes
- CSS file: `src/app/globals.css`
- Components alias: `@/components/ui`
- Tailwind v4 path: detected automatically (uses `@theme inline` in CSS, no `tailwind.config.ts`)

### Fonts

Remove from `src/app/layout.tsx`:
- `Playfair_Display` import
- `Libre_Franklin` import
- CSS variables `--font-display`, `--font-sans`

Add:
- `Inter` from `next/font/google` (variable: `--font-sans`)

### Icons

Remove `react-icons` from dependencies. Install `lucide-react`. Update all icon usages in feature components.

## Section 2: Theme & CSS

**Replace** the entire `@theme { ... }` block in `globals.css` with shadcn's standard CSS variable setup:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
}
```

Remove all editorial utilities:
- `.film-grain`
- `.animate-fade-up` / `@keyframes fade-up`
- `.editorial-label`

## Section 3: shadcn Components to Install

```bash
npx shadcn@latest add button card input badge skeleton separator label avatar scroll-area
```

| shadcn Component | Replaces |
|---|---|
| `button` | `src/components/ui/button.tsx` |
| `card` + CardHeader/CardContent/CardFooter | `src/components/ui/card.tsx` |
| `input` | `src/components/ui/input.tsx` |
| `badge` | `src/components/ui/badge.tsx` |
| `skeleton` | `src/components/ui/skeleton.tsx` |
| `separator` | navbar dividers |
| `label` | form labels in settings/set-watchlist |
| `avatar` | user profile in navbar (if present) |
| `scroll-area` | watchlist grid overflow |

After installing, delete the custom barrel export `src/components/ui/index.ts`.

## Section 4: Migration Sequence

### Step 1: shadcn init + component install

```bash
npx shadcn@latest init
npx shadcn@latest add button card input badge skeleton separator label avatar scroll-area
```

### Step 2: Update globals.css

Replace `@theme { ... }` with shadcn CSS variables (`@layer base { :root { ... } .dark { ... } }`). Remove all editorial custom utilities.

### Step 3: Update layout.tsx

- Swap fonts to Inter
- Update `<html>` body className to use `--font-sans`
- Remove `--font-display` variable

### Step 4: Delete custom UI primitives

Remove:
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/skeleton.tsx`
- `src/components/ui/index.ts`

shadcn's generated files in the same directory take their place.

### Step 5: Update feature components (10 files)

For each file, update:
1. Import paths: `@/components/ui` imports now point to shadcn components
2. Variant names: shadcn uses `variant="outline"`, `variant="destructive"`, `variant="ghost"` etc.
3. Class names: remove `bg-(--color-accent)`, `text-(--color-text-primary)`, etc. — use shadcn semantic tokens
4. Icons: replace `react-icons` with `lucide-react` equivalents

Files to update:
- `src/components/navbar/navbar.tsx`
- `src/components/dashboard/watchlist-grid.tsx`
- `src/components/dashboard/notion-content-card.tsx`
- `src/components/dashboard/set-watchlist-client.tsx`
- `src/components/dashboard/settings-client.tsx`
- `src/components/search/search-bar.tsx`
- `src/components/search/search-results.tsx`
- `src/components/search/search-suggestion.tsx`
- `src/components/content/add-to-watchlist-button.tsx`
- `src/components/content/watch-providers.tsx`

### Step 6: Update pages (5 files + 3 loading states)

Remove editorial utility classes from all pages:
- `film-grain`
- `animate-fade-up`
- `editorial-label`
- Custom color references (`text-(--color-*)`, `bg-(--color-*)`)

Pages:
- `src/app/(auth)/page.tsx`
- `src/app/(app)/dashboard/page.tsx`
- `src/app/(app)/search/page.tsx`
- `src/app/(app)/set-watchlist/page.tsx`
- `src/app/(app)/settings/page.tsx`
- `src/app/(app)/content/[type]/[id]/page.tsx`
- Loading files: `dashboard/loading.tsx`, `search/loading.tsx`, `content/[type]/[id]/loading.tsx`

### Step 7: Cleanup

- Remove `react-icons` from `package.json` dependencies
- Run `npm install` / `bun install`
- Fix any TypeScript errors from changed prop types

## Success Criteria

- [ ] `npx shadcn@latest add` installed all required components
- [ ] `globals.css` contains only shadcn CSS variables (no `@theme` editorial block)
- [ ] `layout.tsx` uses Inter, no Playfair Display or Libre Franklin
- [ ] `src/components/ui/` contains only shadcn-generated files (no custom primitives)
- [ ] Zero usages of `react-icons` in the codebase
- [ ] Zero usages of editorial utilities (`film-grain`, `editorial-label`, `animate-fade-up`)
- [ ] App builds without TypeScript errors
- [ ] All 5 main pages render correctly with shadcn default styling
