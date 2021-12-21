import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import {
  Switch,
  Modal,
  Notification,
  Group,
  Button,
  LoadingOverlay,
} from "@mantine/core";
import { SettingsContext } from "../context/Settings";
import { useNotifications } from "@mantine/notifications";
import { NotionCredContext } from "../context/NotionCred";
import { FiTool } from "react-icons/fi";

export let getStaticProps = () => {
  return {
    props: {
      APPLICATION_URL: process.env.APPLICATION_URL,
    },
  };
};

function Settings({ APPLICATION_URL }) {
  const notifications = useNotifications();
  let [notionUserCredentials] = useContext(NotionCredContext);
  const [whereToWatchSetting, setWhereToWatchSetting] =
    useContext(SettingsContext);
  const [openedAddPropertiesPopup, setOpenedAddPropertiesPopup] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [presentSettingToChange, setPresentSettingToChange] = useState({
    name: "",
    schema: {},
  });

  let handleMissingPropertiesAdd = async () => {
    // SET LOADING TO TRUE FOR UI
    setLoading(true);

    // ADD PROPERTIES TO NOTION PAGE
    let response = await fetch(`${APPLICATION_URL}/api/update-db-properties`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: notionUserCredentials.access_token,
        database_id: await localStorage.getItem("NOTION_WATCHLIST_PAGE_ID"),
        body_content: presentSettingToChange.schema,
      }),
    });
    let data = await response.json();

    // SET LOADING TO FALSE FOR UI
    setLoading(false);

    // CHECK IF RESPONSE IS OK
    if (response.status == 200) {
      // SHOW SUCCESS NOTIFICATION AND CLOSE POPUP
      notifications.showNotification({
        title: "Successfully Added property",
        message:
          "The property have been successfully added to the Notion page.",
      });
      setOpenedAddPropertiesPopup(false);

      // TURN ON THE SETTING
      if (presentSettingToChange.name === "Watch Provider") {
        setWhereToWatchSetting(true);
      }
    }

    // IF RESPONSE IS NOT OK
    else {
      // SHOW ERROR NOTIFICATION
      alert("Something went wrong. Please Try again");
      // CLOSE POPUP
      setOpenedAddPropertiesPopup(false);
    }
  };

  let handleAddPropertiesToDb = async (propertyName, propertySchema) => {
    // SET LOADING TO TRUE FOR UI
    setLoading(true);
    // STORE PROPERTY SCHEMA TO STATE
    setPresentSettingToChange({ name: propertyName, schema: propertySchema });

    // FETCH THE PAGE FROM NOTION
    let response = await fetch(`${APPLICATION_URL}/api/fetch-database`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: notionUserCredentials.access_token,
        page_id: await localStorage.getItem("NOTION_WATCHLIST_PAGE_ID"),
      }),
    });
    let data = await response.json();

    // SET LOADING TO FALSE FOR UI
    setLoading(false);

    // CHECK THE PROPERTIES OF THE PAGE
    const presentPageProperties = Object.keys(data.properties);

    console.log(presentPageProperties.includes(propertyName));
    // ADD THE PROPERTIES TO THE PAGE IF NECESSARY (OPEN MODAL)
    if (!presentPageProperties.includes(propertyName)) {
      setOpenedAddPropertiesPopup(true);
    }

    // IF PROPERTY IS ALREADY PRESENT, JUST TURN ON THE SETTING
    else {
      setWhereToWatchSetting(true);
    }
  };

  return (
    <>
      <Navbar />
      <div className="settings">
        <div className="settings__paper">
          <LoadingOverlay visible={loading} />
          <h1>Settings</h1>
          <Switch
            checked={whereToWatchSetting}
            className="settings__setting"
            label="Include Watch Provider"
            size="md"
            onClick={(e) => {
              e.currentTarget.checked
                ? handleAddPropertiesToDb("Watch Provider", {
                    properties: {
                      ["Watch Provider"]: {
                        type: "multi_select",
                        multi_select: [],
                      },
                    },
                  })
                : setWhereToWatchSetting(false);
            }}
          />
        </div>
      </div>

      <Modal
        opened={openedAddPropertiesPopup}
        onClose={() => {
          presentSettingToChange.name === "Watch Provider" &&
            setWhereToWatchSetting(false);
          setOpenedAddPropertiesPopup(false);
        }}
        title="Found Missing Properties"
      >
        <Notification loading={loading} color="orange" title="" disallowClose>
          The property{" "}
          <i>
            <u>{presentSettingToChange.name}</u>
          </i>{" "}
          is missing from the page database. Shall I add them ?
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
        .settings {
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .settings__paper {
          display: flex;
          flex-direction: column;
          padding: 1rem;
          justify-content: space-between;
          gap: 20px;
          width: 100%;
          max-width: 600px;
          position: relative;
          background-color: #141414;
          border-radius: 8px;
          margin-top: 10vh;
        }
        .settings__setting {
          display: flex;
          flex-direction: row-reverse;
          justify-content: space-between;
          align-items: center;
          background-color: #2c2c2c;
          padding: 10px;
          border-radius: 8px;
        }
      `}</style>
    </>
  );
}

export default Settings;
