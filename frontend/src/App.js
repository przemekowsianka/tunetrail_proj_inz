import React from "react";
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

  return (
    <div className="d-flex">
      {!isAuthPage && <LeftBar />}{" "}
      {/* Wyświetl LeftBar tylko, jeśli NIE jesteśmy na /login lub /register */}
      <div className="content" style={{ width: isAuthPage ? "100%" : "70%" }}>
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
