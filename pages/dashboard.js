import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Dashboard() {
  let router = useRouter();
  const [notionUserCredentials, setNotionUserCredentials] = useState({});
  useEffect(() => {
    async function getNotionUserCredentials() {
      const storedCredentials = localStorage.getItem("NOTION_USER_CREDENTIALS");
      if (storedCredentials) {
        setNotionUserCredentials(JSON.parse(storedCredentials));
      } else {
        router.push("/");
      }
    }
    getNotionUserCredentials();
  }, []);

  useEffect(() => {
    console.log();
  }, [notionUserCredentials]);

  return (
    <div>
      <Navbar notionUserCredentials={notionUserCredentials} />
    </div>
  );
}

export default Dashboard;
