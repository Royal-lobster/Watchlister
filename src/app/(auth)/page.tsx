
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
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/></svg>
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
