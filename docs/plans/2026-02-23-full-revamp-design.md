# Watchlister Full Revamp Design

**Date:** 2026-02-23
**Status:** Approved

---

## Overview

Full revamp of Watchlister from Next.js 12 (Pages Router) to Next.js 16 (App Router) with React Server Components, TypeScript, Tailwind CSS v4, and next-safe-action. Notion auth stays as the sole provider using HTTP-only cookies instead of localStorage.

---

## Tech Stack

| Package | Version | Role |
|---|---|---|
| `next` | 16.1.6 | App Router, RSC, Server Actions |
| `react` / `react-dom` | 19.2.4 | UI rendering |
| `typescript` | 5.x | Type safety throughout |
| `tailwindcss` | 4.2.0 | CSS-first config (`@import "tailwindcss"`) |
| `@notionhq/client` | 5.9.0 | Notion SDK (API version 2025-09-03) |
| `next-safe-action` | 8.0.12 | Type-safe server action mutations |
| `zod` | latest | Schema validation for safe actions |

**Dropped:** `@mantine/core`, `@mantine/hooks`, `@mantine/notifications` — no more CSS-in-JS, no localStorage for auth.

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── page.tsx                    # Login / Connect Notion
│   │   └── auth/notion/callback/
│   │       └── route.ts                # OAuth handler → sets cookie → redirect
│   ├── (app)/
│   │   ├── layout.tsx                  # Reads cookie, passes notionClient to children
│   │   ├── dashboard/
│   │   │   ├── page.tsx                # RSC: queries Notion DB, renders cards
│   │   │   └── loading.tsx             # Skeleton grid
│   │   ├── search/
│   │   │   ├── page.tsx                # RSC: receives ?q= param, fetches TMDB
│   │   │   └── loading.tsx             # Skeleton results
│   │   ├── content/[type]/[id]/
│   │   │   ├── page.tsx                # RSC: TMDB detail + watch providers
│   │   │   └── loading.tsx             # Skeleton detail
│   │   ├── set-watchlist/
│   │   │   └── page.tsx                # RSC: list Notion DBs, pick one
│   │   └── settings/
│   │       └── page.tsx                # Client form + safe action
├── components/
│   ├── ui/                             # Primitives: Button, Card, Badge, Input, Skeleton
│   ├── dashboard/                      # NotionContentCard, WatchlistGrid
│   ├── search/                         # SearchBar (client), SearchResults, SuggestionItem
│   └── content/                        # ContentDetail, WatchProviders, AddToWatchlistButton
├── actions/
│   ├── watchlist.ts                    # add, archive safe actions
│   ├── settings.ts                     # update settings safe action
│   └── auth.ts                         # logout safe action (clears cookie)
├── lib/
│   ├── notion.ts                       # createNotionClient(token) helper
│   ├── tmdb.ts                         # typed TMDB fetch helpers
│   ├── auth.ts                         # getSession() — reads cookie in RSC/actions
│   └── safe-action.ts                  # actionClient setup (auth middleware)
└── proxy.ts                            # Route protection (Next.js 16 middleware)
```

---

## Auth Flow

```
User visits (app)/* route
       ↓
proxy.ts checks for `notion_session` cookie
       ↓ (missing)              ↓ (present)
redirect → /           allow through to RSC
       ↓
User clicks "Connect with Notion"
       ↓
Redirect to Notion OAuth URL
       ↓
Notion redirects → /auth/notion/callback?code=X
       ↓
route.ts: exchange code → access token via @notionhq/client
       ↓
Set HTTP-only cookie: `notion_session`
  { access_token, workspace_name, workspace_icon, bot_id }
       ↓
Check if watchlist DB is already set (cookie: `notion_db_id`)
  → yes: redirect /dashboard
  → no:  redirect /set-watchlist
       ↓
/set-watchlist: RSC lists user's Notion DBs
User picks one → safe action stores `notion_db_id` cookie
       ↓
/dashboard: RSC reads both cookies, queries Notion DB directly
```

### Cookie Scheme

| Cookie | Value | Flags |
|---|---|---|
| `notion_session` | JSON `{ access_token, workspace_name, workspace_icon }` | `httpOnly`, `secure`, `sameSite=lax` |
| `notion_db_id` | Notion database ID string | `httpOnly`, `secure`, `sameSite=lax` |

Logout: safe action in `actions/auth.ts` clears both cookies → redirect to `/`.

---

## Data Layer

### RSC Pattern

```typescript
// app/(app)/dashboard/page.tsx
export default async function DashboardPage() {
  const { access_token } = await getSession()     // reads cookie
  const notion = createNotionClient(access_token)
  const pages = await notion.databases.query(...)  // direct SDK call
  return <WatchlistGrid pages={pages} />
}
// loading.tsx renders skeleton automatically via Suspense
```

### Mutations via next-safe-action

| Action | File | Input |
|---|---|---|
| Add to watchlist | `actions/watchlist.ts` | `{ tmdbId, type, title, genres, posterPath, overview }` |
| Archive/delete entry | `actions/watchlist.ts` | `{ pageId }` |
| Set watchlist DB | `actions/settings.ts` | `{ databaseId }` |
| Toggle watch provider | `actions/settings.ts` | `{ enabled, countryCode }` |
| Logout | `actions/auth.ts` | none |

### Auth Middleware on Every Action

```typescript
// lib/safe-action.ts
export const actionClient = createSafeActionClient()
  .use(async ({ next }) => {
    const session = await getSession()  // throws if no cookie
    return next({ ctx: { session } })
  })
```

### TMDB

Pure server-side `fetch()` helpers in `lib/tmdb.ts` — called directly from RSC, API key never exposed to client.

---

## UI Design System

### Tailwind v4 Setup (CSS-first)

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-background: #0f0f0f;
  --color-surface: #1a1a1a;
  --color-surface-raised: #242424;
  --color-border: #2e2e2e;
  --color-accent: #e5383b;
  --font-sans: 'Geist', sans-serif;
}
```

Colors and fonts will be fully refreshed as part of the UI overhaul (not just a component swap from Mantine). The `frontend-design` skill will be invoked for each major UI component.

### Component Primitives (`components/ui/`)

`Button`, `Card`, `Badge`, `Input`, `Skeleton`, `Avatar` — all pure Tailwind, no external UI library.

### Loading States

Every data-heavy route gets a `loading.tsx` Tailwind skeleton:
- Dashboard: shimmer card grid
- Search results: shimmer list rows
- Content detail: hero shimmer + metadata shimmer

### UX Improvements over Current

- Skeleton loaders instead of blank screens during Notion fetches
- Inline action feedback on `AddToWatchlistButton` (spinner → success state)
- Error boundaries per route — one broken card doesn't crash the dashboard
- Optimistic UI for archive/delete via `useOptimisticAction`
- Full visual refresh: new color palette, new typography (Geist font)

---

## Feature Scope

**Parity features (all carried over):**
- Notion OAuth login
- Dashboard with watchlist entries from Notion DB
- TMDB movie/TV search with autocomplete
- Content detail page (metadata, genres, overview, poster)
- Watch providers (optional, per country)
- Add to watchlist (creates Notion page with metadata)
- Archive/delete from watchlist
- Settings (watch provider toggle, country code)
- Set/change watchlist Notion database

**New improvements:**
- Better loading states (Suspense skeletons throughout)
- Inline action feedback (no full-page reloads)
- Optimistic UI for destructive actions
- Error boundaries per section
- Full visual refresh (colors, typography)
