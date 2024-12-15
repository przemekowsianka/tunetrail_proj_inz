import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import api from "../http/requestInterceptor";
import parse from "html-react-parser";
import LastFMLogo from "../assets/lastfm.png";
import SpotifyLogo from "../assets/spotify.png";
import {
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaCalendarAlt,
  FaSortNumericDown,
  FaSortNumericUp,
} from "react-icons/fa";

const DiscoveredArtists = () => {
  const [artists, setArtists] = useState([]); // Lista wszystkich artystów
  const [filteredArtists, setFilteredArtists] = useState([]); // Lista przefiltrowanych artystów
  const [selectedArtist, setSelectedArtist] = useState(null); // Wybrany artysta do wyświetlenia
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Wartość wpisana do wyszukiwarki
  const [sortOption, setSortOption] = useState("id-asc"); // Opcja sortowania

  // Fetch all discovered artists on component mount
  useEffect(() => {
    const fetchDiscoveredArtists = async () => {
      try {
        const response = await api.get("/show/discovered");
        setArtists(response.data);
        setFilteredArtists(response.data);
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

  // Obsługa zmiany w polu wyszukiwania
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterAndSortArtists(artists, query, sortOption);
  };

  // Obsługa zmiany opcji sortowania
  const handleSortChange = (option) => {
    setSortOption(option);
    filterAndSortArtists(artists, searchQuery, option);
  };

  // Funkcja filtrowania i sortowania artystów
  const filterAndSortArtists = (artistList, query, sortOption) => {
    let filtered = artistList.filter((artist) =>
      artist.name.toLowerCase().includes(query)
    );

    switch (sortOption) {
      case "id-asc":
        filtered = filtered.sort((a, b) => a.id - b.id);
        break;
      case "id-desc":
        filtered = filtered.sort((a, b) => b.id - a.id);
        break;
      case "name-asc":
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredArtists(filtered);
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center max-vh-90"
    >
      <Row className="align-items-stretch">
        <Col md={4}>
          <Card className="h-100">
            <Card.Header className="bg-primary text-white text-center">
              <h4>Lista artystów</h4>
            </Card.Header>
            <Card.Body className="d-flex flex-column">
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Wyszukaj artystę..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </Form.Group>

              <div className="d-flex justify-content-between mb-3">
                <Button
                  variant={
                    sortOption === "id-asc" ? "secondary" : "outline-primary"
                  }
                  onClick={() => handleSortChange("id-asc")}
                >
                  <FaCalendarAlt /> <FaSortNumericDown />
                </Button>
                <Button
                  variant={
                    sortOption === "id-desc" ? "secondary" : "outline-primary"
                  }
                  onClick={() => handleSortChange("id-desc")}
                >
                  <FaCalendarAlt /> <FaSortNumericUp />
                </Button>
                <Button
                  variant={
                    sortOption === "name-asc" ? "secondary" : "outline-primary"
                  }
                  onClick={() => handleSortChange("name-asc")}
                >
                  <FaSortAlphaDown />
                </Button>
                <Button
                  variant={
                    sortOption === "name-desc" ? "secondary" : "outline-primary"
                  }
                  onClick={() => handleSortChange("name-desc")}
                >
                  <FaSortAlphaUp />
                </Button>
              </div>

              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  padding: "10px",
                }}
              >
                {loading && <p>Ładowanie listy artystów...</p>}
                {error && <p className="text-danger">{error}</p>}
                {filteredArtists.length > 0 ? (
                  filteredArtists.map((artist, index) => (
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
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8} className="d-flex">
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
