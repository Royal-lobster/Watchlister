import { SiNotion } from "react-icons/si";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const notionAuthUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${process.env.NOTION_OAUTH_CLIENT_ID}&response_type=code&owner=user&redirect_uri=${encodeURIComponent((process.env.APPLICATION_URL ?? "http://localhost:3000") + "/auth/notion/callback")}`;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center text-center max-w-lg w-full">
        {/* Eyebrow */}
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground mb-8">
          Personal Watchlist
        </span>

        {/* Wordmark */}
        <h1 className="text-[clamp(3.5rem,12vw,7rem)] font-bold tracking-tight text-foreground select-none leading-none mb-4">
          Watchlister
        </h1>

        {/* Subtitle */}
        <p className="text-base text-muted-foreground mt-2 mb-8">
          Your Notion-powered watchlist
        </p>

        {/* Divider */}
        <div aria-hidden="true" className="w-16 h-px bg-border my-8" />

        {/* CTA Button */}
        <a
          href={notionAuthUrl}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <SiNotion className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          Connect with Notion
        </a>

        {/* Tagline */}
        <p className="text-xs text-muted-foreground mt-4">
          Securely connect your Notion workspace to get started
        </p>

        {/* How it works */}
        <div className="mt-16 flex flex-col gap-3 w-full max-w-xs">
          {[
            { step: "01", text: "Connect your Notion account via OAuth" },
            { step: "02", text: "Choose a database as your watchlist" },
            { step: "03", text: "Browse, search, and track everything" },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-center gap-4 text-left">
              <span className="font-mono text-[10px] tabular-nums flex-shrink-0 w-6 text-primary">
                {step}
              </span>
              <span className="text-xs text-muted-foreground">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
