# Watchlister Full Revamp Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Revamp Watchlister from Next.js 12 (Pages Router, Mantine, localStorage auth) to Next.js 16 (App Router, RSC, Tailwind v4, HTTP-only cookies, next-safe-action, @notionhq/client SDK).

**Architecture:** RSC-first — data-fetching pages (dashboard, content detail, search) are pure Server Components that read HTTP-only cookies and call the Notion/TMDB APIs directly. Client components exist only at interactivity boundaries (search input, action buttons). next-safe-action handles all mutations with Zod validation and auth middleware.

**Tech Stack:** Next.js 16.1.6, React 19.2.4, TypeScript 5, Tailwind CSS 4.2.0, @notionhq/client 5.9.0, next-safe-action 8.0.12, Zod, Vitest, Vercel deployment.

---

## Parallel Execution Strategy

This plan has a **sequential foundation phase** followed by **three parallel streams**:

- **Stream A (Auth + Dashboard):** Tasks 5–8, 13–14, 20–22
- **Stream B (Core lib + Actions):** Tasks 9–12, 18–19, 23–24
- **Stream C (UI Primitives + Search + Content + Settings):** Tasks 15–17, 25–29

Foundation (Tasks 1–4) must complete before streams start. Each stream should run in its own git worktree branched off the foundation commit.

---

## Phase 1: Foundation (Sequential — do this first)

### Task 1: Create feature branch and worktree

**Step 1: Create feature branch**
```bash
git checkout -b revamp/app-router
```

**Step 2: Verify you're on the new branch**
```bash
git branch
# Should show * revamp/app-router
```

**Step 3: Commit (branch creation doesn't need a commit, move to Task 2)**

---

### Task 2: Upgrade dependencies

**Files:**
- Modify: `package.json`

**Step 1: Update package.json with new dependencies**

Replace the entire `package.json` contents:
```json
{
  "name": "watchlister",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run"
  },
  "dependencies": {
    "@notionhq/client": "^5.9.0",
    "geist": "^1.3.1",
    "next": "^16.1.6",
    "next-safe-action": "^8.0.12",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-icons": "^5.5.0",
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "@testing-library/dom": "^10.4.0",
    "@testing-library/react": "^16.2.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.0.0",
    "eslint-config-next": "^16.1.6",
    "jsdom": "^26.0.0",
    "tailwindcss": "^4.2.0",
    "typescript": "^5.7.0",
    "vitest": "^3.0.0"
  }
}
```

**Step 2: Install dependencies**
```bash
npm install
```

**Step 3: Verify no critical errors**
```bash
npm ls --depth=0
```
Expected: list of top-level packages, no peer dep errors that would break the build.

**Step 4: Commit**
```bash
git add package.json package-lock.json
git commit -m "chore: upgrade to Next.js 16, React 19, Tailwind v4, add notionhq/client and next-safe-action"
```

---

### Task 3: TypeScript + Next.js config + Tailwind v4 setup

**Files:**
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `vitest.config.ts`
- Create: `src/app/globals.css`
- Delete: `next.config.js`, `styles/globals.css`

**Step 1: Create tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Step 2: Create next.config.ts**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "www.notion.so" },
      { protocol: "https", hostname: "notion.so" },
      { protocol: "https", hostname: "s3.us-west-2.amazonaws.com" },
    ],
  },
};

export default nextConfig;
```

**Step 3: Create vitest.config.ts**
```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

**Step 4: Create src/test/setup.ts**
```typescript
import "@testing-library/jest-dom";
```

**Step 5: Create src/app/globals.css**
```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-background: #0a0a0a;
  --color-surface: #141414;
  --color-surface-raised: #1e1e1e;
  --color-surface-hover: #252525;
  --color-border: #2a2a2a;
  --color-border-subtle: #1f1f1f;

  /* Brand */
  --color-accent: #e5383b;
  --color-accent-hover: #c1121f;
  --color-accent-subtle: #2d0a0b;

  /* Text */
  --color-text-primary: #f0f0f0;
  --color-text-secondary: #a0a0a0;
  --color-text-muted: #606060;

  /* Fonts */
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;

  /* Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  /* Shadows */
  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4);
  --shadow-modal: 0 25px 50px -12px rgb(0 0 0 / 0.8);
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
```

**Step 6: Delete old config and styles**
```bash
rm next.config.js styles/globals.css
```

**Step 7: Commit**
```bash
git add -A
git commit -m "chore: add TypeScript, Tailwind v4, Vitest config"
```

---

### Task 4: Scaffold src/ directory structure

**Step 1: Create all necessary directories**
```bash
mkdir -p src/app/\(auth\)/auth/notion/callback
mkdir -p src/app/\(app\)/dashboard
mkdir -p src/app/\(app\)/search
mkdir -p src/app/\(app\)/content/\[type\]/\[id\]
mkdir -p src/app/\(app\)/set-watchlist
mkdir -p src/app/\(app\)/settings
mkdir -p src/components/ui
mkdir -p src/components/dashboard
mkdir -p src/components/search
mkdir -p src/components/content
mkdir -p src/components/navbar
mkdir -p src/actions
mkdir -p src/lib
mkdir -p src/types
mkdir -p src/test
```

**Step 2: Create placeholder .gitkeep files so dirs are tracked (optional)**
```bash
# This step is only needed if you want empty dirs committed — skip if adding files immediately
```

