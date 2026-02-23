# Watchlister — Notion-powered watchlist

Watchlister is a web app that lets you manage your movie, TV show, and anime watchlist directly inside Notion. It automatically fetches and fills in metadata (title, poster, rating, genre, overview) from TMDB so you never have to enter details manually. Connect your Notion account via OAuth, point the app at your Notion database, and start adding titles.

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

## Tech Stack

- **Next.js 16** — App Router, React Server Components, Server Actions
- **React 19**
- **Tailwind CSS v4**
- **@notionhq/client** — Notion API integration
- **next-safe-action** — Type-safe server actions with Zod validation
- **TypeScript**

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/Royal-lobster/watchlister
cd watchlister
```

### 2. Copy the environment variable example file

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and fill in each value (see the table below).

### 3. Set up a Notion OAuth integration

1. Go to [https://www.notion.com/my-integrations](https://www.notion.com/my-integrations) and click **New integration**.
2. Choose **Public** integration type (required for OAuth).
3. Under **OAuth Domain & URIs**, add the following redirect URI:
   ```
   http://localhost:3000/auth/notion/callback
   ```
   For production add your deployed URL:
   ```
   https://your-app.vercel.app/auth/notion/callback
   ```
4. Copy the **OAuth client ID** and **OAuth client secret** into your `.env.local`.

### 4. Get a TMDB API key

1. Create a free account at [https://www.themoviedb.org/](https://www.themoviedb.org/).
2. Go to **Settings → API** and request an API key (v3 auth).
3. Copy the key into `TMDB_API_KEY` in your `.env.local`.

### 5. Install dependencies

```bash
npm install
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description |
|---|---|
| `NOTION_OAUTH_CLIENT_ID` | OAuth client ID from your Notion public integration |
| `NOTION_OAUTH_CLIENT_SECRET` | OAuth client secret from your Notion public integration |
| `TMDB_API_KEY` | API key (v3) from The Movie Database |
| `APPLICATION_URL` | Base URL of the app (e.g. `http://localhost:3000` or your production URL) |

## Notion Integration Notes

- The integration **must** be a **Public** (OAuth) integration — a standard internal integration will not work because Watchlister uses the OAuth flow to get a per-user access token.
- The redirect URI registered in the Notion integration settings must exactly match `{APPLICATION_URL}/auth/notion/callback`.
- Users authorize the integration from the Watchlister login page; no manual database sharing is required after authorization.

## License

[MIT](https://choosealicense.com/licenses/mit/)
