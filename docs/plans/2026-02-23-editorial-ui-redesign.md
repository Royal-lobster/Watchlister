# Editorial UI Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform Watchlister's UI from generic dark-mode media app into a "Dark Editorial / Film Journal" aesthetic with bold serif typography, gold accents, film-grain textures, and magazine-inspired layouts.

**Architecture:** Pure CSS/styling overhaul across all existing components. No structural changes to data flow, server actions, or routing. Replace Geist fonts with Playfair Display (serif display) + Libre Franklin (sans body) via `next/font/google`. Update all color tokens, then restyle each component page-by-page.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, `next/font/google` for font loading.

---

### Task 1: Foundation — Fonts & Theme Tokens

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

**Step 1: Update `src/app/layout.tsx` to load new fonts**

Replace Geist imports with Playfair Display and Libre Franklin from `next/font/google`:

```tsx
import type { Metadata } from "next";
import { Playfair_Display, Libre_Franklin } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Watchlister",
  description: "Your personal Notion-powered watchlist",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${libreFranklin.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**Step 2: Replace entire `src/app/globals.css` with new editorial theme**

```css
@import "tailwindcss";

@theme {
  /* Colors — Dark Editorial */
  --color-background: #0B0B0F;
  --color-surface: #151519;
  --color-surface-raised: #1C1C22;
  --color-surface-hover: #24242B;
  --color-border: #2A2826;
  --color-border-subtle: #201F1D;

  /* Brand — Gold */
  --color-accent: #C9A84C;
  --color-accent-hover: #B8963A;
  --color-accent-subtle: #1A1710;

  /* Secondary — Terracotta */
  --color-secondary: #B85C38;
  --color-secondary-subtle: #1C120E;

  /* Text — Warm Cream */
  --color-text-primary: #F2EDE4;
  --color-text-secondary: #8A8680;
  --color-text-muted: #5A5752;

  /* Fonts */
  --font-display: var(--font-display), Georgia, 'Times New Roman', serif;
  --font-sans: var(--font-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'DM Mono', ui-monospace, monospace;

  /* Radius — tighter for editorial feel */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;

  /* Shadows */
  --shadow-card: 0 2px 8px 0 rgb(0 0 0 / 0.5), 0 1px 3px -1px rgb(0 0 0 / 0.4);
  --shadow-modal: 0 25px 50px -12px rgb(0 0 0 / 0.85);
}

body {
  background-color: var(--color-background);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

* {
  border-color: var(--color-border);
}

::selection {
  background-color: var(--color-accent-subtle);
  color: var(--color-accent);
}

/* Film grain overlay utility */
.film-grain::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* Staggered fade-up animation */
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up {
  animation: fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* Tracked small caps utility for editorial labels */
.editorial-label {
  font-family: var(--font-sans);
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}
```

**Step 3: Commit**
```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat: replace theme tokens and fonts for editorial redesign"
```

---

### Task 2: Base UI Components — Button, Badge, Card, Input

**Files:**
- Modify: `src/components/ui/button.tsx`
- Modify: `src/components/ui/badge.tsx`
- Modify: `src/components/ui/card.tsx`
- Modify: `src/components/ui/input.tsx`

**Step 1: Update `button.tsx`**

Change accent colors from red to gold, update font references:

- `bg-(--color-accent)` stays (now gold via tokens)
- Update danger variant to use `--color-secondary` (terracotta) instead of `--color-accent`
- Font stays `font-sans` (now Libre Franklin via tokens)

Key changes to variant styles:
```
primary: bg-(--color-accent) → gold button
danger: use --color-secondary (terracotta) for border/text, hover fill
```

**Step 2: Update `badge.tsx`**

- Default badge: keep surface bg, add slight gold border tint
- Accent badge: `bg-(--color-accent)` → gold
- Muted badge: `bg-(--color-surface-raised)` with `text-(--color-text-muted)`
- Add `variant: "secondary"` for terracotta genre badges
- Make badge shape slightly squarer: `rounded-full` → `rounded-(--radius-sm)`

**Step 3: Update `card.tsx`**

- Keep dark surface bg and border
- Reduce radius from `--radius-lg` to `--radius-md` for tighter editorial feel
- Hover border tint: gold instead of red

**Step 4: Update `input.tsx`**

- Focus ring: gold accent instead of red
- Placeholder text in italic serif for editorial feel (via className override)

**Step 5: Commit**
```bash
git add src/components/ui/
git commit -m "feat: restyle base UI components with editorial gold accent"
```

---

### Task 3: Navbar — Editorial Masthead

**Files:**
- Modify: `src/components/navbar/navbar.tsx`

**Step 1: Restyle the navbar as editorial masthead**

Key changes:
- "Watchlister" wordmark: change from `font-sans font-bold tracking-widest uppercase text-sm` to `font-(--font-display) text-lg font-bold tracking-wide normal-case` (Playfair Display serif)
- Remove `uppercase` from wordmark — use natural case serif instead
- Change hover color from accent-red to accent-gold (already handled by token change)
- Make workspace avatar fallback use gold accent-subtle bg instead of red
- Bottom border: keep thin hairline, now uses warmer `--color-border`
- Background: `bg-(--color-surface)` stays (new darker blue-black)
- Keep backdrop-blur effect
- Change divider and icon button styles to use gold accent on hover

**Step 2: Commit**
```bash
git add src/components/navbar/navbar.tsx
git commit -m "feat: restyle navbar as editorial masthead with serif wordmark"
```

---

### Task 4: Login Page — Magazine Cover

**Files:**
- Modify: `src/app/(auth)/page.tsx`

**Step 1: Restyle login page**

Key changes:
- Wordmark `h1`: change to `font-family: var(--font-display)` (Playfair Display), keep giant size
- Eyebrow "Personal Watchlist": use `editorial-label` class styling
- Subtitle: use Libre Franklin, warm cream secondary
- CTA button: gold accent instead of red. Update `.login-cta` styles:
  - `background-color: var(--color-accent)` (gold)
  - hover: `var(--color-accent-hover)`, gold glow shadow
  - Remove `rounded-full`, use `rounded-(--radius-md)` for editorial feel
- Step numbers: gold accent instead of red
- Radial vignette: update from `#121212/#0a0a0a` to `#131316/#0B0B0F` (blue-black tint)
- Top accent hairline: gold gradient instead of red
- Grain overlay: keep, adjust opacity to 0.025
- Version tag: keep

**Step 2: Commit**
```bash
git add src/app/(auth)/page.tsx
git commit -m "feat: restyle login page as editorial magazine cover"
```

---

### Task 5: Dashboard — Editorial Watchlist Layout

**Files:**
- Modify: `src/app/(app)/dashboard/page.tsx`
- Modify: `src/components/dashboard/watchlist-grid.tsx`
- Modify: `src/components/dashboard/notion-content-card.tsx`

**Step 1: Update `dashboard/page.tsx`**

- Page title "My Watchlist": use `font-(--font-display) text-3xl font-bold` (Playfair Display serif)
- Add a thin hairline rule under the title
- Item count: use `editorial-label` styling (tracked small caps)

**Step 2: Update `watchlist-grid.tsx`**

- Change from uniform grid to editorial magazine layout:
  - First item spans 2 columns and 2 rows (featured hero card)
  - Remaining items in standard grid
- Update grid CSS: first-child rules for the featured item
- Empty state: update accent color references from red to gold
- "Browse to add content" link: gold hover border

**Step 3: Update `notion-content-card.tsx`**

- Card title: change to `font-family: var(--font-display)` for serif titles
- Border hover tint: gold instead of red
- Accent stripe at bottom: gold gradient instead of red
- Type pill: gold for movies, keep muted for TV
- Archive button: gold hover tint instead of red
- Genre badges: use `variant="muted"` (now styled with editorial tokens)
- Reduce border-radius for editorial feel

**Step 4: Commit**
```bash
git add src/app/(app)/dashboard/page.tsx src/components/dashboard/watchlist-grid.tsx src/components/dashboard/notion-content-card.tsx
git commit -m "feat: restyle dashboard with editorial layout and serif titles"
```

---

### Task 6: Search Page — Editorial Search

**Files:**
- Modify: `src/app/(app)/search/page.tsx`
- Modify: `src/components/search/search-bar.tsx`
- Modify: `src/components/search/search-results.tsx`
- Modify: `src/components/search/search-suggestion.tsx`

**Step 1: Update `search/page.tsx`**

- Empty state text: use serif font for "Search" heading if desired
- General layout spacing: increase for editorial whitespace

**Step 2: Update `search-bar.tsx`**

- Focus ring: gold accent (handled by token change)
- Spinner color: gold when fetching
- Clear button hover: gold accent
- Suggestion panel border/shadow: use new tokens
- Footer hint kbd styling: use new surface colors
- Reduce border-radius for editorial feel

**Step 3: Update `search-results.tsx`**

- `ResultCard`: update all accent color references
  - Hover border tint: gold
  - Hover shadow glow: gold
  - Accent stripe: gold gradient
  - Type badge movie color: gold
  - Title font: serif `var(--font-display)` for movie titles
  - Year: keep mono (now picks up DM Mono from tokens)
- `Pagination`: gold accent for current page, gold hover on buttons
- `EmptyState`: gold accent for query text highlight
- `ResultsHeader`: gold for query text, updated token colors
- Reduce border-radius throughout

**Step 4: Update `search-suggestion.tsx`**

- Highlighted border-left: gold instead of red
- Media type badge highlighted: gold bg/text
- Arrow hint: gold color
- All accent references → gold (handled by token change mostly)

**Step 5: Commit**
```bash
git add src/app/(app)/search/page.tsx src/components/search/
git commit -m "feat: restyle search page with editorial typography and gold accents"
```

---

### Task 7: Content Detail Page — Cinematic Editorial

**Files:**
- Modify: `src/app/(app)/content/[type]/[id]/page.tsx`
- Modify: `src/components/content/add-to-watchlist-button.tsx`
- Modify: `src/components/content/watch-providers.tsx`

**Step 1: Update `content/[type]/[id]/page.tsx`**

- Remove the `@import url(...)` for Google Fonts (fonts now loaded via `next/font/google` in layout)
- Title font: change from `'Playfair Display', Georgia, serif` to `var(--font-display)`
- Mono references: change from `'DM Mono', var(--font-mono)` to just `var(--font-mono)` (or keep, will work fine)
- Accent dot color: gold (handled by tokens)
- Media label color: gold
- Star rating: keep amber (#f59e0b)
- Tagline border-left: gold instead of red
- Poster glow: gold accent
- Hero backdrop tints: update `rgba(10, 10, 10, ...)` → `rgba(11, 11, 15, ...)` to match new background
- Film grain: use the `.film-grain` utility class or keep inline SVG
- Entry animations: keep (they're great)

**Step 2: Update `add-to-watchlist-button.tsx`**

- Idle state: gold bg instead of red
  - `background-color: var(--color-accent)` (already gold via tokens)
  - Hover: `var(--color-accent-hover)`, gold glow shadow
- Executing state: muted gold
- Success state: keep green
- Focus ring: gold accent

**Step 3: Update `watch-providers.tsx`**

- Section heading: use editorial-label style (tracked small caps)
- Group labels: tracked uppercase, muted text
- Logo hover: gold border tint and shadow
- JustWatch link: gold hover color
- Divider colors: use new border tokens
- Focus rings: gold

**Step 4: Commit**
```bash
git add src/app/(app)/content/ src/components/content/
git commit -m "feat: restyle content detail page with editorial serif and gold accents"
```

---

### Task 8: Settings & Set-Watchlist Pages

**Files:**
- Modify: `src/app/(app)/settings/page.tsx`
- Modify: `src/components/dashboard/settings-client.tsx`
- Modify: `src/components/dashboard/set-watchlist-client.tsx`

**Step 1: Update `settings/page.tsx`**

- Page title "Settings": use `font-(--font-display) text-2xl font-bold`

**Step 2: Update `settings-client.tsx`**

- Toggle track active: gold instead of red
- Card header accent hairline: gold gradient
- Card header icon: gold color
- Save button: gold bg
- Focus rings: gold
- Success message: keep green
- Error message: use secondary/terracotta instead of red-accent

**Step 3: Update `set-watchlist-client.tsx`**

- Title "Choose your watchlist": serif font
- Step indicator "Step 02 of 03": editorial-label style
- DB row accent stripe: gold
- Loading state: gold accent-subtle bg
- Row number loading: gold color
- Radial backdrop: update to blue-black tints
- Top accent hairline: gold
- Grain opacity: match new value (0.025)
- Divider: use new border color

**Step 4: Commit**
```bash
git add src/app/(app)/settings/page.tsx src/components/dashboard/settings-client.tsx src/components/dashboard/set-watchlist-client.tsx
git commit -m "feat: restyle settings and set-watchlist pages with editorial aesthetic"
```

---

### Task 9: Final Polish & Build Verification

**Step 1: Run build to check for errors**
```bash
npm run build
```

**Step 2: Fix any build errors**

**Step 3: Run dev server and visually verify**
```bash
npm run dev
```

**Step 4: Final commit**
```bash
git add -A
git commit -m "chore: final polish for editorial UI redesign"
```
