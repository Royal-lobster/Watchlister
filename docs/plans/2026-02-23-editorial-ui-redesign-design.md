# Watchlister UI Redesign: Dark Editorial / Film Journal

## Aesthetic Direction

"The Cineaste's Journal" — a dark, editorial redesign inspired by luxury film magazines (Criterion, Sight & Sound, Cahiers du Cinema). The watchlist is presented as a curated personal film journal.

## Typography

- **Display/Headlines**: Playfair Display (bold serif) — for page titles, movie titles, section headers. Large, commanding sizes.
- **Body/UI**: Libre Franklin — clean editorial sans-serif for body text, UI controls, metadata values.
- **Accents/Labels**: Uppercase tracked-out small caps for category labels, metadata keys (e.g., `D I R E C T O R`, `G E N R E S`).

Both fonts loaded via Google Fonts (`next/font/google`).

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-background` | `#0B0B0F` | Page background (deep ink with blue undertone) |
| `--color-surface` | `#151519` | Cards, panels, raised surfaces |
| `--color-surface-raised` | `#1C1C22` | Hover states, elevated surfaces |
| `--color-surface-hover` | `#24242B` | Active/pressed states |
| `--color-border` | `#2A2826` | Hairline rules, dividers |
| `--color-accent` | `#C9A84C` | Primary accent — gold (CTAs, highlights) |
| `--color-accent-hover` | `#B8963A` | Accent hover state |
| `--color-accent-muted` | `rgba(201, 168, 76, 0.15)` | Accent backgrounds |
| `--color-secondary` | `#B85C38` | Secondary accent — terracotta (badges, tags) |
| `--color-text-primary` | `#F2EDE4` | Main text (warm cream) |
| `--color-text-secondary` | `#8A8680` | Supporting text (dusty gray) |
| `--color-text-muted` | `#5A5752` | Disabled/hint text |

## Layout Philosophy

- Asymmetric grids: feature one item large, others smaller (magazine-style)
- Generous whitespace: wider margins, taller line spacing
- Horizontal hairline rules as section dividers (not chunky borders)
- Full-bleed hero images on detail pages with film-grain overlay

## Visual Textures

- Subtle CSS noise/grain texture on backgrounds
- Hairline rules (`1px`) between sections
- Pull-quote styling for movie taglines
- Magazine-style masthead in navbar
- Staggered fade-in animations on page load

## Page-by-Page Transformations

### Login Page (`(auth)/page.tsx`)
- Full-screen cinematic backdrop
- Large serif "Watchlister" wordmark centered
- Subtitle in tracked small caps
- Minimal — like a magazine cover
- "Connect with Notion" button in gold accent

### Navbar (`components/navbar/navbar.tsx`)
- Slim editorial masthead
- "Watchlister" in serif font (Playfair Display)
- Thin bottom hairline border
- Less cluttered — clean editorial navigation
- Optionally: small "issue" date reference

### Dashboard (`(app)/dashboard/page.tsx` + `components/dashboard/`)
- Featured item hero at top: large backdrop image with overlaid serif title and metadata
- Below: editorial grid with varied card sizes (not uniform)
- Section headers with horizontal rules
- Cards: refined with warm cream text, gold accents, subtle hover lift
- Genre badges in terracotta/muted tones

### Search Page (`(app)/search/page.tsx` + `components/search/`)
- Refined search bar — editorial styling, serif placeholder
- Results in tighter editorial grid
- Better typography hierarchy on result cards
- Pagination styled with editorial restraint

### Detail Page (`(app)/content/[type]/[id]/page.tsx`)
- Full-bleed backdrop hero with film grain overlay
- Large serif title overlaid on backdrop
- Metadata in tracked-out uppercase small caps
- Overview text in elegant body font (Libre Franklin)
- Watch providers in refined section below
- Add-to-watchlist button: gold accent, editorial styling

### Set Watchlist + Settings Pages
- Clean editorial form styling
- Consistent with overall aesthetic
- Gold accents on interactive elements

## Technical Approach

- Update `globals.css` with new theme tokens and noise texture
- Replace Geist fonts with Playfair Display + Libre Franklin via `next/font/google`
- Update `layout.tsx` to load new fonts
- Update all components with new styling
- Add film-grain CSS overlay utility class
- No new dependencies needed (CSS-only textures and animations)
