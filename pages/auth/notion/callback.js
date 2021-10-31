import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Code } from "@mantine/core";
import { Prism } from "@mantine/prism";

export let getStaticProps = () => {
  return {
    props: {
      APPLICATION_URL: process.env.APPLICATION_URL,
    },
  };
};

function NotionCallback({ APPLICATION_URL }) {
  let router = useRouter();
  const [notionAccessTokenData, setNotionAccessTokenData] = useState({});
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
      setNotionAccessTokenData(resBody);
    }
    fetchNotionAccessToken();
  }, [router.query.code, APPLICATION_URL]);

  return (
    <div style={{ display: "grid", minHeight: "100vh", placeItems: "center" }}>
      <Prism language="tsx">{JSON.stringify(notionAccessTokenData, null, 4)}</Prism>
    </div>
  );
}

export default NotionCallback;
