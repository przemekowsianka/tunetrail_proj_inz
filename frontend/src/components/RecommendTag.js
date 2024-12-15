import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { fetchRandomTag } from "../services/randomMusicService";
import SpotifyLogo from "../assets/spotify.png";
import LastFMLogo from "../assets/lastfm.png";
import parse from "html-react-parser";

const RecommendTag = () => {
  const [tag, setTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRandomTag = async () => {
    try {
      setLoading(true);
      const data = await fetchRandomTag();
      setTag(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRandomTag();
  }, []);

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center max-vh-90"
    >
      <Row className="w-100 align-items-stretch">
        <Col md={6} className="d-flex justify-content-center">
          <Card className="w-100 h-100 shadow">
            <Card.Header className="bg-primary text-white text-center">
              <h4>Polecamy Gatunek</h4>
            </Card.Header>
            {loading ? (
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                <Spinner
                  animation="border"
                  variant="secondary"
                  className="mb-3"
                />
                <p>Ładowanie...</p>
              </Card.Body>
            ) : error ? (
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                <p className="text-danger mb-3">Błąd: {error}</p>
              </Card.Body>
            ) : (
              <Card.Body className="d-flex flex-column justify-content-center align-items-center ">
                <h3>{tag?.Genre?.name}</h3>
                <div
                  style={{
                    maxHeight: "150px", // Maksymalna wysokość kontenera
                    overflowY: "auto", // Przewijanie pionowe
                    width: "100%", // Szerokość 100% względem rodzica
                    padding: "10px", // Dodatkowy padding
                    border: "1px solid #ccc", // Opcjonalna ramka
                    borderRadius: "8px", // Opcjonalne zaokrąglenie
                    backgroundColor: "#f9f9f9", // Opcjonalny kolor tła
                  }}
                >
                  <p style={{ margin: 0 }}>
                    {parse(
                      typeof tag?.Genre?.wiki === "string"
                        ? tag?.Genre?.wiki
                        : ""
                    )}
                  </p>
                </div>
              </Card.Body>
            )}
            <Card.Footer
              className="bg-primary d-flex justify-content-center align-items-center"
              style={{ minHeight: "60px" }}
            >
              <Button
                variant="secondary"
                onClick={loadRandomTag}
                className="btn-sm text-white shadow"
                style={{ fontSize: "0.9rem" }}
              >
                Wylosuj ponownie
              </Button>
            </Card.Footer>
          </Card>
        </Col>
        <Col md={6} className="d-flex justify-content-center">
          <Card className="w-100 h-100 shadow">
            <Card.Header className="bg-primary text-white text-center">
              <h4>Top Utwór</h4>
            </Card.Header>
            {loading ? (
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                <Spinner
                  animation="border"
                  variant="secondary"
                  className="mb-3"
                />
                <p>Ładowanie...</p>
              </Card.Body>
            ) : error ? (
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                <p className="text-danger mb-3">Błąd: {error}</p>
              </Card.Body>
            ) : (
              <Card.Body className="d-flex flex-column justify-content-center align-items-center h-100">
                <div className="d-flex flex-column align-items-center mb-3 w-100">
                  <div
                    className="TAG d-flex mb-3 w-75 justify-content-center align-items-center shadow"
                    style={{
                      backgroundColor: "#8f74d7",
                      color: "white",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      fontSize: "1.75rem",
                      fontWeight: "bold",
                    }}
                  >
                    {tag.TopTrack?.name}
                  </div>
                  <div
                    className="TAG mb-2 w-35 justify-content-center align-items-center shadow"
                    style={{
                      backgroundColor: "#8f74d7",
                      color: "white",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                    }}
                  >
                    {tag.TopTrack?.artist?.name}
                  </div>
                </div>
              </Card.Body>
            )}
            <Card.Footer
              className="bg-primary text-white d-flex justify-content-center align-items-center"
              style={{ minHeight: "60px" }}
            >
              <Button
                variant="secondary"
                href={tag?.Genre?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sm text-white d-flex align-items-center shadow"
                style={{ fontSize: "0.9rem" }}
              >
                <img
                  src={LastFMLogo}
                  alt="Last.fm"
                  style={{ width: "20px", height: "20px", marginRight: "10px" }}
                />
                Last.FM
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RecommendTag;
