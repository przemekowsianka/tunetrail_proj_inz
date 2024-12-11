import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
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
    <Container className="d-flex justify-content-center align-items-center max-vh-100">
      <Card className="w-75 p-4 bg-primary border-secondary">
        <Card.Header className="text-center bg-primary text-secondary border-secondary">
          <h2 className="mb-0">Polecamy Gatunek</h2>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6} className="d-flex justify-content-center">
              <Card className="w-100 border-secondary">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center bg-primary">
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
                        typeof tag.Genre?.wiki === "string"
                          ? tag.Genre?.wiki
                          : ""
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
              </Card>
            </Col>
            <Col md={6} className="d-flex justify-content-center">
              <Card className="w-100 border-secondary">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center bg-primary">
                  <div className="d-flex flex-column align-items-center mb-3">
                    <h5>Top utwór dla gatunku: {tag.Genre?.name}</h5>
                    <div
                      className="TAG d-flex mb-3 w-75 justify-content-center align-items-center"
                      style={{
                        backgroundColor: "#8464dd",

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
                        backgroundColor: "#8464dd",

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
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RecommendTag;
