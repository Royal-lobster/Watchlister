import { searchTmdb } from "@/lib/tmdb";
import { SearchResults } from "@/components/search/search-results";
import { SearchBar } from "@/components/search/search-bar";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page } = await searchParams;
  const pageNum = Number(page ?? 1);

  if (!q) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar />
        </div>
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Search for movies and TV shows to add to your watchlist.
          </p>
        </div>
      </div>
    );
  }

  const data = await searchTmdb(q, pageNum);

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <SearchBar initialValue={q} />
      </div>
      <SearchResults
        results={data.results}
        query={q}
        currentPage={pageNum}
        totalPages={Math.min(data.total_pages, 10)}
      />
    </div>
  );
}
