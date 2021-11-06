import React, { useEffect, useState } from "react";
import SearchSuggestion from "./SearchSuggestion";
import { useDebouncedValue } from "@mantine/hooks";
import { Input } from "@mantine/core";
import { FiSearch } from "react-icons/fi";

function MovieSearchBar({ TMDB_API_KEY }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 200, { leading: true });

  useEffect(() => {
    console.log(debouncedSearchTerm);
    if (debouncedSearchTerm.length > 1) {
      fetchData();
    }
    async function fetchData() {
      let url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${debouncedSearchTerm}&page=1`;
      let response = await fetch(url);
      let { results } = await response.json();
      setSearchData(
        results?.filter((result) => result.media_type === "movie" || result.media_type === "tv").slice(0, 5)
      );
    }
  }, [debouncedSearchTerm]);

  return (
    <>
      <div className="dashboard__autoCompleteSearch">
        <Input
          className="dashboard__search"
          icon={<FiSearch />}
          placeholder="Search for movie/tv/anime"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="dashboard__searchSuggestions">
          {searchData?.length > 0 &&
            searchTerm.length > 0 &&
            searchData.map((data) => (
              <SearchSuggestion
                key={data.id}
                name={data.name ? data.name : data.title}
                id={data.id}
                mediaType={data.media_type}
                posterPath={data.poster_path}
              />
            ))}
        </div>
      </div>

      <style jsx global>{`
        .dashboard__autoCompleteSearch {
          position: relative;
          margin-top: 20px;
        }
        .dashboard__search {
          max-width: 600px;
          margin: 0 auto;
        }
        .dashboard__searchSuggestions {
          position: absolute;
          background-color: #2c2e33;
          border-radius: 4px;
          z-index: 30;
          top: 40px;
          left: 0;
          right: 0;
          max-width: 600px;
          margin: 0 auto;
        }
      `}</style>
    </>
  );
}

export default MovieSearchBar;
