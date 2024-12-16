import React, { useState, useEffect } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../http/requestInterceptor";
import ImportUserData from "./import";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const LeftBar = ({ isExpanded: initialExpanded, onToggle }) => {
  const [username, setUsername] = useState(""); // Nazwa konta Last.fm
  const [isAccountSaved, setIsAccountSaved] = useState(false); // Czy konto jest zapisane?
  const [isEditingUsername, setIsEditingUsername] = useState(false); // Czy edytujemy username?
  const [activePage, setActivePage] = useState("home");
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Obsługa zmiany rozmiaru okna - aby lepiej kontrolować LeftBar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔍 **Sprawdzenie, czy konto Last.fm istnieje w bazie danych**
  useEffect(() => {
    const checkLastFmAccount = async () => {
      try {
        const response = await api.get("/show/lastfm");
        if (response.data.length > 0 && response.data[0].lastfm_account) {
          setUsername(response.data[0].lastfm_account); // Ustaw nazwę konta
          setIsAccountSaved(true); // Oznacz, że konto jest zapisane
        }
      } catch (error) {
        console.error("Błąd podczas pobierania konta Last.fm:", error);
      }
    };

    checkLastFmAccount();
  }, []);

  const handleLastFmSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/users/getaccount/lastfm",
        { username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Last.fm account linked:", response.data);
      setIsAccountSaved(true);
      setIsEditingUsername(false); // Po zapisaniu pola, zakończ tryb edycji
    } catch (error) {
      console.error("Błąd podczas zapisywania konta Last.fm:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("lastFmUser");
    navigate("/login");
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    navigate(`/${page}`);
    if (window.innerWidth < 1024) setIsExpanded(false);
  };

  const toggleLeftBar = () => setIsExpanded((prev) => !prev);

  const handleEditUsername = () => {
    setIsEditingUsername(true); // Zmień stan, aby umożliwić edycję
  };

  return (
    <>
      {/* Przycisk do rozwijania LeftBar (tylko na małych ekranach) */}
      <Button
        onClick={toggleLeftBar}
        className="menu-toggle-btn d-big-none"
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1000,
          backgroundColor: "var(--bs-primary)",
          border: "none",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
        }}
      >
        {isExpanded ? (
          <AiOutlineClose size={24} color="#fff" />
        ) : (
          <AiOutlineMenu size={24} color="#fff" />
        )}
      </Button>

      <div
        className={`LeftBar d-flex flex-column justify-content-start p-4 ${
          isExpanded ? "expanded" : ""
        }`}
        style={{
          width: isExpanded
            ? window.innerWidth >= 1024
              ? "25%"
              : "100%"
            : "0",
          minHeight: "100vh",
          backgroundColor: "var(--bs-primary)",
          color: "#000",
          position: "fixed",
          left: isExpanded ? 0 : "-100%",
          top: 0,
          zIndex: 999,
          transition: "all 0.3s ease-in-out",
          overflow: "hidden",
          display: isExpanded || window.innerWidth >= 1024 ? "flex" : "none",
        }}
      >
        <h1 className="Title text-center text-white mb-4">TuneTrail</h1>
        <div style={{ height: "100%", overflowY: "auto" }}>
          <Button
            className="Select w-100 mb-2"
            variant={activePage === "home" ? "secondary" : "primary"}
            onClick={() => handleNavigation("home")}
          >
            Strona Główna
          </Button>

          <Button
            className="Select w-100 mb-2"
            variant={activePage === "explore" ? "secondary" : "primary"}
            onClick={() => handleNavigation("explore")}
          >
            Odkrywaj
          </Button>

          <Button
            className="Select w-100 mb-2"
            variant={activePage === "discovered" ? "secondary" : "primary"}
            onClick={() => handleNavigation("discovered")}
          >
            Odkryto
          </Button>

          <Form onSubmit={handleLastFmSubmit} className="mt-4">
            <Form.Group controlId="formLastFmUsername" className="mb-3">
              <Form.Label className="text-white">Last.fm Username</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Wpisz nazwę użytkownika"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isAccountSaved && !isEditingUsername}
                  style={{
                    width:
                      isAccountSaved && !isEditingUsername ? "70%" : "100%",
                  }}
                />
                {isAccountSaved && !isEditingUsername && (
                  <Button
                    variant="secondary"
                    onClick={handleEditUsername}
                    className="ml-2"
                    style={{
                      height: "38px",
                      fontSize: "0.8rem",
                      padding: "0 10px",
                    }}
                  >
                    Zmień
                  </Button>
                )}
              </InputGroup>
            </Form.Group>

            {(!isAccountSaved || isEditingUsername) && (
              <Button type="submit" variant="secondary" className="w-100">
                Zapisz konto Last.fm
              </Button>
            )}
          </Form>

          <ImportUserData />

          <Button
            className="Select mt-auto w-100"
            variant="warning"
            onClick={handleLogout}
          >
            Wyloguj się
          </Button>
        </div>
      </div>
    </>
  );
};

export default LeftBar;
