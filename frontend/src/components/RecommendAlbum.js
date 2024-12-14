import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { fetchRandomAlbum } from "../services/randomMusicService";
import SpotifyLogo from "../assets/spotify.png";
import LastFMLogo from "../assets/lastfm.png";

const RecommendAlbum = () => {
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRandomAlbum = async () => {
    try {
      setLoading(true);
      setError(null); // Reset błędu podczas nowej próby
      const data = await fetchRandomAlbum();
      setAlbum(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRandomAlbum();
  }, []);

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center max-vh-90"
    >
      <Row className="w-100 align-items-stretch">
        <Col xs={12} className="mb-4">
          <div className="text-center">
            <h1 className="display-4 text-primary">Polecamy Album</h1>
          </div>
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
                <Button variant="secondary" onClick={loadRandomAlbum}>
                  Spróbuj ponownie
                </Button>
              </Card.Body>
            ) : (
              <Card.Body className="d-flex flex-column justify-content-around align-items-center h-100">
                {album.imageLastFM && (
                  <img
                    src={album.imageLastFM}
                    alt={album.name}
                    className="img-fluid mb-3 w-50"
                    style={{
                      borderRadius: "8px",

                      objectFit: "cover",
                    }}
                  />
                )}
                <h3 className="text-center flex-grow-1">{album.name}</h3>
                <p className="text-center">{album.artist}</p>
                <Button
                  variant="secondary"
                  onClick={loadRandomAlbum}
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
                <Button variant="secondary" onClick={loadRandomAlbum}>
                  Spróbuj ponownie
                </Button>
              </Card.Body>
            ) : (
              <Card.Body className="d-flex flex-column justify-content-center align-items-center h-100">
                <div className="d-flex flex-column align-items-center mb-3 w-100">
                  <div
                    className="TAG mb-2"
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
                    {album.genre1}
                  </div>
                  <div
                    className="TAG mb-2"
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
                    {album.genre2}
                  </div>
                  <div
                    className="TAG mb-2"
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
                    {album.genre3}
                  </div>
                </div>
                <div className="d-flex mt-3 justify-content-center w-100">
                  <a
                    href={album.urlLastFM}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="ServiceLogo"
                      src={LastFMLogo}
                      alt="Last.fm"
                      style={{ width: "60px" }}
                    />
                  </a>
                  {album.urlSpotify && (
                    <a
                      href={album.urlSpotify}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={SpotifyLogo}
                        alt="Spotify"
                        style={{ width: "60px" }}
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

export default RecommendAlbum;
