import { Avatar, Badge, Button, Image, Skeleton, ThemeIcon } from "@mantine/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import Navbar from "../components/Navbar";
import truncateString from "../utils/truncateString";
import { Pagination } from "@mantine/core";

export let getStaticProps = () => {
  return {
    props: {
      TMDB_API_KEY: process.env.TMDB_API_KEY,
      APPLICATION_URL: process.env.APPLICATION_URL,
    },
  };
};

function Search({ TMDB_API_KEY }) {
  let router = useRouter();
  const [searchData, setSearchData] = useState([]);
  const [activePage, setPage] = useState(router.query.p);
  const [contentLoading, setContentLoading] = useState(true);

  useEffect(() => {
    fetchData();
    async function fetchData() {
      setContentLoading(true);
      let url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${router.query.q}&page=${router.query.p}`;
      let response = await fetch(url);
      let { results } = await response.json();
      setSearchData(results?.filter((result) => result.media_type === "movie" || result.media_type === "tv"));
      setContentLoading(false);
    }
  }, [router.query.p, router.query.q]);

  useEffect(() => {
    if (activePage !== router.query.p) {
      router.push(`/search?q=${router.query.q}&p=${activePage}`);
    }
  }, [activePage]);

  return (
    <>
      <Navbar />
      <div className="search">
        <Button
          variant="link"
          leftIcon={<FiArrowLeft />}
          size="lg"
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          Back
        </Button>
        <h1>Search Results</h1>
        {contentLoading &&
          Array.from(Array(9)).map((e, i) => (
            <Skeleton key={i} height={150} style={{ margin: "10px 0" }} shadow="lg" radius={8} />
          ))}
        {searchData.map((result) => (
          <div
            key={result.id}
            className="search__result"
            onClick={() => {
              router.push(`/content?id=${result.id}&type=${result.media_type}`);
            }}
          >
            <Avatar
              className="search__resultImage"
              size="xl"
              withPlaceholder
              src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
            />
            <div className="search__resultLeft">
              <h2 className="search__resultTitle">{result.name || result.title}</h2>
              <p className="search__resultOverview">{truncateString(result.overview, 100)}</p>
              <Badge variant="dot" color={result.media_type == "tv" ? "blue" : "green"}>
                {result.media_type == "tv" ? "tv" : "movie"}
              </Badge>
            </div>
          </div>
        ))}
        <Pagination style={{ justifyContent: "center" }} total={10} page={activePage} onChange={setPage} />
      </div>
      <style jsx global>{`
        .search {
          max-width: 800px;
          margin: 40px auto;
          padding: 20px;
        }
        .search > h1 {
          margin-bottom: 20px;
        }
        .search__result {
          display: flex;
          align-items: center;
          gap: 30px;
          padding: 20px;
          cursor: pointer;
          background-color: rgba(51, 51, 51, 0.5);
          border-radius: 6px;
          margin: 20px 0;
        }
        .search__resultOverview {
          margin: 5px 0;
        }
        .search__mediaType {
          width: unset !important;
          padding: 0 5px;
          flex-shrink: 0;
          margin-top: 10px;
        }
        @media only screen and (max-width: 600px) {
          .search__result {
            flex-direction: column;
            align-items: unset;
            gap: 10px;
          }
        }
      `}</style>
    </>
  );
}

export default Search;
