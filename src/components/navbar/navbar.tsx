"use client";

import Link from "next/link";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns true if the string is a single emoji character (or emoji sequence) */
function isEmoji(str: string): boolean {
  // Emoji ranges: covers most common emoji including ZWJ sequences
  const emojiRe =
    /^[\p{Emoji_Presentation}\p{Extended_Pictographic}](\u200d[\p{Emoji_Presentation}\p{Extended_Pictographic}])*$/u;
  return emojiRe.test(str.trim());
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface NavbarProps {
  workspaceName: string;
  workspaceIcon: string | null;
  onLogout: () => void;
}

// ---------------------------------------------------------------------------
// WorkspaceAvatar
// ---------------------------------------------------------------------------

function WorkspaceAvatar({
  workspaceName,
  workspaceIcon,
}: Pick<NavbarProps, "workspaceName" | "workspaceIcon">) {
  const showEmoji = workspaceIcon && isEmoji(workspaceIcon);
  const fallbackLetter = workspaceName.trim().charAt(0).toUpperCase();

  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "size-7 rounded-full shrink-0",
        "text-sm leading-none select-none",
        showEmoji
          ? "bg-(--color-surface-raised)"
          : [
              "bg-(--color-accent-subtle)",
              "text-(--color-accent)",
              "font-semibold font-sans tracking-tight",
            ].join(" "),
      ].join(" ")}
      aria-hidden="true"
    >
      {showEmoji ? workspaceIcon : fallbackLetter}
    </span>
  );
}

// ---------------------------------------------------------------------------
// SearchIcon — inline SVG, no extra dependency
// ---------------------------------------------------------------------------

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// LogoutIcon — inline SVG
// ---------------------------------------------------------------------------

function LogoutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------

export function Navbar({ workspaceName, workspaceIcon, onLogout }: NavbarProps) {
  return (
    <header
      className={[
        "sticky top-0 z-50",
        "h-14 w-full",
        "bg-(--color-surface)",
        "border-b border-(--color-border)",
        // Subtle backdrop blur so content scrolls cleanly beneath
        "backdrop-blur-sm",
      ].join(" ")}
    >
      <nav
        className="mx-auto flex h-full max-w-screen-xl items-center justify-between px-4 sm:px-6"
        aria-label="Main navigation"
      >
        {/* ── Left: wordmark ── */}
        <Link
          href="/dashboard"
          className={[
            "font-bold tracking-widest uppercase",
            "text-sm font-sans",
            "text-(--color-text-primary)",
            "letter-spacing-[0.15em]",
            // Subtle accent tint on hover
            "transition-colors duration-150",
            "hover:text-(--color-accent)",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-(--color-accent) focus-visible:ring-offset-2",
            "focus-visible:ring-offset-(--color-surface)",
            "rounded-sm",
          ].join(" ")}
        >
          Watchlister
        </Link>

        {/* ── Right: actions ── */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <Link
            href="/search"
            aria-label="Search"
            className={[
              "flex items-center justify-center",
              "size-9 rounded-(--radius-md)",
              "text-(--color-text-secondary)",
              "transition-colors duration-150",
              "hover:bg-(--color-surface-raised) hover:text-(--color-text-primary)",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-(--color-accent) focus-visible:ring-offset-2",
              "focus-visible:ring-offset-(--color-surface)",
            ].join(" ")}
          >
            <SearchIcon />
          </Link>

          {/* Workspace pill: avatar + name */}
          <div
            className={[
              "flex items-center gap-2",
              "px-2.5 py-1.5",
              "rounded-(--radius-md)",
              "text-sm font-sans",
              "text-(--color-text-secondary)",
              "select-none",
            ].join(" ")}
            aria-label={`Workspace: ${workspaceName}`}
          >
            <WorkspaceAvatar
              workspaceName={workspaceName}
              workspaceIcon={workspaceIcon}
            />
            <span className="hidden sm:block max-w-[140px] truncate text-xs font-medium text-(--color-text-secondary)">
              {workspaceName}
            </span>
          </div>

          {/* Divider */}
          <div
            className="mx-1 h-5 w-px bg-(--color-border)"
            aria-hidden="true"
          />

          {/* Logout */}
          <button
            type="button"
            onClick={onLogout}
            aria-label="Log out"
            className={[
              "flex items-center justify-center",
              "size-9 rounded-(--radius-md)",
              "text-(--color-text-muted)",
              "transition-colors duration-150",
              "hover:bg-(--color-surface-raised) hover:text-(--color-accent)",
              "active:scale-95",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-(--color-accent) focus-visible:ring-offset-2",
              "focus-visible:ring-offset-(--color-surface)",
              "cursor-pointer",
            ].join(" ")}
          >
            <LogoutIcon />
          </button>
        </div>
      </nav>
    </header>
  );
}
