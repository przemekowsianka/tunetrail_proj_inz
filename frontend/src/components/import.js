import React, { useState } from "react";
import { Container, Card, Button, Alert, Spinner } from "react-bootstrap";
import api from "../http/requestInterceptor"; // Użycie interceptora

const ImportUserData = () => {
  const [loading, setLoading] = useState(false); // Flaga do stanu ładowania
  const [message, setMessage] = useState(""); // Komunikat dla użytkownika
  const [error, setError] = useState(null); // Obsługa błędów

  /**
   * Funkcja do obsługi importu danych
   * @param {string} endpoint - Endpoint, do którego wysyłane jest żądanie
   * @param {string} successMessage - Wiadomość sukcesu wyświetlana użytkownikowi
   */
  const importData = async (endpoint, successMessage) => {
    try {
      setLoading(true);
      setMessage(""); // Czyścimy poprzedni komunikat
      setError(null); // Czyścimy poprzedni błąd

      // Wysłanie żądania POST do API (używamy interceptora, więc token jest automatyczny)
      const response = await api.post(endpoint);

      console.log("Response from", endpoint, response.data);
      setMessage(successMessage);
    } catch (error) {
      console.error("Błąd podczas importowania danych:", error);
      setError(
        error.response?.data?.message ||
          "Wystąpił błąd podczas importowania danych."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-100 p-4 bg-primary padding-10">
      <Card.Body className="d-flex flex-column align-items-center">
        {/* Komunikat sukcesu */}
        {message && (
          <Alert variant="success" className="w-100 text-center">
            {message}
          </Alert>
        )}

        {/* Komunikat o błędzie */}
        {error && (
          <Alert variant="danger" className="w-100 text-center">
            {error}
          </Alert>
        )}

        {/* Przyciski importu */}
        <Button
          variant="secondary"
          className="mb-3 w-100 shadow"
          onClick={() =>
            importData(
              "/music/top-artists",
              "Pomyślnie zaimportowano wszystkich artystów."
            )
          }
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" /> Importowanie artystów...
            </>
          ) : (
            "Importuj wszystkich artystów"
          )}
        </Button>

        <Button
          variant="secondary"
          className="mb-3 w-100 shadow"
          onClick={() =>
            importData(
              "/music/top-tracks",
              "Pomyślnie zaimportowano top utwory."
            )
          }
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" /> Importowanie top utworów
              i gatunków...
            </>
          ) : (
            "Importuj top utwory i gatunki"
          )}
        </Button>

        <Button
          variant="secondary"
          className="mb-3 w-100 shadow"
          onClick={() =>
            importData(
              "/music/recent-artists",
              "Pomyślnie zaimportowano ostatnich artystów."
            )
          }
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" /> Importowanie ostatnich
              artystów...
            </>
          ) : (
            "Importuj ostatnich artystów"
          )}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ImportUserData;
