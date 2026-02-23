import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock process.env.TMDB_API_KEY so getApiKey() doesn't throw
vi.stubEnv("TMDB_API_KEY", "test-api-key");

import { getTmdbImageUrl, buildSearchUrl, buildDetailUrl } from "@/lib/tmdb";

describe("getTmdbImageUrl", () => {
  it("returns full URL for a poster path", () => {
    const url = getTmdbImageUrl("/abc123.jpg", "w500");
    expect(url).toBe("https://image.tmdb.org/t/p/w500/abc123.jpg");
  });

  it("returns null for null path", () => {
    expect(getTmdbImageUrl(null, "w500")).toBeNull();
  });
});

describe("buildSearchUrl", () => {
  it("builds search URL with query and page", () => {
    const url = buildSearchUrl("inception", 1);
    expect(url).toContain("/3/search/multi");
    expect(url).toContain("query=inception");
    expect(url).toContain("page=1");
  });
});

describe("buildDetailUrl", () => {
  it("builds movie detail URL", () => {
    const url = buildDetailUrl("movie", 123);
    expect(url).toContain("/3/movie/123");
  });

  it("builds tv detail URL", () => {
    const url = buildDetailUrl("tv", 456);
    expect(url).toContain("/3/tv/456");
  });
});
