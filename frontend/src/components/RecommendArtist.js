import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import parse from "html-react-parser";

import { fetchRandomArtist } from "../services/randomMusicService";

import SpotifyLogo from "../assets/spotify.png";
import LastFMLogo from "../assets/lastfm.png";

const RecommendArtist = () => {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [translatedBio, setTranslatedBio] = useState("");
  const [translating, setTranslating] = useState(false);

  const loadRandomArtist = async () => {
    try {
      setLoading(true);
      const data = await fetchRandomArtist();
      setArtist(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadRandomArtist();
  }, []);
  useEffect(() => {
    if (artist?.bio) {
      translateBio(artist.bio);
    }
  }, [artist]);

  const bio = artist?.bio || "Brak biografii";

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center max-vh-90"
    >
      <Row className="w-100 align-items-stretch">
        <Col md={6} className="d-flex justify-content-center">
          <Card className="w-100 h-100 shadow">
            <Card.Header className="bg-primary text-white text-center">
              <h4>Polecamy artystę</h4>
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
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                {artist.imageLastFM && (
                  <img
                    src={artist.imageLastFM}
                    alt={artist.name}
                    className="img-fluid mb-3 w-50 shadow"
                    style={{ borderRadius: "8px" }}
                  />
                )}
                <h3>{artist.name}</h3>
              </Card.Body>
            )}
            <Card.Footer
              className="bg-primary d-flex justify-content-center align-items-center"
              style={{ minHeight: "60px" }}
            >
              <Button
                variant="secondary"
                onClick={loadRandomArtist}
                className="btn-sm text-white shadow"
                style={{ fontSize: "0.9rem" }}
              >
                Wylosuj ponownie
              </Button>
            </Card.Footer>
          </Card>
        </Col>

        <Col md={6} className="d-flex">
          <Card className="w-100 h-100">
            <Card.Header className="bg-primary text-white text-center">
              <h4>Opis i gatunki</h4>
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
                    style={{
                      maxHeight: "150px",
                      overflowY: "auto",
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    {translating ? (
                      <p>Trwa tłumaczenie biografii...</p>
                    ) : (
                      <p style={{ margin: 0 }}>{parse(bio)}</p>
                    )}
                  </div>
                  <div
                    className="TAG mb-2 shadow max-vh-5"
                    style={{
                      backgroundColor: "#845df4",
                      color: "white",
                      padding: "15px 30px",
                      borderRadius: "8px",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      textAlign: "center",
                      width: "80%",
                      marginTop: "20px",
                    }}
                  >
                    {artist?.tag1}
                  </div>
                  <div
                    className="TAG mb-2 shadow"
                    style={{
                      backgroundColor: "#845df4",
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
                      backgroundColor: "#845df4",
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
              </Card.Body>
            )}
            <Card.Footer
              className="bg-primary text-white d-flex justify-content-center align-items-center"
              style={{ minHeight: "60px" }}
            >
              <Button
                variant="secondary"
                href={artist?.urlLastFM}
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

              {artist?.urlSpotify && (
                <Button
                  variant="secondary"
                  href={artist?.urlSpotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-sm text-white d-flex align-items-center ms-2 shadow"
                  style={{ fontSize: "0.9rem" }}
                >
                  <img
                    src={SpotifyLogo}
                    alt="Spotify"
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "10px",
                    }}
                  />
                  Spotify
                </Button>
              )}
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RecommendArtist;
