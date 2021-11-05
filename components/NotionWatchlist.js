import { Paper, Skeleton, Text } from "@mantine/core";
import React from "react";
import NotionContentCard from "./NotionContentCard";

function NotionWatchlist({ contentData, contentLoading, handlePageDeleteConfirm }) {
  return (
    <>
      <div className="notionWatchlist">
        <div className="notionWatchlist__watching"></div>
        <div className="notionWatchlist__toWatch"></div>
        <div className="notionWatchlist__watched">
          {contentLoading &&
            Array.from(Array(9)).map((e, i) => <Skeleton key={i} height={270} shadow="lg" radius={0} />)}
          {contentData?.map((page) => (
            <NotionContentCard
              className="notionWatchlist__item"
              key={page.id}
              title={page.properties.Name.title[0].plain_text}
              cover={page.cover.external.url}
              icon={page.icon.external.url}
              id={page.id}
              genres={page.properties.Tags.multi_select}
              handlePageDeleteConfirm={handlePageDeleteConfirm}
            />
          ))}
          {contentData?.length === 0 && (
            <Paper shadow="xs" style={{ textAlign: "center", backgroundColor: "#141414", padding: "40px" }}>
              <Text size="xl" weight={700} variant="gradient" gradient={{ from: "indigo", to: "cyan", deg: 45 }}>
                Your watchlist is super fresh !
              </Text>
              <Text size="md" style={{ maxWidth: "300px", margin: "10px auto" }}>
                You can now add new TV Shows, Movies, Anime to your notion page by searching from the search bar above.
              </Text>
            </Paper>
          )}
        </div>
      </div>
      <style jsx>{`
        .notionWatchlist {
          max-width: 950px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .notionWatchlist div {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          grid-gap: 20px;
        }
        @media only screen and (max-width: 400px) {
          .notionWatchlist div {
            display: flex;
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}

export default NotionWatchlist;
