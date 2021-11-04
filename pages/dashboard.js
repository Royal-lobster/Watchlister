import React, { useState } from "react";
import { Input } from "@mantine/core";
import { FiSearch } from "react-icons/fi";
import Navbar from "../components/Navbar";
import SearchSuggestion from "../components/SearchSuggestion";

export let getStaticProps = () => {
  return {
    props: {
      TMDB_API_KEY: process.env.TMDB_API_KEY,
    },
  };
};

function Dashboard({ TMDB_API_KEY }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState([]);

  let handleAutoCompleteSearch = async (value) => {
    setSearchTerm(value);
    let url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${searchTerm}&page=1`;
    let response = await fetch(url);
    let { results } = await response.json();
    setSearchData(results?.filter((result) => result.media_type === "movie" || result.media_type === "tv").slice(0, 5));
  };

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="dashboard__autoCompleteSearch">
          <Input
            className="dashboard__search"
            icon={<FiSearch />}
            placeholder="Search for movie/tv/anime"
            value={searchTerm}
            onChange={(e) => handleAutoCompleteSearch(e.target.value)}
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
      </div>
      <style jsx global>{`
        .dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .dashboard__autoCompleteSearch {
          position: relative;
        }
        .dashboard__search {
          max-width: 600px;
          margin: 0 auto;
        }
        .dashboard__searchSuggestions {
          position: absolute;
          background-color: #2c2e33;
          border-radius: 4px;
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

export default Dashboard;
