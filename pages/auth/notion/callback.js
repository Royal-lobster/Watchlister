import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Code } from "@mantine/core";

export let getStaticProps = () => {
  return {
    props: {
      APPLICATION_URL: process.env.APPLICATION_URL,
    },
  };
};

function notionCallback({ APPLICATION_URL }) {
  let router = useRouter();
  const [notionAccessTokenData, setNotionAccessTokenData] = useState({});
  useEffect(async () => {
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
  }, [router.query.code]);

  return (
    <div style={{ display: "grid", minHeight: "100vh", placeItems: "center" }}>
      <Code block>{JSON.stringify(notionAccessTokenData, null, 4)}</Code>
    </div>
  );
}

export default notionCallback;