**Step 3: Create src/types/index.ts with shared types**
```typescript
export type MediaType = "movie" | "tv";

export interface Session {
  access_token: string;
  workspace_name: string;
  workspace_icon: string | null;
  bot_id: string;
}

export interface TmdbSearchResult {
  id: number;
  media_type: MediaType;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  genre_ids: number[];
}

export interface TmdbDetail {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  genres: { id: number; name: string }[];
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  tagline?: string;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

export interface WatchProviders {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}
```

**Step 4: Commit**
```bash
git add -A
git commit -m "chore: scaffold src/ directory structure and shared types"
```

---

## Phase 2: Auth Layer (Stream A)

### Task 5: lib/auth.ts — cookie utilities

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/test/lib/auth.test.ts`

**Step 1: Write the failing test**

Create `src/test/lib/auth.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { getSession, SESSION_COOKIE, DB_COOKIE } from "@/lib/auth";
import { cookies } from "next/headers";
import type { Session } from "@/types";

const mockSession: Session = {
  access_token: "test-token",
  workspace_name: "My Workspace",
  workspace_icon: null,
  bot_id: "bot-123",
};

describe("getSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns session when cookie is present", async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: (name: string) =>
        name === SESSION_COOKIE
          ? { name: SESSION_COOKIE, value: JSON.stringify(mockSession) }
          : undefined,
    } as any);

    const session = await getSession();
    expect(session).toEqual(mockSession);
  });

  it("returns null when session cookie is missing", async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: () => undefined,
    } as any);

    const session = await getSession();
    expect(session).toBeNull();
  });

  it("returns null when session cookie value is invalid JSON", async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: (name: string) =>
        name === SESSION_COOKIE
          ? { name: SESSION_COOKIE, value: "not-json" }
          : undefined,
    } as any);

    const session = await getSession();
    expect(session).toBeNull();
  });
});

describe("getNotionDbId", () => {
  it("returns database ID when cookie is present", async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: (name: string) =>
        name === DB_COOKIE
          ? { name: DB_COOKIE, value: "db-id-123" }
          : undefined,
    } as any);

    const { getNotionDbId } = await import("@/lib/auth");
    const dbId = await getNotionDbId();
    expect(dbId).toBe("db-id-123");
  });
});
```

**Step 2: Run test to verify it fails**
```bash
npm run test:run src/test/lib/auth.test.ts
```
Expected: FAIL — module not found

**Step 3: Create src/lib/auth.ts**
```typescript
import { cookies } from "next/headers";
import type { Session } from "@/types";

export const SESSION_COOKIE = "notion_session";
export const DB_COOKIE = "notion_db_id";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  if (!cookie) return null;
  try {
    return JSON.parse(cookie.value) as Session;
  } catch {
    return null;
  }
}

export async function getNotionDbId(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(DB_COOKIE);
  return cookie?.value ?? null;
}

export function buildSessionCookieHeader(session: Session): string {
  const value = JSON.stringify(session);
  return `${SESSION_COOKIE}=${encodeURIComponent(value)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${COOKIE_OPTIONS.maxAge}`;
}

export function buildDbCookieHeader(dbId: string): string {
  return `${DB_COOKIE}=${dbId}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${COOKIE_OPTIONS.maxAge}`;
}

