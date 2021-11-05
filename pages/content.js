import { Blockquote, Button, Chip, Group, Image, Loader, Skeleton } from "@mantine/core";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { FiArrowLeft, FiPlusCircle } from "react-icons/fi";
import Navbar from "../components/Navbar";
import { NotionCredContext } from "../context/NotionCred";
import { useNotifications } from "@mantine/notifications";

export let getStaticProps = () => {
  return {
    props: {
      TMDB_API_KEY: process.env.TMDB_API_KEY,
      APPLICATION_URL: process.env.APPLICATION_URL,
    },
  };
};

function Content({ TMDB_API_KEY, APPLICATION_URL }) {
  const notifications = useNotifications();
  let router = useRouter();
  let [notionUserCredentials] = useContext(NotionCredContext);
  const [mediaData, setMediaData] = useState({});

  useEffect(() => {
    let id = router.query.id;
    let type = router.query.type;
    async function fetchData() {
      let response = await fetch(
        `https://api.themoviedb.org/3/${type}/${id}?api_key=2c67fe173afe33c5019a5dacfa010b96&language=en-US`
      );
      let data = await response.json();
      console.log(data);
      setMediaData(data);
    }
    fetchData();
  }, [router.query.id, router.query.type]);

  const handleAddToNotionClick = () => {
    let databaseID = localStorage.getItem("NOTION_WATCHLIST_PAGE_ID");
    let body_content = {
      parent: { database_id: databaseID },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: mediaData?.name ? mediaData?.name : mediaData?.title,
              },
            },
          ],
        },
        Tags: {
          multi_select: mediaData.genres.map((genre) => {
            return { name: genre.name };
          }),
        },
      },
      icon: {
        external: { url: `http://image.tmdb.org/t/p/w500${mediaData.poster_path}` },
      },
      cover: {
        external: {
          url: mediaData.backdrop_path
            ? `http://image.tmdb.org/t/p/w500${mediaData.backdrop_path}`
            : `http://image.tmdb.org/t/p/w500${mediaData.poster_path}`,
        },
      },
      children: [
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            text: [{ type: "text", text: { content: "Description" } }],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            text: [
              {
                type: "text",
                text: {
                  content: mediaData.overview,
                },
              },
            ],
          },
        },
        {
          object: "block",
          type: "quote",
          quote: {
            text: [
              {
                type: "text",
                text: {
                  content: mediaData.tagline,
                },
              },
            ],
          },
        },
      ],
    };
    fetch(`${APPLICATION_URL}/api/add-page-to-db`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: notionUserCredentials.access_token,
        body_content: JSON.stringify(body_content),
      }),
    }).then((response) => {
      response.json().then((data) => {
        console.log(data);
      });
    });
    notifications.showNotification({
      title: `Added To Notion`,
      message: `Added ${mediaData?.name ? mediaData?.name : mediaData?.title} to your page`,
    });
    window.location.replace(`${APPLICATION_URL}/dashboard`);
  };

  if (mediaData.id) {
    return (
      <>
        <Navbar />
        <div className="content">
          {mediaData.poster_path ? (
            <Image
              className="content__coverImage"
              alt={`${mediaData.title} cover`}
              src={`http://image.tmdb.org/t/p/w500${mediaData.poster_path}`}
            />
          ) : (
            <div className="content__coverImage" />
          )}
          <div className="content__textDetails">
            <h1>{mediaData?.name ? mediaData?.name : mediaData?.title}</h1>
            <Skeleton visible={!mediaData} height={8} mt={6} radius="xl" />
            {mediaData?.tagline && (
              <Blockquote className="content__blockquote" cite={mediaData?.name ? mediaData?.name : mediaData?.title}>
                {mediaData?.tagline}
              </Blockquote>
            )}
            <p>{mediaData.overview}</p>
            <div className="content__genres">
              {mediaData.genres?.map((genre) => (
                <div className="content__genreChip" key={genre.id}>
                  {genre.name}
                </div>
              ))}
            </div>
            <div className="content__buttonGroup">
              <Button
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan" }}
                leftIcon={<FiPlusCircle />}
                onClick={handleAddToNotionClick}
              >
                Add to Notion
              </Button>
              <Button variant="outline" leftIcon={<FiArrowLeft />} onClick={() => router.push("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .content {
            max-width: 1000px;
            display: flex;
            gap: 30px;
            padding: 20px;
            margin: 20px auto;
            align-items: center;
          }
          .content__coverImage {
            display: block;
            flex: 1;
            background-color: #565656;
            height: 340px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg fill='%23818181' fill-opacity='0.4'%3E%3Cpath d='M12 0h18v6h6v6h6v18h-6v6h-6v6H12v-6H6v-6H0V12h6V6h6V0zm12 6h-6v6h-6v6H6v6h6v6h6v6h6v-6h6v-6h6v-6h-6v-6h-6V6zm-6 12h6v6h-6v-6zm24 24h6v6h-6v-6z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
            box-shadow: 2.8px 2.8px 2.2px rgba(0, 0, 0, 0.02), 6.7px 6.7px 5.3px rgba(0, 0, 0, 0.028),
              12.5px 12.5px 10px rgba(0, 0, 0, 0.035), 22.3px 22.3px 17.9px rgba(0, 0, 0, 0.042),
              41.8px 41.8px 33.4px rgba(0, 0, 0, 0.05), 100px 100px 80px rgba(0, 0, 0, 0.07);
          }
          .content__coverImage img {
            height: 100%;
            object-fit: contain;
          }
          .content__textDetails {
            flex: 3;
          }
          .content__textDetails h1 {
            margin-bottom: 10px;
            color: #fff;
          }
          .content__genres {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin: 15px 0;
          }
          .content__genreChip {
            display: grid;
            place-items: center;
            background-color: #103250;
            padding: 2px 15px;
            color: white;
            border-radius: 100px;
          }
          .content__buttonGroup {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 10px;
            margin: 20px 0;
          }
          @media only screen and (max-width: 1000px) {
            .content__coverImage {
              min-width: 220px;
              object-fit: cover;
            }
          }
          @media only screen and (max-width: 700px) {
            .content {
              flex-direction: column;
            }
            .content__coverImage {
              width: 150px !important;
              min-width: unset;
              min-height: 200px;
              margin: 0 auto;
            }
            .content__textDetails {
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
            }
            .content__blockquote {
              text-align: left;
            }
            .content__genres {
              justify-content: center;
            }
            .content__buttonGroup {
              justify-content: center;
            }
          }
        `}</style>
      </>
    );
  } else {
    return (
      <div style={{ paddingTop: "40vh", display: "grid", placeItems: "center" }}>
        <Loader size="xl" variant="bars" />
      </div>
    );
  }
}

export default Content;
