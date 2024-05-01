import React, { useContext, useState, useEffect } from "react";
import { Button, Group, Modal, Notification } from "@mantine/core";
import { FiTrash2, FiX } from "react-icons/fi";
import Navbar from "../components/Navbar";
import { NotionCredContext } from "../context/NotionCred";
import NotionWatchlist from "../components/NotionWatchlist";
import { useRouter } from "next/router";
import MovieSearchBar from "../components/MovieSearchBar";

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
  }, [router]);

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
        if(data.error){
          setContentLoading(false);
          return;
        }
        if(data.results.length == 0) {
          setContentLoading(false);
          return;
        }
        setContentData(data.results);
        setContentLoading(false);
      });
    });
  }, [notionUserCredentials, APPLICATION_URL]);

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
        <MovieSearchBar TMDB_API_KEY={TMDB_API_KEY} />
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
      `}</style>
    </>
  );
}

export default Dashboard;
