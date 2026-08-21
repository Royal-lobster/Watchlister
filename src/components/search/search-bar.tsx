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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SearchSuggestion } from "./search-suggestion";

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  }

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

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    if (highlightedIndex < 0 || !panelRef.current) return;
    const item = panelRef.current.children[highlightedIndex] as HTMLElement;
    item?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (query.trim()) navigateTo(query.trim());
  }

  const showPanel = isOpen && suggestions.length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} role="search" aria-label="Search">
        <div className="relative flex items-center">
          <span className="absolute left-3 pointer-events-none text-muted-foreground" aria-hidden="true">
            {isFetching ? (
              <Loader2 className="size-4 animate-spin text-primary" />
            ) : (
              <Search className="size-4" />
            )}
          </span>
          <Input
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
            aria-activedescendant={highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined}
            aria-expanded={showPanel}
            role="combobox"
            className={cn(
              "pl-9 pr-9 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
              showPanel && "rounded-b-none"
            )}
          />
          {query.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
                setIsOpen(false);
                setHighlightedIndex(-1);
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="absolute right-1 size-7"
            >
              <X className="size-3.5" aria-hidden="true" />
            </Button>
          )}
        </div>
      </form>

      {showPanel && (
        <ul
          ref={panelRef}
          id="search-suggestions"
          role="listbox"
          aria-label="Search suggestions"
          className="absolute top-full left-0 right-0 z-50 bg-popover border border-border border-t-0 rounded-b-md shadow-md overflow-y-auto max-h-[360px]"
        >
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
