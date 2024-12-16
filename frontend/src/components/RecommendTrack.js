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
        {/* Lewa kolumna */}
        <Col md={6} className="d-flex justify-content-center">
          <Card className="w-100 h-100 shadow">
            <Card.Header className="bg-primary text-white text-center">
              <h4>Polecamy Utwór</h4>
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
              <Card.Body className="d-flex flex-column justify-content-center align-items-center ">
                {track.img && (
                  <img
                    src={track.img}
                    alt={track.name}
                    className="img-fluid mb-3 w-50 shadow"
                    style={{ borderRadius: "8px" }}
                  />
                )}
                <h3>{track.name?.name || track.name}</h3>
                <p>{track.artist?.name || track.artist}</p>
              </Card.Body>
            )}
            <Card.Footer
              className="bg-primary d-flex justify-content-center align-items-center"
              style={{ minHeight: "60px" }}
            >
              <Button
                variant="secondary"
                onClick={loadRandomTrack}
                className="btn-sm text-white shadow"
                style={{ fontSize: "0.9rem" }}
              >
                Wylosuj ponownie
              </Button>
            </Card.Footer>
          </Card>
        </Col>

        {/* Prawa kolumna */}
        <Col md={6} className="d-flex justify-content-center">
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
                    {track.tag1?.name || track.tag1}
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
                    {track.tag2?.name || track.tag2}
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
                    {track.tag3?.name || track.tag3}
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
                href={track?.urlLastFM}
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

              {track?.urlSpotify && (
                <Button
                  variant="secondary"
                  href={track?.urlSpotify}
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

export default RecommendTrack;
