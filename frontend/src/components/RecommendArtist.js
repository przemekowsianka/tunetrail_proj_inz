import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import parse from "html-react-parser";

import { fetchRandomArtist } from "../services/randomMusicService";

import SpotifyLogo from "../assets/spotify.png";
import LastFMLogo from "../assets/lastfm.png";

const RecommendArtist = () => {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRandomArtist = async () => {
    try {
      setLoading(true);
      const data = await fetchRandomArtist(); // Wywołaj funkcję z albumService
      setArtist(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  console.log("Artist object:", artist);
  useEffect(() => {
    loadRandomArtist(); // Załaduj po załadowaniu komponentu
  }, []);

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;
  const bio = artist?.bio || "Brak biografii";
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="w-75 p-4 bg-primary border-secondary">
        <Card.Header className="text-center bg-primary text-secondary border-secondary ">
          <h2 className="mb-0">Polecamy Artystę</h2>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6} className="d-flex justify-content-center">
              <Card className="w-100 border-secondary">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center bg-primary">
                  {artist.imageLastFM && (
                    <img
                      src={artist.imageLastFM}
                      alt={artist.name}
                      className="img-fluid mb-3"
                    />
                  )}
                  <h3>{artist.name}</h3>
                  {/* Kontener przewijanej treści */}
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
                    <p style={{ margin: 0 }}>{parse(bio)}</p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={loadRandomArtist}
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
                    <div
                      className="TAG mb-2"
                      style={{
                        backgroundColor: "#8464dd",

                        padding: "10px 20px",
                        borderRadius: "8px",
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                      }}
                    >
                      {artist.tag1}
                    </div>
                    <div
                      className="TAG mb-2"
                      style={{
                        backgroundColor: "#8464dd",

                        padding: "10px 20px",
                        borderRadius: "8px",
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                      }}
                    >
                      {artist.tag2}
                    </div>
                    <div
                      className="TAG mb-2"
                      style={{
                        backgroundColor: "#8464dd",

                        padding: "10px 20px",
                        borderRadius: "8px",
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                      }}
                    >
                      {artist.tag3}
                    </div>
                  </div>
                  <div className="d-flex mt-3 justify-content-center w-100">
                    <a
                      href={artist.urlLastFM}
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
                    {artist.urlSpotify && (
                      <a
                        href={artist.urlSpotify}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={SpotifyLogo}
                          alt="Spotify"
                          style={{ width: "50px" }}
                        />
                      </a>
                    )}
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

export default RecommendArtist;
