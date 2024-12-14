import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import parse from "html-react-parser";

import { fetchRandomArtist } from "../services/randomMusicService";

import SpotifyLogo from "../assets/spotify.png";
import LastFMLogo from "../assets/lastfm.png";

import translateText from "../services/translateService";

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

  const bio = artist?.bio || "Brak biografii";
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center max-vh-90"
    >
      <Row className="w-100 align-items-stretch">
        <Col xs={12} className="mb-4">
          <div className="text-center">
            <h1 className="display-4 text-primary">Polecamy Artystę</h1>
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
                <Button variant="secondary" onClick={loadRandomArtist}>
                  Spróbuj ponownie
                </Button>
              </Card.Body>
            ) : (
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                {artist.imageLastFM && (
                  <img
                    src={artist.imageLastFM}
                    alt={artist.name}
                    className="img-fluid mb-3 w-50"
                    style={{ borderRadius: "8px" }}
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
            )}
          </Card>
        </Col>
        <Col md={6} className="d-flex">
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
                <Button variant="secondary" onClick={loadRandomArtist}>
                  Spróbuj ponownie
                </Button>
              </Card.Body>
            ) : (
              <Card.Body className="d-flex flex-column justify-content-center align-items-center h-100">
                <div className="d-flex flex-column align-items-center mb-3 w-100">
                  <div
                    className="TAG mb-2 shadow"
                    style={{
                      backgroundColor: "#8f74d7",
                      color: "white",
                      padding: "15px 30px",
                      borderRadius: "8px",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      textAlign: "center",
                      width: "80%",
                    }}
                  >
                    {artist?.tag1}
                  </div>
                  <div
                    className="TAG mb-2 shadow"
                    style={{
                      backgroundColor: "#8f74d7",
                      color: "white",
                      padding: "15px 30px",
                      borderRadius: "8px",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      textAlign: "center",
                      width: "80%",
                    }}
                  >
                    {artist?.tag2}
                  </div>
                  <div
                    className="TAG mb-2 shadow"
                    style={{
                      backgroundColor: "#8f74d7",
                      color: "white",
                      padding: "15px 30px",
                      borderRadius: "8px",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      textAlign: "center",
                      width: "80%",
                    }}
                  >
                    {artist?.tag3}
                  </div>
                </div>
                <div className="d-flex mt-3 justify-content-center w-100">
                  <a
                    href={artist?.urlLastFM}
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
                  {artist?.urlSpotify && (
                    <a
                      href={artist?.urlSpotify}
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
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RecommendArtist;
