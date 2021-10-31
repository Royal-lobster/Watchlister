import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Loader } from "@mantine/core";

export let getStaticProps = () => {
  return {
    props: {
      APPLICATION_URL: process.env.APPLICATION_URL,
    },
  };
};

function NotionCallback({ APPLICATION_URL }) {
  let router = useRouter();
  useEffect(() => {
    async function fetchNotionAccessToken() {
      const response = await fetch(`${APPLICATION_URL}/api/auth/notion/get-access-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: router.query.code,
        }),
      });
      const resBody = await response.json();
      if (resBody.access_token) {
        localStorage.setItem("NOTION_USER_CREDENTIALS", JSON.stringify(resBody));
        router.push("/");
      }
    }
    fetchNotionAccessToken();
  }, [router.query.code, APPLICATION_URL]);

  return (
    <div style={{ paddingTop: "40vh", display: "grid", placeItems: "center" }}>
      <Loader size="xl" variant="bars" />
    </div>
  );
}

export default NotionCallback;
