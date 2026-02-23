"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { SearchSuggestion } from "./search-suggestion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Suggestion {
  id: number;
  title: string;
  media_type: "movie" | "tv";
  poster_path: string | null;
  year: string;
}

interface SearchBarProps {
  initialValue?: string;
  placeholder?: string;
}

// ---------------------------------------------------------------------------
// Inline SVG icons (no external dep)
// ---------------------------------------------------------------------------

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
      style={{ animation: "spin 0.7s linear infinite" }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SearchBar
// ---------------------------------------------------------------------------

export function SearchBar({
  initialValue = "",
  placeholder = "Search movies and TV shows…",
}: SearchBarProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isFetching, setIsFetching] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // ── Fetch suggestions (debounced 300ms) ──────────────────────────────────
  const fetchSuggestions = useCallback(async (q: string) => {
    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();

    if (q.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setIsFetching(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setIsFetching(true);

    try {
      const res = await fetch(
        `/api/suggestions?q=${encodeURIComponent(q)}`,
        { signal: controller.signal }
      );
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setSuggestions(data.results ?? []);
      setIsOpen((data.results ?? []).length > 0);
      setHighlightedIndex(-1);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setSuggestions([]);
        setIsOpen(false);
      }
    } finally {
      if (!controller.signal.aborted) setIsFetching(false);
    }
  }, []);

  // ── Input change handler ─────────────────────────────────────────────────
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  }

  // ── Navigation helpers ───────────────────────────────────────────────────
  function navigateTo(q: string) {
    setIsOpen(false);
    setSuggestions([]);
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    });
  }

  function selectSuggestion(s: Suggestion) {
    setQuery(s.title);
    navigateTo(s.title);
  }

  // ── Keyboard handler ─────────────────────────────────────────────────────
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Enter" && query.trim()) {
        e.preventDefault();
        navigateTo(query.trim());
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;

      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          selectSuggestion(suggestions[highlightedIndex]);
        } else if (query.trim()) {
          navigateTo(query.trim());
        }
        break;

      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;

      case "Tab":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  }

  // ── Close panel on outside click ─────────────────────────────────────────
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  // ── Scroll highlighted item into view ────────────────────────────────────
  useEffect(() => {
    if (highlightedIndex < 0 || !panelRef.current) return;
    const item = panelRef.current.children[highlightedIndex] as HTMLElement;
    item?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  // ── Cleanup debounce on unmount ───────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  // ── Form submit ───────────────────────────────────────────────────────────
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (query.trim()) navigateTo(query.trim());
  }

  const showPanel = isOpen && suggestions.length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ── Search form ── */}
      <form onSubmit={handleSubmit} role="search" aria-label="Search">
        <div
          className={[
            // Container that holds the border/focus ring
            "relative flex items-center",
            "bg-(--color-surface)",
            "border border-(--color-border)",
            // When open, square off the bottom corners so panel connects flush
            showPanel ? "rounded-t-(--radius-md)" : "rounded-(--radius-md)",
            "transition-[border-color,box-shadow,border-radius] duration-150 ease-out",
            // Focus-within ring — red accent as specified
            "focus-within:border-(--color-accent)",
            "focus-within:ring-2 focus-within:ring-(--color-accent)/25",
          ].join(" ")}
        >
          {/* Left search icon / spinner */}
          <span
            className={[
              "absolute left-3 flex items-center justify-center",
              "pointer-events-none select-none",
              "transition-colors duration-200",
              isFetching
                ? "text-(--color-accent)"
                : "text-(--color-text-muted)",
            ].join(" ")}
            aria-hidden="true"
          >
            {isFetching ? <SpinnerIcon /> : <SearchIcon />}
          </span>

          {/* Input */}
          <input
            ref={inputRef}
            type="search"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            placeholder={placeholder}
            aria-label="Search"
            aria-autocomplete="list"
            aria-controls={showPanel ? "search-suggestions" : undefined}
            aria-activedescendant={
              highlightedIndex >= 0
                ? `suggestion-${highlightedIndex}`
                : undefined
            }
            aria-expanded={showPanel}
            role="combobox"
            className={[
              // Layout
              "w-full h-11 pl-9 pr-10",
              // Appearance — transparent bg so wrapper controls the look
              "bg-transparent",
              "text-sm font-sans text-(--color-text-primary)",
              "placeholder:text-(--color-text-muted)",
              // Clear browser search-input decorations
              "outline-none",
              "[&::-webkit-search-cancel-button]:hidden",
              "[&::-webkit-search-decoration]:hidden",
            ].join(" ")}
          />

          {/* Right clear button — appears when there's a query */}
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
                setIsOpen(false);
                setHighlightedIndex(-1);
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className={[
                "absolute right-3",
                "flex items-center justify-center",
                "size-5 rounded-full",
                "bg-(--color-surface-raised)",
                "text-(--color-text-muted)",
                "hover:bg-(--color-surface-hover) hover:text-(--color-text-primary)",
                "transition-colors duration-100",
                "cursor-pointer",
              ].join(" ")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* ── Suggestions panel ── */}
      {showPanel && (
        <ul
          ref={panelRef}
          id="search-suggestions"
          role="listbox"
          aria-label="Search suggestions"
          className={[
            // Positioning — flush with the input
            "absolute top-full left-0 right-0 z-50",
            // Appearance
            "bg-(--color-surface)",
            "border border-(--color-border) border-t-0",
            "rounded-b-(--radius-md)",
            // Shadow
            "shadow-[var(--shadow-modal)]",
            // Scroll safety
            "overflow-y-auto",
            "max-h-[360px]",
            // Thin top separator that visually completes the input border
            "before:block before:h-px before:w-full before:bg-(--color-border)",
          ].join(" ")}
        >
          {/* Top hairline — subtle visual break between input and results */}
          <li
            aria-hidden="true"
            className="block h-px w-full bg-(--color-border-subtle)"
          />

          {suggestions.map((s, i) => (
            <li
              key={s.id}
              id={`suggestion-${i}`}
              role="option"
              aria-selected={i === highlightedIndex}
            >
              <SearchSuggestion
                id={s.id}
                title={s.title}
                mediaType={s.media_type}
                posterPath={s.poster_path}
                year={s.year}
                isHighlighted={i === highlightedIndex}
                onClick={() => selectSuggestion(s)}
              />
              {/* Thin separator between rows (not after last) */}
              {i < suggestions.length - 1 && (
                <div
                  className="mx-3 h-px bg-(--color-border-subtle)"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}

          {/* Footer hint */}
          <li
            aria-hidden="true"
            className={[
              "flex items-center justify-between",
              "px-3 py-2",
              "border-t border-(--color-border-subtle)",
              "mt-1",
            ].join(" ")}
          >
            <span className="text-[10px] text-(--color-text-muted) tracking-wide">
              {suggestions.length} result{suggestions.length !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-2 text-[10px] text-(--color-text-muted)">
              <kbd className="px-1 py-0.5 rounded bg-(--color-surface-raised) border border-(--color-border) font-mono text-[9px]">
                ↑↓
              </kbd>
              <span>navigate</span>
              <kbd className="px-1 py-0.5 rounded bg-(--color-surface-raised) border border-(--color-border) font-mono text-[9px]">
                ↵
              </kbd>
              <span>select</span>
              <kbd className="px-1 py-0.5 rounded bg-(--color-surface-raised) border border-(--color-border) font-mono text-[9px]">
                esc
              </kbd>
              <span>close</span>
            </span>
          </li>
        </ul>
      )}
    </div>
  );
}
