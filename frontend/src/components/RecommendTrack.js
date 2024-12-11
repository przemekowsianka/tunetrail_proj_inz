import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { fetchRandomTrack } from "../services/randomMusicService";
import SpotifyLogo from "../assets/spotify.png";
import LastFMLogo from "../assets/lastfm.png";

const RecommendTrack = () => {
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRandomTrack = async () => {
    try {
      setLoading(true);
      const data = await fetchRandomTrack();
      console.log("Track data:", data);
      setTrack({
        ...data,
        tag1: typeof data.tag1 === "object" ? data.tag1.name : data.tag1,
        tag2: typeof data.tag2 === "object" ? data.tag2.name : data.tag2,
        tag3: typeof data.tag3 === "object" ? data.tag3.name : data.tag3,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRandomTrack();
  }, []);

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;

  return (
    <Container className="d-flex justify-content-center align-items-center max-vh-100">
      <Card className="w-75 p-4 bg-primary border-secondary">
        <Card.Header className="text-center bg-primary text-secondary border-secondary">
          <h2 className="mb-0">Polecamy Utwór</h2>
        </Card.Header>
        <Card.Body>
          <Row>
            {/* Lewa kolumna */}
            <Col md={6} className="d-flex justify-content-center">
              <Card className="w-100 border-secondary">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center bg-primary">
                  {track.img && (
                    <img
                      src={track.img}
                      alt={track.name}
                      className="img-fluid mb-3 w-50"
                      style={{ borderRadius: "8px" }}
                    />
                  )}
                  <h3>{track.name?.name || track.name}</h3>
                  <p>{track.artist?.name || track.artist}</p>
                  <Button
                    variant="secondary"
                    onClick={loadRandomTrack}
                    className="mt-3"
                  >
                    Wylosuj ponownie
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Prawa kolumna */}
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
                      {track.tag1?.name || track.tag1}
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
                      {track.tag2?.name || track.tag2}
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
                      {track.tag3?.name || track.tag3}
                    </div>
                  </div>

                  <div className="d-flex mt-3 justify-content-center w-100">
                    <a
                      href={track.urlLastFM}
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

                    {track.urlSpotify && (
                      <a
                        href={track.urlSpotify}
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

export default RecommendTrack;
