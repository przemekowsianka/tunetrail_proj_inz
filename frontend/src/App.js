import React, { useState } from "react";
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
  const location = useLocation(); // useLocation musi być wewnątrz Routera
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const [isLeftBarExpanded, setIsLeftBarExpanded] = useState(
    window.innerWidth >= 768
  );
  return (
    <div className="d-flex">
      {!isAuthPage && (
        <LeftBar
          isExpanded={isLeftBarExpanded}
          onToggle={(value) => setIsLeftBarExpanded(value)}
        />
      )}{" "}
      {/* Wyświetl LeftBar tylko, jeśli NIE jesteśmy na /login lub /register */}
      <div
        className="content"
        style={{
          flexGrow: 1, // Flexbox: zajmij dostępne miejsce
          marginLeft: isAuthPage ? "0" : isLeftBarExpanded ? "25%" : "0",
          transition: "width 0.3s ease-in-out",
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />{" "}
          {/* Domyślne przekierowanie na login */}
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
