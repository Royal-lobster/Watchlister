import React, { useContext, useState, useEffect } from "react";
import { Button, Group, Input, Modal, Notification, Text } from "@mantine/core";
import { FiSearch, FiTrash2, FiX } from "react-icons/fi";
import Navbar from "../components/Navbar";
import SearchSuggestion from "../components/SearchSuggestion";
import { NotionCredContext } from "../context/NotionCred";
import NotionWatchlist from "../components/NotionWatchlist";
import { useRouter } from "next/router";

export let getStaticProps = () => {
  return {
    props: {
      TMDB_API_KEY: process.env.TMDB_API_KEY,
      APPLICATION_URL: process.env.APPLICATION_URL,
    },
  };
};

function Dashboard({ TMDB_API_KEY, APPLICATION_URL }) {
  let router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [contentData, setContentData] = useState([]);
  const [contentLoading, setContentLoading] = useState(true);
  const [pageDeleteLoading, setPageDeleteLoading] = useState(false);
  const [openedDeletePopup, setOpenedDeletePopup] = useState(false);
  const [pageToDelete, setPageToDelete] = useState("");
  let [notionUserCredentials] = useContext(NotionCredContext);

  useEffect(() => {
    if (localStorage.getItem("NOTION_WATCHLIST_PAGE_ID") == null) {
      router.push("/set-watchlist-page");
    }
  }, []);

  useEffect(() => {
    setContentLoading(true);
    let databaseID = localStorage.getItem("NOTION_WATCHLIST_PAGE_ID");
    fetch(`${APPLICATION_URL}/api/get-pages-from-db`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: notionUserCredentials.access_token,
        database_id: databaseID,
      }),
    }).then((response) => {
      response.json().then((data) => {
        console.log(data.results);
        setContentData(data.results);
        setContentLoading(false);
      });
    });
  }, [notionUserCredentials, APPLICATION_URL]);

  let handleAutoCompleteSearch = async (value) => {
    setSearchTerm(value);
    let url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${searchTerm}&page=1`;
    let response = await fetch(url);
    let { results } = await response.json();
    setSearchData(results?.filter((result) => result.media_type === "movie" || result.media_type === "tv").slice(0, 5));
  };

  let handlePageDeleteConfirm = (page_id) => {
    setPageToDelete(page_id);
    setOpenedDeletePopup(true);
  };

  let handlePageDelete = () => {
    setPageDeleteLoading(true);
    fetch(`${APPLICATION_URL}/api/toggle-archive-page-from-db`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: notionUserCredentials.access_token,
        page_id: pageToDelete,
        archive: true,
      }),
    }).then((response) => {
      response.json().then((data) => {
        console.log(data);
        window.location.reload();
      });
    });
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
        <NotionWatchlist
          contentData={contentData}
          contentLoading={contentLoading}
          handlePageDeleteConfirm={handlePageDeleteConfirm}
        />
        <Modal opened={openedDeletePopup} onClose={() => setOpenedDeletePopup(false)} title="Confirm Delete">
          <Notification loading={pageDeleteLoading} color="red" title="" disallowClose>
            Are You Sure you want to delete the page ?
          </Notification>
          <Group style={{ marginTop: "10px", marginLeft: "auto", width: "100%", justifyContent: "right" }}>
            <Button
              onClick={() => {
                setPageToDelete("");
                setOpenedDeletePopup(false);
              }}
              leftIcon={<FiX />}
            >
              Cancel
            </Button>
            <Button onClick={handlePageDelete} color="red" leftIcon={<FiTrash2 />}>
              Delete
            </Button>
          </Group>
        </Modal>
      </div>
      <style jsx global>{`
        .dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
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

export default Dashboard;
