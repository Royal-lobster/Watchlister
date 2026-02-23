"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
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
      const res = await fetch(`/api/suggestions?q=${encodeURIComponent(q)}`, {
        signal: controller.signal,
      });
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

  // ── Cleanup on unmount ────────────────────────────────────────────────────
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
      {/* Search form */}
      <form onSubmit={handleSubmit} role="search" aria-label="Search">
        <div
          className={cn(
            "relative flex items-center bg-background border border-border transition-[border-color,box-shadow,border-radius] duration-150 ease-out",
            "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/25",
            showPanel ? "rounded-t-md" : "rounded-md"
          )}
        >
          {/* Left search icon / spinner */}
          <span
            className={cn(
              "absolute left-3 flex items-center justify-center pointer-events-none select-none transition-colors duration-200",
              isFetching ? "text-primary" : "text-muted-foreground"
            )}
            aria-hidden="true"
          >
            {isFetching ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
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
            className={cn(
              "w-full h-11 pl-9 pr-10 bg-transparent",
              "text-sm font-sans text-foreground placeholder:text-muted-foreground",
              "outline-none",
              "[&::-webkit-search-cancel-button]:hidden",
              "[&::-webkit-search-decoration]:hidden"
            )}
          />

          {/* Clear button */}
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
              className={cn(
                "absolute right-3 flex items-center justify-center",
                "size-5 rounded-full",
                "bg-muted text-muted-foreground",
                "hover:bg-accent hover:text-accent-foreground",
                "transition-colors duration-100 cursor-pointer"
              )}
            >
              <X className="size-2.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions panel */}
      {showPanel && (
        <ul
          ref={panelRef}
          id="search-suggestions"
          role="listbox"
          aria-label="Search suggestions"
          className={cn(
            "absolute top-full left-0 right-0 z-50",
            "bg-card border border-border border-t-0 rounded-b-md",
            "shadow-lg overflow-y-auto max-h-[360px]"
          )}
        >
          {/* Top hairline separator between input and results */}
          <li
            aria-hidden="true"
            className="block h-px w-full bg-border"
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
                  className="mx-3 h-px bg-border/50"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}

          {/* Footer hint */}
          <li
            aria-hidden="true"
            className="flex items-center justify-between px-3 py-2 border-t border-border/50 mt-1"
          >
            <span className="text-[10px] text-muted-foreground tracking-wide">
              {suggestions.length} result{suggestions.length !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <kbd className="px-1 py-0.5 rounded bg-muted border border-border font-mono text-[9px]">
                ↑↓
              </kbd>
              <span>navigate</span>
              <kbd className="px-1 py-0.5 rounded bg-muted border border-border font-mono text-[9px]">
                ↵
              </kbd>
              <span>select</span>
              <kbd className="px-1 py-0.5 rounded bg-muted border border-border font-mono text-[9px]">
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
