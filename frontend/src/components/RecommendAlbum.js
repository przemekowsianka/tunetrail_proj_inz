import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
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

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="w-75 p-4 bg-primary border-secondary">
        <Card.Header className="text-center bg-primary text-secondary border-secondary">
          <h2 className="mb-0">Polecamy Album</h2>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6} className="d-flex justify-content-center">
              <Card className="w-100 border-secondary">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center bg-primary">
                  {album.imageLastFM && (
                    <img
                      src={album.imageLastFM}
                      alt={album.name}
                      className="img-fluid mb-3"
                    />
                  )}
                  <h3>{album.name}</h3>
                  <p>{album.artist}</p>
                  <Button
                    variant="secondary"
                    onClick={loadRandomAlbum}
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
                      {album.genre1}
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
                      {album.genre2}
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
                        style={{ width: "50px" }}
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

export default RecommendAlbum;
