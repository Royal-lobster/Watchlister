import { SiNotion } from "react-icons/si";

const notionAuthUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${process.env.NOTION_OAUTH_CLIENT_ID}&response_type=code&owner=user&redirect_uri=${encodeURIComponent((process.env.APPLICATION_URL ?? "http://localhost:3000") + "/auth/notion/callback")}`;

export default function LoginPage() {
  return (
    <main
      className="login-root relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {/* Styles scoped to this page */}
      <style>{`
        .login-root .login-cta {
          background-color: var(--color-accent);
          color: #ffffff;
          transition: background-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
        }
        .login-root .login-cta:hover {
          background-color: var(--color-accent-hover);
          box-shadow: 0 0 0 1px var(--color-accent), 0 8px 24px -4px rgb(229 56 59 / 0.35);
          transform: translateY(-1px);
        }
        .login-root .login-cta:active {
          transform: translateY(0);
        }
      `}</style>

      {/* Atmospheric radial vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, #121212 0%, #0a0a0a 55%, #000000 100%)",
        }}
      />

      {/* Grain overlay via SVG filter */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full"
        style={{ opacity: 0.035 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* Decorative accent top rule */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--color-accent) 50%, transparent 100%)",
          opacity: 0.4,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg w-full">
        {/* Eyebrow */}
        <span
          className="mb-8 text-[10px] font-mono tracking-[0.3em] uppercase"
          style={{ color: "var(--color-text-muted)" }}
        >
          Personal Watchlist
        </span>

        {/* Wordmark */}
        <h1
          className="text-[clamp(3.5rem,12vw,7rem)] font-bold leading-none tracking-[-0.02em] select-none"
          style={{ color: "var(--color-text-primary)" }}
        >
          Watchlister
        </h1>

        {/* Subtitle */}
        <p
          className="mt-4 text-base font-normal tracking-wide"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Your Notion-powered watchlist
        </p>

        {/* Divider */}
        <div
          aria-hidden="true"
          className="my-10 w-16 h-px"
          style={{ backgroundColor: "var(--color-border)" }}
        />

        {/* CTA Button */}
        <a
          href={notionAuthUrl}
          className="login-cta flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold tracking-wide"
        >
          <SiNotion className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          Connect with Notion
        </a>

        {/* Tagline */}
        <p
          className="mt-5 text-xs tracking-wide"
          style={{ color: "var(--color-text-muted)" }}
        >
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
              <span
                className="font-mono text-[10px] tabular-nums flex-shrink-0 w-6"
                style={{ color: "var(--color-accent)", opacity: 0.7 }}
              >
                {step}
              </span>
              <span
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom border rule */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--color-border) 50%, transparent 100%)",
        }}
      />

      {/* Version tag */}
      <span
        className="absolute bottom-5 font-mono text-[10px] tracking-widest uppercase"
        style={{ color: "var(--color-text-muted)", opacity: 0.4 }}
      >
        v2
      </span>
    </main>
  );
}
