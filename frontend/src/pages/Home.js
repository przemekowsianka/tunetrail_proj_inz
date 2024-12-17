import React from "react";
import { Row, Col } from "react-bootstrap";
import RecommendArtist from "../components/RecommendArtist";
import RecommendTag from "../components/RecommendTag";
import RecommendTrack from "../components/RecommendTrack";
import RecommendAlbum from "../components/RecommendAlbum";

const Home = () => {
  return (
    <div
      style={{
        height: "100vh",
        overflowY: "auto",
        padding: "20px",
        background: "rgb(247,247,247)",
        background:
          "linear-gradient(180deg, rgba(247,247,247,1) 0%, rgba(226,221,242,1) 100%)",
      }}
    >
      <Row className="w-100 align-items-stretch">
        <Col xs={12} className="mb-4">
          <div className="text-center">
            <h1 className="display-4 text-primary">TuneTrail Poleca! </h1>
          </div>
        </Col>
      </Row>
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
