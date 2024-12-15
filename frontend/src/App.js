import React, { useState, useEffect } from "react";
import "./custom.scss";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import LeftBar from "./components/LeftBar";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Discovered from "./pages/Discovered";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <AppContent /> {/* Nowy komponent, który obsługuje widok */}
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const [isLeftBarExpanded, setIsLeftBarExpanded] = useState(
    window.innerWidth >= 1024
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Obsługa zmiany rozmiaru okna
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="d-flex">
      {!isAuthPage && (
        <LeftBar
          isExpanded={isLeftBarExpanded}
          onToggle={(value) => setIsLeftBarExpanded(value)}
        />
      )}
      <div
        className="content"
        style={{
          flexGrow: 1,
          marginLeft: isAuthPage
            ? "0"
            : isLeftBarExpanded && windowWidth >= 1024
            ? "25%"
            : "0",
          transition: "margin-left 0.3s ease-in-out", // Zmieniono na "margin-left"
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/discovered" element={<Discovered />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