export function buildClearCookiesHeader(): string[] {
  return [
    `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
    `${DB_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
  ];
}
```

**Step 4: Run test to verify it passes**
```bash
npm run test:run src/test/lib/auth.test.ts
```
Expected: PASS

**Step 5: Commit**
```bash
git add src/lib/auth.ts src/test/lib/auth.test.ts
git commit -m "feat: add cookie-based auth utilities"
```

---

### Task 6: proxy.ts — route protection

**Files:**
- Create: `src/proxy.ts` (Note: Next.js 16 renamed middleware.ts to proxy.ts — verify this in Next.js 16 docs if build fails, fallback to `src/middleware.ts`)

**Step 1: Create src/proxy.ts**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

const PUBLIC_PATHS = ["/", "/auth/notion/callback"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for session cookie
  const session = request.cookies.get(SESSION_COOKIE);
  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

**Step 2: Verify Next.js finds the middleware**
```bash
npm run build 2>&1 | head -30
```
Expected: Build starts without "middleware not found" errors. If it errors on proxy.ts, rename to middleware.ts.

**Step 3: Commit**
```bash
git add src/proxy.ts
git commit -m "feat: add route protection middleware"
```

---

### Task 7: Root layout + app/(auth) login page

**Files:**
- Create: `src/app/layout.tsx`
- Create: `src/app/(auth)/page.tsx`

> **REQUIRED SKILL:** Use `frontend-design` skill for the login page UI. Brief: dark cinema-inspired design, red accent (#e5383b), full-height centered layout, "Connect with Notion" CTA, Watchlister logo/wordmark.

**Step 1: Create src/app/layout.tsx**
```typescript
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

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
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**Step 2: Build the login page using frontend-design skill**

Invoke `frontend-design` skill with this brief:
- Dark background (#0a0a0a), red accent (#e5383b)
- Full viewport height, centered content
- Large "Watchlister" wordmark (bold, letter-spaced)
- Subtitle: "Your Notion-powered watchlist"
- Red "Connect with Notion" button (pill-shaped, hover state)
- Small "How it works" text below button
- The button is an anchor tag pointing to the Notion OAuth URL (passed as prop `notionAuthUrl`)

The page is a Server Component that builds the Notion OAuth URL from env vars:
```typescript
// src/app/(auth)/page.tsx
const notionAuthUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${process.env.NOTION_OAUTH_CLIENT_ID}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(process.env.APPLICATION_URL + "/auth/notion/callback")}`;
```

**Step 3: Build and verify page renders**
```bash
npm run dev
```
Navigate to http://localhost:3000 — should see login page.

**Step 4: Commit**
```bash
git add src/app/layout.tsx src/app/\(auth\)/page.tsx
git commit -m "feat: add root layout and login page with Notion OAuth link"
```

---

### Task 8: OAuth callback route

**Files:**
- Create: `src/app/(auth)/auth/notion/callback/route.ts`

**Step 1: Create the OAuth callback route handler**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import { buildSessionCookieHeader, buildDbCookieHeader, DB_COOKIE } from "@/lib/auth";
import type { Session } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url));
  }

  try {
    // Exchange code for access token
    const credentials = Buffer.from(
      `${process.env.NOTION_OAUTH_CLIENT_ID}:${process.env.NOTION_OAUTH_CLIENT_SECRET}`
    ).toString("base64");

    const tokenResponse = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${process.env.APPLICATION_URL}/auth/notion/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Token exchange failed");
    }

    const tokenData = await tokenResponse.json();

    const session: Session = {
      access_token: tokenData.access_token,
      workspace_name: tokenData.workspace_name ?? "My Workspace",
      workspace_icon: tokenData.workspace_icon ?? null,
      bot_id: tokenData.bot_id,
    };

    // Determine redirect target
    const existingDbId = request.cookies.get(DB_COOKIE)?.value;
    const redirectPath = existingDbId ? "/dashboard" : "/set-watchlist";

    const response = NextResponse.redirect(
      new URL(redirectPath, request.url)
    );

    // Set HTTP-only session cookie
    response.headers.append("Set-Cookie", buildSessionCookieHeader(session));

    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
  }
}
```

**Step 2: Add required env vars to .env.local.example**

Create `.env.local.example`:
```bash
NOTION_OAUTH_CLIENT_ID=your_notion_client_id
NOTION_OAUTH_CLIENT_SECRET=your_notion_client_secret
TMDB_API_KEY=your_tmdb_api_key
APPLICATION_URL=http://localhost:3000
```

**Step 3: Test manually**
```bash
npm run dev
```
- Trigger the OAuth flow from the login page
- Verify you land on `/set-watchlist` (or `/dashboard` if db cookie already set)
- Check browser DevTools → Application → Cookies → `notion_session` is httpOnly

**Step 4: Commit**
```bash
git add src/app/\(auth\)/auth/notion/callback/route.ts .env.local.example
git commit -m "feat: add Notion OAuth callback route with HTTP-only cookie session"
```

---

## Phase 3: Core Library (Stream B)

### Task 9: lib/notion.ts — Notion client factory

**Files:**
- Create: `src/lib/notion.ts`

**Step 1: Create src/lib/notion.ts**
```typescript
import { Client } from "@notionhq/client";

export function createNotionClient(accessToken: string): Client {
  return new Client({ auth: accessToken });
}

// Notion property value extractors
export function extractTitle(properties: Record<string, any>): string {
  const title = Object.values(properties).find(
    (p) => p.type === "title"
  );
  return title?.title?.[0]?.plain_text ?? "Untitled";
}

export function extractMultiSelect(
  properties: Record<string, any>,
  key: string
): string[] {
  return properties[key]?.multi_select?.map((o: any) => o.name) ?? [];
}

export function extractUrl(
  properties: Record<string, any>,
  key: string
): string | null {
  return properties[key]?.url ?? null;
}

export function extractRichText(
  properties: Record<string, any>,
  key: string
): string {
  return (
    properties[key]?.rich_text?.[0]?.plain_text ?? ""
  );
}
```

**Step 2: Commit**
```bash
git add src/lib/notion.ts
git commit -m "feat: add Notion client factory and property extractors"
```

---

### Task 10: lib/tmdb.ts — TMDB helpers

**Files:**
- Create: `src/lib/tmdb.ts`
- Create: `src/test/lib/tmdb.test.ts`

**Step 1: Write failing test**

Create `src/test/lib/tmdb.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { getTmdbImageUrl, buildSearchUrl, buildDetailUrl } from "@/lib/tmdb";

describe("getTmdbImageUrl", () => {
  it("returns full URL for a poster path", () => {
    const url = getTmdbImageUrl("/abc123.jpg", "w500");
    expect(url).toBe("https://image.tmdb.org/t/p/w500/abc123.jpg");
  });

  it("returns null for null path", () => {
    expect(getTmdbImageUrl(null, "w500")).toBeNull();
  });
});

describe("buildSearchUrl", () => {
  it("builds search URL with query and page", () => {
    const url = buildSearchUrl("inception", 1);
    expect(url).toContain("/3/search/multi");
    expect(url).toContain("query=inception");
    expect(url).toContain("page=1");
  });
});

describe("buildDetailUrl", () => {
  it("builds movie detail URL", () => {
    const url = buildDetailUrl("movie", 123);
    expect(url).toContain("/3/movie/123");
  });

  it("builds tv detail URL", () => {
    const url = buildDetailUrl("tv", 456);
    expect(url).toContain("/3/tv/456");
  });
});
```

**Step 2: Run to verify it fails**
```bash
npm run test:run src/test/lib/tmdb.test.ts
```
Expected: FAIL — module not found

**Step 3: Create src/lib/tmdb.ts**
```typescript
import type { MediaType, TmdbSearchResult, TmdbDetail, WatchProviders } from "@/types";

const TMDB_BASE = "https://api.themoviedb.org";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

function getApiKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("TMDB_API_KEY is not set");
  return key;
}

export function getTmdbImageUrl(
  path: string | null,
  size: "w92" | "w185" | "w300" | "w500" | "w780" | "original"
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function buildSearchUrl(query: string, page: number): string {
  const params = new URLSearchParams({
    api_key: getApiKey(),
    query,
    page: String(page),
  });
  return `${TMDB_BASE}/3/search/multi?${params}`;
}

export function buildDetailUrl(type: MediaType, id: number): string {
  return `${TMDB_BASE}/3/${type}/${id}?api_key=${getApiKey()}`;
}

export async function searchTmdb(
  query: string,
  page = 1
): Promise<{ results: TmdbSearchResult[]; total_pages: number }> {
  const res = await fetch(buildSearchUrl(query, page), { cache: "no-store" });
  if (!res.ok) throw new Error("TMDB search failed");
  return res.json();
}

export async function getTmdbDetail(
  type: MediaType,
  id: number
): Promise<TmdbDetail> {
  const res = await fetch(buildDetailUrl(type, id), {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("TMDB detail fetch failed");
  return res.json();
}

export async function getWatchProviders(
  type: MediaType,
  id: number,
  countryCode: string
): Promise<WatchProviders | null> {
  const url = `${TMDB_BASE}/3/${type}/${id}/watch/providers?api_key=${getApiKey()}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.results?.[countryCode] ?? null;
}

// Genre ID to name mapping (avoids extra API call)
const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
  10759: "Action & Adventure", 10762: "Kids", 10763: "News",
  10764: "Reality", 10765: "Sci-Fi & Fantasy", 10766: "Soap",
  10767: "Talk", 10768: "War & Politics",
};

