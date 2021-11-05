import React from "react";
import { Avatar, Badge, Button, Card, Group, Image, Text, ThemeIcon } from "@mantine/core";
import { MdOutlineMovie } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import { SiNotion } from "react-icons/si";
function NotionContentCard({ title, cover, icon, id, genres, handlePageDeleteConfirm }) {
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
          <Text weight={600} size="lg">
            {title}
          </Text>
        </div>
        <div className="notionContentCard__genres">
          {genres.map((genre) => (
            <Badge variant="dot">{genre.name}</Badge>
          ))}
        </div>
        <Group grow style={{ marginTop: "auto" }}>
          <Button
            leftIcon={<SiNotion />}
            variant="light"
            style={{ padding: 0, height: "32px" }}
            color="blue"
            onClick={() => {
              window.location.href = `https://www.notion.so/${id.replace(/-/g, "")}`;
            }}
          >
            View
          </Button>
          <Button
            variant="light"
            color="red"
            style={{ padding: 0, height: "32px" }}
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
          .notionContentCard__genres {
            display: flex;
            gap: 5px;
            flex-wrap: wrap;
            margin: 10px 0;
          }
          @media only screen and (max-width: 400px) {
            .notionContentCard {
              width: 100%;
            }
            .notionContentCard__genres {
              display: flex;
              gap: 5px;
              flex-wrap: wrap;
              margin: 5px 0;
            }
          }
        `}
      </style>
    </>
  );
}

export default NotionContentCard;
