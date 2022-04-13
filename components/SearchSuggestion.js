import React from "react";
import { Avatar, ThemeIcon } from "@mantine/core";
import { MdOutlineMovie } from "react-icons/md";
import { useRouter } from "next/router";
function SearchSuggestion({ name, mediaType, posterPath, id }) {
  let router = useRouter();
  let handleSuggestionClick = () => {
    router.push(`/content?id=${id}&type=${mediaType}`);
  };
  return (
    <>
      <button type="button" className="searchSuggestion" onClick={handleSuggestionClick} tabIndex="0">
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Avatar src={`http://image.tmdb.org/t/p/w500/${posterPath}`} alt="" height={30}>
            <MdOutlineMovie />
          </Avatar>
          <p style={{ textAlign: "left" }}>{name}</p>
        </div>
        <ThemeIcon
          variant="gradient"
          gradient={mediaType == "tv" ? { from: "orange", to: "red" } : { from: "indigo", to: "cyan" }}
          className="searchSuggestion__mediaType"
        >
          {mediaType}
        </ThemeIcon>
      </button>
      <style jsx global>{`
        .searchSuggestion {
          display: flex;
          width: 95%;
          border: 0;
          color: #eeeeee;
          cursor: pointer;
          justify-content: space-between;
          align-items: center;
          background-color: #141414;
          padding: 10px;
          margin: 10px auto;
          border-radius: 4px;
        }
        .searchSuggestion__mediaType {
          width: unset !important;
          padding: 0 5px;
          flex-shrink: 0;
        }
      `}</style>
    </>
  );
}

export default SearchSuggestion;
