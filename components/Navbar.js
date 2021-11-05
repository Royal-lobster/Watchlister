import React, { useEffect, useContext } from "react";
import { NotionCredContext } from "../context/NotionCred";
import { useRouter } from "next/router";
import { Avatar, Text, Menu, UnstyledButton, Group, ThemeIcon } from "@mantine/core";
import { FiLogOut, FiUser } from "react-icons/fi";
import { MdOutlineMovie } from "react-icons/md";
import { useMediaQuery } from "@mantine/hooks";

function Navbar() {
  let router = useRouter();
  const [notionUserCredentials, setNotionUserCredentials] = useContext(NotionCredContext);
  useEffect(() => {
    async function getNotionUserCredentials() {
      const storedCredentials = await localStorage.getItem("NOTION_USER_CREDENTIALS");
      if (storedCredentials) {
        setNotionUserCredentials(JSON.parse(storedCredentials));
      } else {
        router.push("/");
      }
    }
    getNotionUserCredentials();
  }, [router, setNotionUserCredentials]);
  const matches = useMediaQuery("(min-width: 500px)");
  let handleLogoutClick = () => {
    localStorage.clear();
    window.location.replace("/");
  };
  return (
    <>
      <nav>
        <div className="navbar">
          <div className="navbar__branding" onClick={() => router.push("/")}>
            <ThemeIcon variant="gradient" gradient={{ from: "indigo", to: "cyan" }}>
              <MdOutlineMovie />
            </ThemeIcon>
            Watchlister
          </div>
          <div className="navbar__userDetails">
            <Menu
              gutter={5}
              withArrow
              size="xs"
              control={
                <UnstyledButton>
                  <Group style={{ padding: 0, margin: 0 }}>
                    <Avatar
                      radius={matches ? "xl" : "xs"}
                      size="md"
                      className="navbar__userAvatar"
                      src={notionUserCredentials?.owner?.user?.avatar_url}
                      alt="user avatar"
                      color="blue"
                    >
                      <FiUser />
                    </Avatar>
                    {matches && (
                      <div>
                        <Text weight={600}>{notionUserCredentials?.owner?.user?.name}</Text>
                        <Text size="xs" color="gray">
                          {notionUserCredentials?.owner?.user?.person?.email}
                        </Text>
                      </div>
                    )}
                  </Group>
                </UnstyledButton>
              }
            >
              <Menu.Item icon={<FiLogOut />} onClick={handleLogoutClick}>
                Logout
              </Menu.Item>
            </Menu>
          </div>
        </div>
      </nav>
      <style jsx global>{`
        nav {
          border-bottom: 1px solid #444;
          background-color: rgb(20, 20, 20);
          padding: 5px 20px;
        }
        .navbar {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .navbar__branding {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 20px;
          font-weight: bold;
        }
        .navbar__userAvatar {
          background-color: #444;
          border-radius: 4px;
          overflow: hidden;
        }
        .navbar__userAvatar img {
          display: unset !important;
          width: 40px;
          height: 40px;
        }
        .navbar__userDetails {
          display: flex;
          align-items: center;
          gap: 10px;
          border-radius: 100px;
        }
      `}</style>
    </>
  );
}

export default Navbar;
