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

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center max-vh-90"
    >
      <Row className="w-100 align-items-stretch">
        <Col xs={12} className="mb-4">
          <div className="text-center">
            <h1 className="display-4 text-primary">Polecamy Gatunek</h1>
          </div>
        </Col>
        <Col md={6} className="d-flex justify-content-center">
          <Card className="w-100 h-100">
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
                <Button variant="secondary" onClick={loadRandomTag}>
                  Spróbuj ponownie
                </Button>
              </Card.Body>
            ) : (
              <Card.Body className="d-flex flex-column justify-content-center align-items-center ">
                <h3>{tag.Genre?.name}</h3>
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
                      typeof tag.Genre?.wiki === "string" ? tag.Genre?.wiki : ""
                    )}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={loadRandomTag}
                  className="mt-3"
                >
                  Wylosuj ponownie
                </Button>
              </Card.Body>
            )}
          </Card>
        </Col>
        <Col md={6} className="d-flex justify-content-center">
          <Card className="w-100 h-100">
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
                <Button variant="secondary" onClick={loadRandomTag}>
                  Spróbuj ponownie
                </Button>
              </Card.Body>
            ) : (
              <Card.Body className="d-flex flex-column justify-content-center align-items-center h-100">
                <div className="d-flex flex-column align-items-center mb-3 w-100">
                  <h5>Top utwór dla gatunku: {tag.Genre?.name}</h5>
                  <div
                    className="TAG d-flex mb-3 w-75 justify-content-center align-items-center"
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
                    className="TAG mb-2 w-35 justify-content-center align-items-center"
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
                <div className="d-flex mt-3 justify-content-center w-100">
                  <a
                    href={tag.Genre?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="ServiceLogo"
                      src={LastFMLogo}
                      alt="Last.fm"
                      style={{ width: "50px" }}
                    />
                  </a>
                </div>
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RecommendTag;