export function genreIdsToNames(ids: number[]): string[] {
  return ids.map((id) => GENRE_MAP[id] ?? "Unknown").filter(Boolean);
}
```

**Step 4: Run test to verify it passes**
```bash
npm run test:run src/test/lib/tmdb.test.ts
```
Expected: PASS

**Step 5: Commit**
```bash
git add src/lib/tmdb.ts src/test/lib/tmdb.test.ts
git commit -m "feat: add TMDB client helpers"
```

---

### Task 11: lib/safe-action.ts — action client with auth middleware

**Files:**
- Create: `src/lib/safe-action.ts`

**Step 1: Create src/lib/safe-action.ts**
```typescript
import { createSafeActionClient } from "next-safe-action";
import { getSession, getNotionDbId } from "@/lib/auth";
import { createNotionClient } from "@/lib/notion";
import type { Session } from "@/types";

// Base action client — no auth required (used for logout)
export const actionClient = createSafeActionClient();

// Authenticated action client — requires valid session cookie
export const authActionClient = createSafeActionClient().use(
  async ({ next }) => {
    const session = await getSession();
    if (!session) {
      throw new Error("Unauthorized");
    }
    const notion = createNotionClient(session.access_token);
    return next({ ctx: { session, notion } });
  }
);

// Authenticated action client that also requires a selected database
export const dbActionClient = createSafeActionClient().use(
  async ({ next }) => {
    const session = await getSession();
    const dbId = await getNotionDbId();
    if (!session) throw new Error("Unauthorized");
    if (!dbId) throw new Error("No watchlist database selected");
    const notion = createNotionClient(session.access_token);
    return next({ ctx: { session, notion, dbId } });
  }
);
```

**Step 2: Commit**
```bash
git add src/lib/safe-action.ts
git commit -m "feat: add next-safe-action client with auth middleware"
```

---

### Task 12: actions/auth.ts — logout action

**Files:**
- Create: `src/actions/auth.ts`

**Step 1: Create src/actions/auth.ts**
```typescript
"use server";

import { actionClient } from "@/lib/safe-action";
import { buildClearCookiesHeader } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SESSION_COOKIE, DB_COOKIE } from "@/lib/auth";

export const logoutAction = actionClient.action(async () => {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(DB_COOKIE);
  redirect("/");
});
```

**Step 2: Commit**
```bash
git add src/actions/auth.ts
git commit -m "feat: add logout server action"
```

---

## Phase 4: UI Primitives (Stream C)

### Task 13: UI Primitives — Button, Skeleton, Badge

**Files:**
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/skeleton.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/index.ts`

> **REQUIRED SKILL:** Use `frontend-design` skill for each primitive. Brief: dark theme, red accent, minimal and sharp. Button: variants = `primary` (red fill), `secondary` (surface fill), `ghost` (transparent), `danger` (red outline). Skeleton: animated shimmer pulse. Badge: small pill for genres/tags.

**Step 1: Invoke frontend-design for Button component**

The Button should:
- Accept `variant`, `size`, `isLoading`, `disabled` props
- Show a spinner when `isLoading` is true
- Be a `"use client"` component only if it uses hooks; otherwise RSC-compatible

**Step 2: Invoke frontend-design for Skeleton component**
```typescript
// src/components/ui/skeleton.tsx
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-(--color-surface-raised) ${className ?? ""}`}
    />
  );
}
```

**Step 3: Invoke frontend-design for Badge component**

Badge: small pill, variants `default` (surface), `accent` (red), `muted`.

**Step 4: Create the index barrel export**
```typescript
// src/components/ui/index.ts
export { Button } from "./button";
export { Skeleton } from "./skeleton";
export { Badge } from "./badge";
```

**Step 5: Commit**
```bash
git add src/components/ui/
git commit -m "feat: add UI primitive components (Button, Skeleton, Badge)"
```

---

### Task 14: UI Primitives — Card, Input, Avatar, Navbar

**Files:**
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/navbar/navbar.tsx`

