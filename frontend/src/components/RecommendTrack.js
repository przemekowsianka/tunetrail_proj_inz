import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Spinner } from "react-bootstrap";
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

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center max-vh-90"
    >
      <Row className="w-100 align-items-stretch">
        <Col xs={12} className="mb-4">
          <div className="text-center">
            <h1 className="display-4 text-primary">Polecamy Utwór</h1>
          </div>
        </Col>

        {/* Lewa kolumna */}
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
                <Button variant="secondary" onClick={loadRandomTrack}>
                  Spróbuj ponownie
                </Button>
              </Card.Body>
            ) : (
              <Card.Body className="d-flex flex-column justify-content-center align-items-center ">
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
            )}
          </Card>
        </Col>

        {/* Prawa kolumna */}
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
                <Button variant="secondary" onClick={loadRandomTrack}>
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
                    {track.tag1?.name || track.tag1}
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
                    {track.tag2?.name || track.tag2}
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
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RecommendTrack;
