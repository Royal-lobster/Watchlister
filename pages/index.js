import React, { useEffect } from "react";
import { Button, Paper, ThemeIcon, Notification } from "@mantine/core";
import { SiNotion } from "react-icons/si";
import { useRouter } from "next/router";
import { MdOutlineMovie } from "react-icons/md";

export let getStaticProps = () => {
  return {
    props: {
      NOTION_OAUTH_CLIENT_TOKEN: process.env.NOTION_OAUTH_CLIENT_TOKEN,
      APPLICATION_URL: process.env.APPLICATION_URL,
    },
  };
};

function Index({ NOTION_OAUTH_CLIENT_TOKEN, APPLICATION_URL }) {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("NOTION_USER_CREDENTIALS")) {
      router.push("/dashboard");
    }
  }, []);

  let handleConnectClick = () => {
    window.location.href = `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=${NOTION_OAUTH_CLIENT_TOKEN}&response_type=code`;
  };

  return (
    <>
      <div className="notionLoginPage">
        <Paper className="notionLoginPage__paper" padding={40} shadow="xs" withBorder>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", margin: "0 auto" }}>
            <ThemeIcon size="lg" variant="gradient" gradient={{ from: "indigo", to: "cyan" }}>
              <MdOutlineMovie />
            </ThemeIcon>
            <h1>Watchlister</h1>
          </div>
          <Notification title="Connect with Notion" disallowClose>
            Press the button below to connect the application with your notion.
          </Notification>
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
          margin: 0 auto;
          padding: 20px;
        }
        .notionLoginPage__paper {
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          background-color: #333;
        }
      `}</style>
    </>
  );
}

export default Index;
