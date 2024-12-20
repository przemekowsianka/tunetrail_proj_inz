import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap";

import SpotifyLogo from "../assets/spotify.png";
import LastFMLogo from "../assets/lastfm.png";
import parse from "html-react-parser";

import api from "../http/requestInterceptor";

const DiscoverMusic = () => {
  const [listeners, setListeners] = useState("");
  const [genreInput, setGenreInput] = useState("");
  const [genres, setGenres] = useState([]);
  const [suggestedGenres, setSuggestedGenres] = useState([]);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch genres suggestions from /show/genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get("/show/genres");
        setSuggestedGenres(response.data);
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    };

    fetchGenres();
  }, []);

  // Add genre to the list when clicked
  const addGenre = (genre) => {
    const genreName =
      typeof genre === "object" && genre?.name ? genre.name : genre; // Upewniamy się, że to string
    if (!genres.includes(genreName)) {
      setGenres((prevGenres) => [...prevGenres, genreName]); // Dodajemy samą nazwę
    }
  };

  const removeGenre = (genre) => {
    setGenres((prevGenres) => prevGenres.filter((g) => g !== genre));
  };

  // Handle form submission
  const handleDiscoverMusic = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/music/discover", {
        genres: genres,
        maxPopularity: parseInt(listeners, 10),
      });
      setResponseData(response.data);
      console.log("Response Data:", response.data); // Debug - Sprawdź strukturę odpowiedzi
    } catch (err) {
      console.error("Error discovering music:", err);
      setError(err.response?.data?.message || "Wystąpił problem z serwerem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center max-vh-90"
    >
      <Row className="w-100 align-items-stretch">
        <Col md={4} className="d-flex">
          <Card className="w-100 h-100">
            <Card.Header className="bg-primary text-white text-center">
              <h4>Preferencje</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleDiscoverMusic}>
                <Form.Group controlId="formListeners" className="mb-3">
                  <Form.Label>Liczba słuchaczy</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Wpisz maksymalną liczbę słuchaczy z Last.fm"
                    value={listeners}
                    onChange={(e) => setListeners(e.target.value)}
                    onBlur={(e) =>
                      setListeners(
                        Math.max(1000, Number(e.target.value) || 1000)
                      )
                    }
                    min="1000" // Minimalna wartość to 1000
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formGenres" className="mb-3">
                  <Form.Label>Gatunki (kliknij, aby dodać)</Form.Label>
                  <InputGroup className="mb-2">
                    <Form.Control
                      type="text"
                      placeholder="Wpisz gatunek"
                      value={genreInput}
                      onChange={(e) => setGenreInput(e.target.value)}
                    />
                    <Button
                      variant="primary"
                      onClick={() => addGenre(genreInput)}
                    >
                      Dodaj
                    </Button>
                  </InputGroup>

                  <div
                    style={{
                      maxHeight: "150px",
                      overflowY: "auto",
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      backgroundColor: "#f9f9f9",
                      display: "flex", // Flexbox
                      flexWrap: "wrap", // Przełamanie do nowej linii
                      justifyContent: "center", // Justowanie do lewej i prawej
                      gap: "10px", // Odstępy między przyciskami
                    }}
                  >
                    {suggestedGenres.map((genre, index) => (
                      <Button
                        key={index}
                        variant="outline-primary"
                        className="m-1"
                        size="sm"
                        onClick={() => addGenre(genre)}
                      >
                        {genre.name || genre}
                      </Button>
                    ))}
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Wybrane gatunki</Form.Label>
                  <div className="d-flex flex-wrap">
                    {genres.map((genre, index) => (
                      <div key={index} className="m-1">
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => removeGenre(genre)}
                        >
                          {genre} ✕
                        </Button>
                      </div>
                    ))}
                  </div>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Odkryj muzykę
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8} className="d-flex justify-content-center">
          <Card className="w-100 h-100">
            <Card.Header className="bg-primary text-white text-center">
              <h4>Wynik</h4>
            </Card.Header>
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              {loading && <p>Ładowanie...</p>}
              {error && <p className="text-danger">{error}</p>}
              {responseData ? (
                <>
                  <h5>Artysta: {responseData.artist?.name}</h5>
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
                        responseData.artist?.bio ||
                          `Brak opisu artysty ${responseData.artist?.name} `
                      )}
                    </p>
                  </div>
                  {responseData.artist?.imageLastFM && (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{
                        width: "150px",
                        height: "150px",
                        overflow: "hidden",
                        borderRadius: "8px",
                        marginTop: "20px",
                      }}
                    >
                      <img
                        src={responseData.artist?.imageLastFM}
                        alt={responseData.artist?.name}
                        className="w-100 h-100"
                        style={{
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                    </div>
                  )}
                  <p>
                    <strong>Liczba słuchaczy:</strong>
                    {responseData.artist?.listeners}
                  </p>

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
                    {responseData.artist.genre1}
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
                    {responseData.artist.genre2}
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
                    {responseData.artist.genre3}
                  </div>

                  <div className="d-flex mt-3 justify-content-center w-100">
                    <Button
                      variant="secondary"
                      href={responseData.artist.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-sm text-white d-flex align-items-center shadow"
                      style={{ fontSize: "0.9rem" }}
                    >
                      <img
                        src={LastFMLogo}
                        alt="Last.fm"
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "10px",
                        }}
                      />
                      Last.FM
                    </Button>

                    {responseData.artist.spotify_url && (
                      <Button
                        variant="secondary"
                        href={responseData.artist.spotify_url}
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
                  </div>
                </>
              ) : (
                <p>Brak danych do wyświetlenia.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DiscoverMusic;
