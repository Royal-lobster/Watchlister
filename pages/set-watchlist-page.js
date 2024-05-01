import {
  Avatar,
  Button,
  Input,
  LoadingOverlay,
  Notification,
  Paper,
  Text,
  Modal,
  Group,
} from "@mantine/core";
import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { FiSave, FiSearch, FiTool, FiX } from "react-icons/fi";
import { NotionCredContext } from "../context/NotionCred";
import { useNotifications } from "@mantine/notifications";
import router from "next/router";

export let getStaticProps = () => {
  return {
    props: {
      APPLICATION_URL: process.env.APPLICATION_URL,
    },
  };
};

function SetWatchlistPage({ APPLICATION_URL }) {
  const notifications = useNotifications();
  const [search, setSearch] = useState("");
  const [openedConfirmPopup, setOpenedConfirmPopup] = useState(false);
  const [openedAddPropertiesPopup, setOpenedAddPropertiesPopup] =
    useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [propertiesToAdd, setPropertiesToAdd] = useState([]);
  let [notionUserCredentials] = useContext(NotionCredContext);
  const [searchPagesData, setSearchPagesData] = useState([]);
  const [pageToSelect, setPageToSelect] = useState("");

  useEffect(() => {
    if (localStorage.getItem("NOTION_WATCHLIST_PAGE_ID") !== null) {
      router.push("/dashboard");
    }
  }, []);

  let handleSetWatchlistPageSearchSubmit = async (e) => {
    e.preventDefault();
    if (search.trim() === "") {
      notifications.showNotification({
        title: "Search Field is Empty",
        message: "Please enter a search term.",
        color: "red",
        autoClose: 3000,
      });
      return;
    }
    setSearchLoading(true);
    let response = await fetch(`${APPLICATION_URL}/api/search-watchlist-page`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: notionUserCredentials.access_token,
        search: search,
      }),
    });

    let data = await response.json();
    let onlyDatabaseResults = data.results.filter(
      (page) => page.title != undefined
    );
    await setSearchPagesData(onlyDatabaseResults);
    if (data.results.length != 0 && onlyDatabaseResults.length === 0) {
      notifications.showNotification({
        title: "The Page is Invalid",
        message:
          "Watchlist page must be a FULL PAGE DATABASE notion page. If you dont have one, Try logging out this app by pressing your avatar on top left and duplicate the starter page shown at beginning and try linking to notion again",
        color: "red",
        autoClose: false,
      });
    }
    if (onlyDatabaseResults.length === 0 && data.results.length === 0) {
      notifications.showNotification({
        title: "No Pages Found",
        message:
          "The page may be non existent or you may have not granted the permission for this application to access the page. if so, click on you profile picture in top right, logout and try linking to notion again",
        color: "red",
        autoClose: false,
      });
    }
    setSearchLoading(false);
  };
  let handlePageConfirmation = () => {
    const selectedPageProperties = Object.keys(
      searchPagesData.filter((page) => page.id == pageToSelect)[0].properties
    );
    const pagePropertiesToAdd = ["Tags"].filter(
      (x) => !selectedPageProperties.includes(x)
    );
    setOpenedConfirmPopup(false);
    if (pagePropertiesToAdd.length != 0) {
      setPropertiesToAdd(pagePropertiesToAdd);
      setOpenedAddPropertiesPopup(true);
    } else {
      localStorage.setItem("NOTION_WATCHLIST_PAGE_ID", pageToSelect);
      notifications.showNotification({
        title: "Page selected",
        message:
          "your watchlist page is saved to your browser so you dont have to do this step again",
      });
      window.location.href = `${APPLICATION_URL}/dashboard`;
    }
  };

  let handleMissingPropertiesAdd = async () => {
    setSearchLoading(true);
    let body_content = {
      properties: {
        Tags: {
          type: "multi_select",
          multi_select: [],
        },
      },
    };
    let response = await fetch(`${APPLICATION_URL}/api/update-db-properties`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: notionUserCredentials.access_token,
        database_id: pageToSelect,
        body_content: body_content,
      }),
    });
    setSearchLoading(false);
    let data = await response.json();
    if (response.status == 200) {
      localStorage.setItem("NOTION_WATCHLIST_PAGE_ID", pageToSelect);
      notifications.showNotification({
        title: "Added Properties and Page selected",
        message:
          "your watchlist page is saved to your browser so you dont have to do this step again",
      });
      window.location.href = `${APPLICATION_URL}/dashboard`;
    } else {
      alert("Something went wrong. Please Try again");
      router.push("/");
    }
  };
  return (
    <>
      <Navbar />
      <div className="setWatchlistPage">
        <Paper className="setWatchlistPage__paper">
          <LoadingOverlay visible={searchLoading} />
          <div className="setWatchlistPage__searchSection">
            <Text align="center" size="xl" weight={700}>
              🔗 Confirm Watchlist Page
            </Text>
            <Notification style={{ marginTop: "10px" }} disallowClose>
              Search for the title of the page you duplicated before and allowed
              this application to access it.
            </Notification>
            <form onSubmit={handleSetWatchlistPageSearchSubmit}>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="setWatchlistPage__search"
                icon={<FiSearch />}
                placeholder="eg: watchlist"
                type="text"
              />
              <Button
                style={{ marginTop: "10px" }}
                fullWidth
                leftIcon={<FiSearch />}
                className="setWatchlistPage__submit"
                type="submit"
              >
                Search
              </Button>
            </form>
          </div>
          {searchPagesData.length > 0 && (
            <div className="setWatchlistPage__resultsSection">
              <Text align="center" size="xl" weight={700}>
                Select the Page to link
              </Text>
              {searchPagesData.map((page) => (
                <button
                  className="setWatchlistPage__result"
                  key={page.id}
                  onClick={() => {
                    setPageToSelect(page.id);
                    setOpenedConfirmPopup(true);
                  }}
                >
                  <div className="setWatchlistPage__resultIcon">
                    {page.icon.type === "emoji" ? (
                      page.icon.emoji
                    ) : page.icon.type === "file" ? (
                      <Avatar src={page.icon.file.url} size="sm" />
                    ) : page.icon.type === "external" ? (
                      <Avatar src={page.icon.external.url} size="sm" />
                    ) : (
                      <></>
                    )}
                  </div>
                  <Text size="lg" weight={600}>
                    {page?.title[0].text.content}
                  </Text>
                </button>
              ))}
            </div>
          )}
        </Paper>
      </div>

      <Modal
        opened={openedConfirmPopup}
        onClose={() => setOpenedConfirmPopup(false)}
        title="Confirm page link"
      >
        <Notification color="blue" title="" disallowClose>
          Are you sure this is the correct page ?
        </Notification>
        <Group
          style={{
            marginTop: "10px",
            marginLeft: "auto",
            width: "100%",
            justifyContent: "right",
          }}
        >
          <Button
            onClick={() => {
              setPageToSelect("");
              setOpenedConfirmPopup(false);
            }}
            leftIcon={<FiX />}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePageConfirmation}
            color="green"
            leftIcon={<FiSave />}
          >
            Yes I&apos;m sure
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={openedAddPropertiesPopup}
        onClose={() => setOpenedAddPropertiesPopup(false)}
        title="Found Missing Properties"
      >
        <Notification
          loading={searchLoading}
          color="orange"
          title=""
          disallowClose
        >
          The properties {propertiesToAdd.join()} are missing from the page
          database. Shall I add them ?
        </Notification>
        <Group
          style={{
            marginTop: "10px",
            marginLeft: "auto",
            width: "100%",
            justifyContent: "right",
          }}
        >
          <Button
            color="green"
            leftIcon={<FiTool />}
            onClick={handleMissingPropertiesAdd}
          >
            Ok, Add them
          </Button>
        </Group>
      </Modal>
      <style jsx global>{`
        .setWatchlistPage {
          display: grid;
          place-items: center;
          min-height: 80vh;
          padding: 20px;
        }
        .setWatchlistPage__paper {
          display: flex;
          padding: 1rem;
          justify-content: space-between;
          gap: 20px;
          max-width: 600px;
          position: relative;
          background-color: #141414;
        }
        .setWatchlistPage__searchSection {
          max-width: 300px;
          flex: 1;
        }
        .setWatchlistPage__resultsSection {
          flex: 1;
        }
        .setWatchlistPage__search {
          margin-top: 10px;
        }
        .setWatchlistPage__result {
          display: flex;
          border: none;
          width: 100%;
          cursor: pointer;
          gap: 10px;
          align-items: center;
          background-color: #333333;
          padding: 5px;
          border-radius: 4px;
          margin-top: 10px;
        }
        @media only screen and (max-width: 700px) {
          .setWatchlistPage__paper {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}

export default SetWatchlistPage;
