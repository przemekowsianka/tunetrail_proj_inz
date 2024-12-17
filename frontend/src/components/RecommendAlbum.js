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
        <Col md={6} className="d-flex">
          <Card className="w-100 h-100 shadow">
            <Card.Header className="bg-primary text-white text-center">
              <h4>Polecamy Album</h4>
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
              <Card.Body className="d-flex flex-column justify-content-around align-items-center h-100">
                {album.imageLastFM && (
                  <img
                    src={album.imageLastFM}
                    alt={album.name}
                    className="img-fluid mb-3 w-50 shadow"
                    style={{
                      borderRadius: "8px",

                      objectFit: "cover",
                    }}
                  />
                )}
                <h3 className="text-center flex-grow-1">{album.name}</h3>
                <p className="text-center">{album.artist}</p>
              </Card.Body>
            )}
            <Card.Footer
              className="bg-primary d-flex justify-content-center align-items-center"
              style={{ minHeight: "60px" }}
            >
              <Button
                variant="secondary"
                onClick={loadRandomAlbum}
                className="btn-sm text-white shadow"
                style={{ fontSize: "0.9rem" }}
              >
                Wylosuj ponownie
              </Button>
            </Card.Footer>
          </Card>
        </Col>

        <Col md={6} className="d-flex">
          <Card className="w-100 h-100 shadow">
            <Card.Header className="bg-primary text-white text-center">
              <h4>Gatunki</h4>
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
                    {album.genre1}
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
                    {album.genre2}
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
                    {album.genre3}
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
                href={album?.urlLastFM}
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

              {album?.urlSpotify && (
                <Button
                  variant="secondary"
                  href={album?.urlSpotify}
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

export default RecommendAlbum;
