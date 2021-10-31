import React from "react";
import { Button, Paper } from "@mantine/core";
import { SiNotion } from "react-icons/si";

export let getStaticProps = () => {
  return {
    props: {
      NOTION_OAUTH_CLIENT_TOKEN: process.env.NOTION_OAUTH_CLIENT_TOKEN,
      APPLICATION_URL: process.env.APPLICATION_URL,
    },
  };
};

function index({ NOTION_OAUTH_CLIENT_TOKEN, APPLICATION_URL }) {
  let handleConnectClick = () => {
    window.location.href = `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=${NOTION_OAUTH_CLIENT_TOKEN}&response_type=code`;
  };
  return (
    <>
      <div className="notionLoginPage">
        <Paper className="notionLoginPage__paper" padding={40} shadow="xs" withBorder>
          <h1>Notion Watchlister</h1>
          <Button
            leftIcon={<SiNotion />}
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan", deg: 45 }}
            onClick={handleConnectClick}
          >
            Connect with Notion
          </Button>
        </Paper>
      </div>
      <style jsx global>{`
        .notionLoginPage {
          display: grid;
          place-items: center;
          min-height: 100vh;
          text-align: center;
          margin: 0 auto;
          padding: 20px;
        }
        .notionLoginPage__paper {
          display: flex;
          flex-direction: column;
          gap: 20px;
          background-color: #333;
        }
      `}</style>
    </>
  );
}

export default index;
