import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import api from "../http/requestInterceptor";
import parse from "html-react-parser";
import LastFMLogo from "../assets/lastfm.png";
import SpotifyLogo from "../assets/spotify.png";

const DiscoveredArtists = () => {
  const [artists, setArtists] = useState([]); // Lista wszystkich artystów
  const [selectedArtist, setSelectedArtist] = useState(null); // Wybrany artysta do wyświetlenia
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all discovered artists on component mount
  useEffect(() => {
    const fetchDiscoveredArtists = async () => {
      try {
        const response = await api.get("/show/discovered");
        setArtists(response.data);
      } catch (err) {
        setError("Nie udało się pobrać listy artystów.");
        console.error("Error fetching discovered artists:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscoveredArtists();
  }, []);

  // Funkcja, która ustawia wybranego artystę na podstawie kliknięcia w przycisk
  const handleArtistClick = (artist) => {
    setSelectedArtist(artist);
  };

  return (
    <Container fluid className="py-5">
      <h1 className="text-center mb-4">Twoi odkryci artyści</h1>

      <Row>
        {/* Lista artystów w formie przewijanych przycisków */}
        <Col md={4}>
          <Card className="h-100">
            <Card.Header className="bg-primary text-white text-center">
              <h4>Lista artystów</h4>
            </Card.Header>
            <Card.Body
              style={{
                maxHeight: "500px", // Maksymalna wysokość kontenera
                overflowY: "auto", // Przewijanie pionowe
              }}
            >
              {loading && <p>Ładowanie listy artystów...</p>}
              {error && <p className="text-danger">{error}</p>}

              {artists.length > 0 ? (
                artists.map((artist, index) => (
                  <Button
                    key={index}
                    variant="outline-primary"
                    className="w-100 mb-2 text-start"
                    onClick={() => handleArtistClick(artist)}
                  >
                    {artist.name}
                  </Button>
                ))
              ) : (
                <p>Brak artystów do wyświetlenia.</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Szczegóły wybranego artysty */}
        <Col md={8}>
          <Card className="w-100">
            <Card.Header className="bg-primary text-white text-center">
              <h4>Szczegóły artysty</h4>
            </Card.Header>
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              {loading && <p>Ładowanie danych artysty...</p>}
              {error && <p className="text-danger">{error}</p>}

              {selectedArtist ? (
                <>
                  <h5>Artysta: {selectedArtist.name}</h5>
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
                    <p>
                      {parse(
                        selectedArtist.description || "Brak opisu artysty."
                      )}
                    </p>
                  </div>

                  {selectedArtist.imageLastFM && (
                    <img
                      src={selectedArtist.imageLastFM}
                      alt={selectedArtist.name}
                      className="img-fluid my-3 w-25"
                    />
                  )}

                  <p>
                    <strong>Liczba słuchaczy:</strong>{" "}
                    {selectedArtist.listeners || "Brak danych"}
                  </p>

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
                    {selectedArtist.genre1}
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
                    {selectedArtist.genre2}
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
                    {selectedArtist.genre3}
                  </div>

                  <div className="d-flex mt-3 justify-content-center w-100">
                    {selectedArtist.spotify_link && (
                      <a
                        href={selectedArtist.spotify_link}
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
                </>
              ) : (
                <p>Wybierz artystę z listy, aby zobaczyć szczegóły.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DiscoveredArtists;
