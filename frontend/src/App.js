import React from "react";
import "./custom.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LeftBar from "./components/LeftBar";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Discovered from "./pages/Discovered";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <div className="d-flex">
        <LeftBar />
        <div className="content" style={{ width: "70%" }}>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/discovered" element={<Discovered />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
