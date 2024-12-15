import React from "react";
import { Row, Col } from "react-bootstrap";
import DiscoveredArtists from "../components/DiscoveredArtists";

const Explore = () => {
  return (
    <div
      style={{
        height: "100vh", // Ustawienie pełnej wysokości ekranu
        overflowY: "auto", // Włączenie przewijania
        padding: "20px", //Opcjonalny padding dla treści
        background: "rgb(247,247,247)",
        background:
          "linear-gradient(180deg, rgba(247,247,247,1) 0%, rgba(226,221,242,1) 100%)",
      }}
    >
      <Row className="w-100 align-items-stretch">
        <Col xs={12} className="mb-4">
          <div className="text-center">
            <h1 className="display-4 text-primary">Twoi odkryci artyści! </h1>
          </div>
        </Col>
      </Row>
      <DiscoveredArtists />
    </div>
  );
};

export default Explore;
