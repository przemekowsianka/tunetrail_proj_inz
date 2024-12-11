import React from "react";

import DiscoverMusic from "../components/DiscoverMusic";

const Explore = () => {
  return (
    <div
      style={{
        height: "100vh", // Ustawienie pełnej wysokości ekranu
        overflowY: "auto", // Włączenie przewijania
        padding: "20px", //Opcjonalny padding dla treści
      }}
    >
      <DiscoverMusic />
    </div>
  );
};

export default Explore;
