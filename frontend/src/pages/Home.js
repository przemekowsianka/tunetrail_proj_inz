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
        padding: "20px", // Opcjonalny padding dla treści
      }}
    >
      <RecommendArtist />
      <RecommendAlbum />
      <RecommendTrack />
      <RecommendTag />
    </div>
  );
};

export default Home;
