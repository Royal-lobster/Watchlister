import { Button, Chip, Image, Loader, Skeleton } from "@mantine/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import Navbar from "../components/Navbar";

export let getStaticProps = () => {
  return {
    props: {
      TMDB_API_KEY: process.env.TMDB_API_KEY,
    },
  };
};

function Content({ TMDB_API_KEY }) {
  let router = useRouter();
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
    console.log(mediaData);
  }, [router.query.id, router.query.type]);
  if (mediaData.id) {
    return (
      <>
        <Navbar />
        <div className="content">
          {mediaData.poster_path ? (
            <img className="content__coverImage" src={`http://image.tmdb.org/t/p/w500${mediaData.poster_path}`} />
          ) : (
            <div className="content__coverImage" />
          )}
          <div className="content__textDetails">
            <h1>{mediaData?.name ? mediaData?.name : mediaData?.title}</h1>
            <Skeleton visible={!mediaData} height={8} mt={6} radius="xl" />
            <p>{mediaData.overview}</p>
            <div className="content__genres">
              {mediaData.genres?.map((genre) => (
                <div className="content__genreChip" key={genre.id}>
                  {genre.name}
                </div>
              ))}
            </div>
            <Button
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan" }}
              style={{ marginTop: "20px" }}
              leftIcon={<FiPlusCircle />}
            >
              Add to Notion
            </Button>
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
            border-radius: 6px;
            overflow: hidden;
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
            gap: 5px;
            margin: 15px 0;
          }
          .content__genreChip {
            background-color: #103250;
            padding: 2px 15px;
            color: white;
            border-radius: 100px;
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
