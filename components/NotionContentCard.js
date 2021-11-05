import React from "react";
import { Avatar, Button, Card, Group, Image, Text, ThemeIcon } from "@mantine/core";
import { MdOutlineMovie } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import { SiNotion } from "react-icons/si";
function NotionContentCard({ title, cover, icon, id, handlePageDeleteConfirm }) {
  return (
    <>
      <Card className="notionContentCard" shadow="sm" padding="lg">
        <Card.Section>
          <Image src={cover} alt={title + "cover"} height={110} withPlaceholder />
        </Card.Section>
        <div className="notionContentCardTitleIconWrapper">
          <Avatar src={icon} alt="" height={30}>
            <MdOutlineMovie />
          </Avatar>
          <Text weight={500} size="lg">
            {title}
          </Text>
        </div>
        <Group grow style={{ marginTop: "auto" }}>
          <Button
            compact
            leftIcon={<SiNotion />}
            style={{ fontSize: "12px" }}
            variant="light"
            color="blue"
            onClick={() => {
              window.location.href = `https://www.notion.so/${id.replace(/-/g, "")}`;
            }}
          >
            View
          </Button>
          <Button
            compact
            variant="light"
            style={{ fontSize: "12px" }}
            color="red"
            leftIcon={<FiTrash2 />}
            onClick={() => {
              console.log("clicked");
              handlePageDeleteConfirm(id);
            }}
          >
            Delete
          </Button>
        </Group>
      </Card>
      <style jsx global>
        {`
          .notionContentCard {
            margin: 0 auto;
            display: flex;
            flex-direction: column;
          }
          .notionContentCardTitleIconWrapper {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 10px 0;
          }
        `}
      </style>
    </>
  );
}

export default NotionContentCard;
