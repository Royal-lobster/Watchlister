"use client";

import Link from "next/link";
import { Search, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

function isEmoji(str: string): boolean {
  const emojiRe =
    /^[\p{Emoji_Presentation}\p{Extended_Pictographic}](\u200d[\p{Emoji_Presentation}\p{Extended_Pictographic}])*$/u;
  return emojiRe.test(str.trim());
}

interface NavbarProps {
  workspaceName: string;
  workspaceIcon: string | null;
  onLogout: () => void;
}

function WorkspaceAvatar({
  workspaceName,
  workspaceIcon,
}: Pick<NavbarProps, "workspaceName" | "workspaceIcon">) {
  const showEmoji = workspaceIcon && isEmoji(workspaceIcon);
  const fallbackLetter = workspaceName.trim().charAt(0).toUpperCase();
  return (
    <span className="inline-flex items-center justify-center size-7 rounded-full shrink-0 bg-secondary text-secondary-foreground text-sm font-semibold select-none">
      {showEmoji ? workspaceIcon : fallbackLetter}
    </span>
  );
}

export function Navbar({ workspaceName, workspaceIcon, onLogout }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 h-14 w-full bg-background border-b border-border backdrop-blur-sm">
      <nav
        className="mx-auto flex h-full max-w-screen-xl items-center justify-between px-4 sm:px-6"
        aria-label="Main navigation"
      >
        <Link
          href="/dashboard"
          className="text-base font-semibold text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          Watchlister
        </Link>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/search" aria-label="Search">
              <Search className="size-4" />
            </Link>
          </Button>

          <div className="flex items-center gap-2 px-2.5 py-1.5 text-sm text-muted-foreground select-none">
            <WorkspaceAvatar
              workspaceName={workspaceName}
              workspaceIcon={workspaceIcon}
            />
            <span className="hidden sm:block max-w-[140px] truncate text-xs font-medium">
              {workspaceName}
            </span>
          </div>

          <Separator orientation="vertical" className="h-5 mx-1" />

          <Button variant="ghost" size="icon" onClick={onLogout} aria-label="Log out">
            <LogOut className="size-4" />
          </Button>
        </div>
      </nav>
    </header>
  );
}
