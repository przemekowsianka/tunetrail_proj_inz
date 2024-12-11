import React from "react";

import DiscoveredArtists from "../components/DiscoveredArtists";

const Explore = () => {
  return (
    <div
      style={{
        height: "100vh", // Ustawienie pełnej wysokości ekranu
        overflowY: "auto", // Włączenie przewijania
        padding: "20px", //Opcjonalny padding dla treści
      }}
    >
      <DiscoveredArtists />
    </div>
  );
};

export default Explore;