> **REQUIRED SKILL:** Use `frontend-design` skill. Brief: Card = dark surface with subtle border and shadow, hover lift effect. Input = dark bg, red focus ring, rounded. Navbar = horizontal bar with Watchlister wordmark left, search icon + workspace avatar right, `"use client"` for mobile menu state.

**Step 1: Invoke frontend-design for Card, Input, and Navbar**

Navbar should accept:
- `workspaceName: string`
- `workspaceIcon: string | null`
- `onLogout: () => void` (calls logoutAction)

**Step 2: Update src/components/ui/index.ts**
```typescript
export { Button } from "./button";
export { Skeleton } from "./skeleton";
export { Badge } from "./badge";
export { Card } from "./card";
export { Input } from "./input";
```

**Step 3: Commit**
```bash
git add src/components/ui/ src/components/navbar/
git commit -m "feat: add Card, Input, Avatar UI primitives and Navbar"
```

---

## Phase 5: App Shell

### Task 15: app/(app)/layout.tsx — protected layout

**Files:**
- Create: `src/app/(app)/layout.tsx`

**Step 1: Create src/app/(app)/layout.tsx**
```typescript
import { redirect } from "next/navigation";
import { getSession, getNotionDbId } from "@/lib/auth";
import { Navbar } from "@/components/navbar/navbar";
import { logoutAction } from "@/actions/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        workspaceName={session.workspace_name}
        workspaceIcon={session.workspace_icon}
        onLogout={logoutAction}
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

**Step 2: Commit**
```bash
git add src/app/\(app\)/layout.tsx
git commit -m "feat: add protected app layout with Navbar"
```

---

## Phase 6: Set Watchlist Flow (Stream A)

### Task 16: actions/settings.ts — setWatchlistDb action

**Files:**
- Create: `src/actions/settings.ts`

**Step 1: Create src/actions/settings.ts**
```typescript
"use server";

import { z } from "zod";
import { authActionClient } from "@/lib/safe-action";
import { cookies } from "next/headers";
import { DB_COOKIE } from "@/lib/auth";
import { redirect } from "next/navigation";

