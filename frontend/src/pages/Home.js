import React from "react";

import RecommendArtist from "../components/RecommendArtist";
import RecommendTag from "../components/RecommendTag";
import RecommendTrack from "../components/RecommendTrack";
import RecommendAlbum from "../components/RecommendAlbum";

const Home = () => {
  return (
    <div
      style={{
        height: "100vh", // Ustawienie pełnej wysokości ekranu
        overflowY: "auto", // Włączenie przewijania
        padding: "20px",
        background: "rgb(247,247,247)",
        background:
          "linear-gradient(180deg, rgba(247,247,247,1) 0%, rgba(226,221,242,1) 100%)",
      }}
    >
      <div style={{ marginBottom: "80px" }}>
        <RecommendArtist />
      </div>

      <div style={{ marginBottom: "80px" }}>
        <RecommendAlbum />
      </div>

      <div style={{ marginBottom: "80px" }}>
        <RecommendTrack />
      </div>

      <div>
        <RecommendTag />
      </div>
    </div>
  );
};

export default Home;
