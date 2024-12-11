import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../http/requestInterceptor";
import ImportUserData from "./import";

const LeftBar = () => {
  const [username, setUsername] = useState(
    localStorage.getItem("lastFmUser") || ""
  ); // Pobieranie nazwy użytkownika z localStorage
  const [activePage, setActivePage] = useState("home"); // Strona domyślna
  const navigate = useNavigate(); // Hook do nawigacji
  const token = localStorage.getItem("token"); // Pobranie tokena z localStorage

  // Funkcja zapisywania konta Last.fm do API
  const handleLastFmSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/users/getaccount/lastfm",
        { username },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ustaw token w nagłówku
          },
        }
      );
      console.log("Last.fm account linked:", response.data);
      localStorage.setItem("lastFmUser", username); // Zapisanie konta w localStorage
    } catch (error) {
      console.error("Error linking Last.fm account:", error);
    }
  };

  // Wylogowanie użytkownika
  const handleLogout = () => {
    localStorage.removeItem("token"); // Usunięcie tokena z localStorage
    localStorage.removeItem("lastFmUser"); // Usunięcie username z localStorage
    navigate("/login"); // Przeniesienie na stronę logowania
  };

  // Zmiana strony (na przykład na /home, /explore, /discovered)
  const handleNavigation = (page) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  return (
    <div
      className="LeftBar d-flex flex-column justify-content-start p-4"
      style={{
        width: "20%",
        minHeight: "100vh",
        backgroundColor: "var(--bs-primary)", // Użycie zmiennej Bootstrap (primary)
        color: "#000", // Tekst czarny
      }}
    >
      <h1 className="Title text-center text-white mb-4">TuneTrail</h1>

      {/* Przycisk nawigacyjny - Strona Główna */}
      <Button
        className="Select w-100 mb-2"
        variant={activePage === "home" ? "secondary" : "primary"}
        onClick={() => handleNavigation("home")}
        style={{
          backgroundColor:
            activePage === "home" ? "var(--bs-secondary)" : "var(--bs-primary)",
          color: activePage === "home" ? "#fff" : "#000",
        }}
      >
        Strona Główna
      </Button>

      {/* Przycisk nawigacyjny - Odkrywaj */}
      <Button
        className="Select w-100 mb-2"
        variant={activePage === "explore" ? "secondary" : "primary"}
        onClick={() => handleNavigation("explore")}
        style={{
          backgroundColor:
            activePage === "explore"
              ? "var(--bs-secondary)"
              : "var(--bs-primary)",
          color: activePage === "explore" ? "#fff" : "#000",
        }}
      >
        Odkrywaj
      </Button>

      {/* Przycisk nawigacyjny - Odkryto */}
      <Button
        className="Select w-100 mb-2"
        variant={activePage === "discovered" ? "secondary" : "primary"}
        onClick={() => handleNavigation("discovered")}
        style={{
          backgroundColor:
            activePage === "discovered"
              ? "var(--bs-secondary)"
              : "var(--bs-primary)",
          color: activePage === "discovered" ? "#fff" : "#000",
        }}
      >
        Odkryto
      </Button>

      {/* Formularz Last.fm - Tylko jeśli użytkownik nie ma zapisanego konta */}
      {!username && (
        <Form onSubmit={handleLastFmSubmit} className="mt-4">
          <Form.Group controlId="formLastFmUsername" className="mb-3">
            <Form.Label className="text-white">Last.fm Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Wpisz nazwę użytkownika"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="secondary" className="w-100">
            Zapisz konto Last.fm
          </Button>
        </Form>
      )}

      {/* Komponent ImportUserData */}
      <ImportUserData />

      {/* Przycisk wylogowania */}
      <Button
        className="Select mt-auto w-100"
        variant="danger"
        onClick={handleLogout}
      >
        Wyloguj się
      </Button>
    </div>
  );
};

export default LeftBar;