export const setWatchlistDbAction = authActionClient
  .schema(z.object({ databaseId: z.string().min(1) }))
  .action(async ({ parsedInput: { databaseId } }) => {
    const cookieStore = await cookies();
    cookieStore.set(DB_COOKIE, databaseId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    redirect("/dashboard");
  });

export const toggleWatchProviderAction = authActionClient
  .schema(
    z.object({
      enabled: z.boolean(),
      countryCode: z.string().length(2),
    })
  )
  .action(async ({ parsedInput: { enabled, countryCode } }) => {
    // Store in cookie for server-side access
    const cookieStore = await cookies();
    cookieStore.set(
      "watch_provider_settings",
      JSON.stringify({ enabled, countryCode }),
      { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" }
    );
    return { success: true };
  });
```

**Step 2: Commit**
```bash
git add src/actions/settings.ts
git commit -m "feat: add settings server actions (set watchlist DB, toggle watch providers)"
```

---

### Task 17: set-watchlist page

**Files:**
- Create: `src/app/(app)/set-watchlist/page.tsx`

> **REQUIRED SKILL:** Use `frontend-design` for this page. Brief: centered card layout, list of Notion databases with their icons and names, each is a clickable card that calls `setWatchlistDbAction`. Loading state on click. Empty state if no databases found. Title "Choose your watchlist".

**Step 1: Create src/app/(app)/set-watchlist/page.tsx**
```typescript
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createNotionClient } from "@/lib/notion";
import { SetWatchlistClient } from "@/components/dashboard/set-watchlist-client";

export default async function SetWatchlistPage() {
  const session = await getSession();
  if (!session) redirect("/");

  const notion = createNotionClient(session.access_token);

  const searchResponse = await notion.search({
    filter: { value: "database", property: "object" },
    sort: { direction: "descending", timestamp: "last_edited_time" },
  });

  const databases = searchResponse.results
    .filter((r) => r.object === "database")
    .map((db: any) => ({
      id: db.id,
      title: db.title?.[0]?.plain_text ?? "Untitled",
      icon: db.icon?.emoji ?? db.icon?.external?.url ?? null,
    }));

  return <SetWatchlistClient databases={databases} />;
}
```

**Step 2: Create src/components/dashboard/set-watchlist-client.tsx**

> Use `frontend-design` skill for this component.

**Step 3: Commit**
```bash
git add src/app/\(app\)/set-watchlist/ src/components/dashboard/set-watchlist-client.tsx
git commit -m "feat: add set-watchlist page to select Notion database"
```

---

## Phase 7: Dashboard (Stream A)

### Task 18: actions/watchlist.ts — add and archive actions

**Files:**
- Create: `src/actions/watchlist.ts`

**Step 1: Create src/actions/watchlist.ts**
```typescript
"use server";

import { z } from "zod";
import { dbActionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";

const AddToWatchlistSchema = z.object({
  tmdbId: z.number(),
  mediaType: z.enum(["movie", "tv"]),
  title: z.string().min(1),
  genres: z.array(z.string()),
  posterPath: z.string().nullable(),
  overview: z.string(),
  releaseYear: z.string().optional(),
});

export const addToWatchlistAction = dbActionClient
  .schema(AddToWatchlistSchema)
  .action(async ({ parsedInput, ctx: { notion, dbId } }) => {
    const { title, genres, posterPath, overview, mediaType, tmdbId, releaseYear } = parsedInput;

    // Ensure database has required properties before creating page
    // Create the page in Notion
    await notion.pages.create({
      parent: { database_id: dbId },
      icon: posterPath
        ? { type: "external", external: { url: `https://image.tmdb.org/t/p/w92${posterPath}` } }
        : undefined,
      cover: posterPath
        ? { type: "external", external: { url: `https://image.tmdb.org/t/p/w500${posterPath}` } }
        : undefined,
      properties: {
        Name: { title: [{ text: { content: title } }] },
        Tags: { multi_select: genres.map((g) => ({ name: g })) },
        Type: { select: { name: mediaType === "movie" ? "Movie" : "TV Show" } },
        TMDB_ID: { number: tmdbId },
        Overview: { rich_text: [{ text: { content: overview.slice(0, 2000) } }] },
        ...(releaseYear ? { Year: { rich_text: [{ text: { content: releaseYear } }] } } : {}),
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  });

export const archiveFromWatchlistAction = dbActionClient
  .schema(z.object({ pageId: z.string().min(1) }))
  .action(async ({ parsedInput: { pageId }, ctx: { notion } }) => {
    await notion.pages.update({
      page_id: pageId,
      archived: true,
    });
    revalidatePath("/dashboard");
    return { success: true };
  });
```

**Step 2: Commit**
```bash
git add src/actions/watchlist.ts
git commit -m "feat: add watchlist server actions (add, archive)"
```

---

### Task 19: Dashboard components

**Files:**
- Create: `src/components/dashboard/notion-content-card.tsx`
- Create: `src/components/dashboard/watchlist-grid.tsx`

> **REQUIRED SKILL:** Use `frontend-design` skill. Brief:
> - `NotionContentCard`: dark card with poster image (next/image), title, genre badges, type pill (Movie/TV), archive button (trash icon, shows on hover). Red accent on hover. Subtle shadow.
> - `WatchlistGrid`: responsive grid (2 cols mobile, 3 tablet, 4 desktop, 5 xl). Empty state: centered illustration + "Your watchlist is empty" + link to search.

**Step 1: Build components using frontend-design skill**

`NotionContentCard` props:
```typescript
interface NotionContentCardProps {
  pageId: string;
  title: string;
  genres: string[];
  mediaType: "Movie" | "TV Show";
  posterUrl: string | null;
  notionUrl: string;
  onArchive: (pageId: string) => void; // calls archiveFromWatchlistAction
}
```

**Step 2: Commit**
```bash
git add src/components/dashboard/
git commit -m "feat: add NotionContentCard and WatchlistGrid components"
```

---

### Task 20: Dashboard page

**Files:**
- Create: `src/app/(app)/dashboard/page.tsx`
- Create: `src/app/(app)/dashboard/loading.tsx`

**Step 1: Create src/app/(app)/dashboard/page.tsx**
```typescript
import { redirect } from "next/navigation";
import { getSession, getNotionDbId } from "@/lib/auth";
import { createNotionClient, extractTitle, extractMultiSelect, extractUrl } from "@/lib/notion";
import { WatchlistGrid } from "@/components/dashboard/watchlist-grid";

export default async function DashboardPage() {
  const session = await getSession();
  const dbId = await getNotionDbId();

  if (!session) redirect("/");
  if (!dbId) redirect("/set-watchlist");

  const notion = createNotionClient(session.access_token);

  const response = await notion.databases.query({
    database_id: dbId,
    filter: { property: "archived", checkbox: { equals: false } },
    sorts: [{ timestamp: "created_time", direction: "descending" }],
    page_size: 50,
  });

  const entries = response.results
    .filter((p) => p.object === "page")
    .map((page: any) => ({
      pageId: page.id,
      title: extractTitle(page.properties),
      genres: extractMultiSelect(page.properties, "Tags"),
      mediaType: page.properties["Type"]?.select?.name ?? "Movie",
      posterUrl: page.cover?.external?.url ?? page.cover?.file?.url ?? null,
      notionUrl: page.url,
    }));

  return <WatchlistGrid entries={entries} />;
}
```

**Step 2: Create src/app/(app)/dashboard/loading.tsx**

> **REQUIRED SKILL:** Use `frontend-design` skill. Brief: Grid of shimmer skeleton cards matching NotionContentCard dimensions. Same grid layout as WatchlistGrid. Show 8-12 skeleton cards.

**Step 3: Verify dashboard renders**
```bash
npm run dev
```
Navigate to http://localhost:3000/dashboard — should show watchlist entries or empty state.

**Step 4: Commit**
```bash
git add src/app/\(app\)/dashboard/
git commit -m "feat: add RSC dashboard page with Suspense skeleton loading"
```

---

## Phase 8: Search (Stream C)

### Task 21: Search components

**Files:**
- Create: `src/components/search/search-bar.tsx`
- Create: `src/components/search/search-suggestion.tsx`

> **REQUIRED SKILL:** Use `frontend-design` skill.
> - `SearchBar` (`"use client"`): full-width input with magnifier icon, debounced suggestions dropdown (300ms), keyboard navigation (arrows + enter + escape). Red focus ring. Results appear in a floating panel below.
> - `SearchSuggestion`: compact row with small poster thumbnail, title, year, type badge. Hover state red accent.

**Step 1: Build search components using frontend-design skill**

`SearchBar` props:
```typescript
interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void; // navigates to /search?q=query
}
```

Suggestions should be fetched via a client-side `fetch` to a new route handler:

**Step 2: Create suggestions API route `src/app/api/suggestions/route.ts`**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { searchTmdb } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q || q.length < 2) return NextResponse.json({ results: [] });

  const data = await searchTmdb(q, 1);
  const results = data.results.slice(0, 6).map((r) => ({
    id: r.id,
    title: r.title ?? r.name ?? "Unknown",
    media_type: r.media_type,
    poster_path: r.poster_path,
    year: (r.release_date ?? r.first_air_date ?? "").split("-")[0],
  }));

  return NextResponse.json({ results });
}
```

**Step 3: Commit**
```bash
git add src/components/search/ src/app/api/suggestions/
git commit -m "feat: add SearchBar with debounced suggestions and suggestions API route"
```

---

### Task 22: Search page

**Files:**
- Create: `src/app/(app)/search/page.tsx`
- Create: `src/app/(app)/search/loading.tsx`
- Create: `src/components/search/search-results.tsx`

**Step 1: Create src/app/(app)/search/page.tsx**
```typescript
import { searchTmdb } from "@/lib/tmdb";
import { SearchResults } from "@/components/search/search-results";
import { SearchBar } from "@/components/search/search-bar";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page } = await searchParams;
  const pageNum = Number(page ?? 1);

  if (!q) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SearchBar />
        <p className="text-center text-(--color-text-muted) mt-12">
          Search for movies and TV shows to add to your watchlist.
        </p>
      </div>
    );
  }

  const data = await searchTmdb(q, pageNum);

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchBar initialValue={q} />
      <SearchResults
        results={data.results}
        query={q}
        currentPage={pageNum}
        totalPages={Math.min(data.total_pages, 10)}
      />
    </div>
  );
}
```

**Step 2: Create SearchResults component**

> **REQUIRED SKILL:** Use `frontend-design`. Brief: card grid of search results with poster, title, year, type, overview snippet. Each card links to `/content/[type]/[id]`. Pagination at bottom (prev/next using query params). Empty state if no results.

**Step 3: Create loading.tsx skeleton**

> **REQUIRED SKILL:** Use `frontend-design`. Brief: skeleton matching search results layout.

**Step 4: Commit**
```bash
git add src/app/\(app\)/search/ src/components/search/search-results.tsx
git commit -m "feat: add RSC search page with results grid and pagination"
```

---

## Phase 9: Content Detail (Stream C)

### Task 23: Content detail components

**Files:**
- Create: `src/components/content/add-to-watchlist-button.tsx`
- Create: `src/components/content/watch-providers.tsx`

**Step 1: Create add-to-watchlist-button.tsx**

This is `"use client"` because it uses `useAction`:
```typescript
"use client";

import { useAction } from "next-safe-action/hooks";
import { addToWatchlistAction } from "@/actions/watchlist";
import type { MediaType } from "@/types";

interface AddToWatchlistButtonProps {
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  genres: string[];
  posterPath: string | null;
  overview: string;
  releaseYear?: string;
}

export function AddToWatchlistButton(props: AddToWatchlistButtonProps) {
  const { execute, status } = useAction(addToWatchlistAction);

  const isPending = status === "executing";
  const isSuccess = status === "hasSucceeded";

  return (
    // Use frontend-design skill for button UI
    // Show: idle → "Add to Watchlist", executing → spinner + "Adding...", success → checkmark + "Added!"
    <button
      onClick={() => execute(props)}
      disabled={isPending || isSuccess}
      className={/* tailwind classes from frontend-design */ ""}
    >
      {isSuccess ? "Added to Watchlist" : isPending ? "Adding..." : "Add to Watchlist"}
    </button>
  );
}
```

> **REQUIRED SKILL:** Use `frontend-design` skill for the full button UI with states.

**Step 2: Create watch-providers.tsx**

> **REQUIRED SKILL:** Use `frontend-design`. Brief: horizontal row of provider logo icons (next/image, rounded), grouped by type (Stream / Rent / Buy). Link to JustWatch via TMDB link. Collapsed if no providers.

**Step 3: Commit**
```bash
git add src/components/content/
git commit -m "feat: add AddToWatchlistButton and WatchProviders components"
```

---

### Task 24: Content detail page

**Files:**
- Create: `src/app/(app)/content/[type]/[id]/page.tsx`
- Create: `src/app/(app)/content/[type]/[id]/loading.tsx`

**Step 1: Create the page**
```typescript
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTmdbDetail, getTmdbImageUrl, getWatchProviders, genreIdsToNames } from "@/lib/tmdb";
import { AddToWatchlistButton } from "@/components/content/add-to-watchlist-button";
import { WatchProviders } from "@/components/content/watch-providers";
import { Badge } from "@/components/ui/badge";
import type { MediaType } from "@/types";

interface ContentPageProps {
  params: Promise<{ type: string; id: string }>;
  searchParams: Promise<{ country?: string }>;
}

export default async function ContentPage({ params, searchParams }: ContentPageProps) {
  const { type, id } = await params;
  const { country = "US" } = await searchParams;

  if (!["movie", "tv"].includes(type)) notFound();

  const mediaType = type as MediaType;
  const tmdbId = Number(id);
  if (isNaN(tmdbId)) notFound();

  const [detail, providers] = await Promise.all([
    getTmdbDetail(mediaType, tmdbId),
    getWatchProviders(mediaType, tmdbId, country),
  ]);

  const backdropUrl = getTmdbImageUrl(detail.backdrop_path, "w780");
  const posterUrl = getTmdbImageUrl(detail.poster_path, "w500");
  const title = detail.title ?? detail.name ?? "Unknown";
  const year = (detail.release_date ?? detail.first_air_date ?? "").split("-")[0];
  const genres = detail.genres.map((g) => g.name);

  // Use frontend-design skill for layout below
  return (
    <div>
      {/* Hero backdrop */}
      {/* Poster + metadata sidebar */}
      {/* Genres, overview, AddToWatchlistButton */}
      {/* WatchProviders if enabled */}
    </div>
  );
}
```

> **REQUIRED SKILL:** Use `frontend-design` skill for the full content detail layout. Brief: cinema-style hero with backdrop blur, poster card on left, title/year/rating/genres/overview on right, red "Add to Watchlist" CTA button, watch providers section below. Dark and dramatic.

**Step 2: Create loading.tsx skeleton**

> **REQUIRED SKILL:** Use `frontend-design`. Brief: hero shimmer + poster shimmer + metadata lines shimmer.

**Step 3: Commit**
```bash
git add src/app/\(app\)/content/
git commit -m "feat: add RSC content detail page with TMDB data and watch providers"
```

---

## Phase 10: Settings (Stream C)

### Task 25: Settings page

**Files:**
- Create: `src/app/(app)/settings/page.tsx`

**Step 1: Create src/app/(app)/settings/page.tsx**
```typescript
import { cookies } from "next/headers";
import { SettingsClient } from "@/components/dashboard/settings-client";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("watch_provider_settings")?.value;
  const settings = raw
    ? JSON.parse(raw)
    : { enabled: true, countryCode: "US" };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <SettingsClient initialSettings={settings} />
    </div>
  );
}
```

**Step 2: Create SettingsClient component**

> **REQUIRED SKILL:** Use `frontend-design`. Brief: dark form card, toggle switch for "Show Watch Providers", country code dropdown (select), save button. Uses `useAction(toggleWatchProviderAction)`. Show success toast on save (use a simple inline state, no toast library).

**Step 3: Commit**
```bash
git add src/app/\(app\)/settings/ src/components/dashboard/settings-client.tsx
git commit -m "feat: add settings page with watch provider toggle"
```

---

## Phase 11: Cleanup and Migration

### Task 26: Delete old Pages Router files

**Step 1: Remove old Pages Router directory and related files**
```bash
rm -rf pages/ context/ utils/ styles/
```

**Step 2: Verify build still passes**
```bash
npm run build
```
Expected: Build succeeds. Fix any TypeScript or import errors before committing.

**Step 3: Commit**
```bash
git add -A
git commit -m "chore: remove old pages/ router, context/, utils/, styles/ directories"
```

---

### Task 27: Update environment variables and README

**Files:**
- Modify: `README.md`
- Modify: `.env.local.example`

**Step 1: Update .env.local.example**
```bash
# Notion OAuth App
NOTION_OAUTH_CLIENT_ID=your_notion_oauth_client_id
NOTION_OAUTH_CLIENT_SECRET=your_notion_oauth_client_secret

# TMDB
TMDB_API_KEY=your_tmdb_api_key

# App
APPLICATION_URL=http://localhost:3000
# Production: APPLICATION_URL=https://your-app.vercel.app
```

**Step 2: Verify all env vars are referenced correctly in code**
```bash
grep -r "process.env\." src/ --include="*.ts" --include="*.tsx" | grep -v "node_modules"
```
Confirm every referenced env var exists in `.env.local.example`.

**Step 3: Update README.md** with new setup instructions reflecting the App Router architecture.

**Step 4: Run full test suite**
```bash
npm run test:run
```
Expected: All tests pass.

**Step 5: Final build check**
```bash
npm run build
```
Expected: Build succeeds with no errors.

**Step 6: Commit**
```bash
git add -A
git commit -m "chore: update env vars, README, final cleanup"
```

---

### Task 28: Merge streams and create PR

**Step 1: If working in separate worktrees, merge each stream branch into the main revamp branch**
```bash
# On revamp/app-router branch:
git merge revamp/stream-a
git merge revamp/stream-b
git merge revamp/stream-c
```

**Step 2: Resolve any merge conflicts — check for duplicate component definitions**

**Step 3: Run final verification**
```bash
npm run build && npm run test:run
```

**Step 4: Push and create PR**
```bash
git push origin revamp/app-router
gh pr create --title "feat: full revamp to Next.js 16 App Router + RSC + Tailwind v4" \
  --body "Revamps Watchlister from Next.js 12 Pages Router to App Router with RSC, TypeScript, Tailwind v4, next-safe-action, and HTTP-only cookie auth."
```

---

## Environment Notes

- **Notion OAuth App:** Update the redirect URI in your Notion integration settings to include `/auth/notion/callback`
- **Vercel:** Add all env vars in Vercel dashboard → Project Settings → Environment Variables
- **Cookie security:** `Secure` flag only applies in production (HTTPS). Local dev works with HTTP.
- **Next.js 16 middleware:** If `proxy.ts` is not recognized, rename to `middleware.ts` — verify against Next.js 16 docs.
