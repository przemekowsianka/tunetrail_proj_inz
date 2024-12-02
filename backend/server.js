require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const { sequelize } = require("./models");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const musicRoutes = require("./routes/musicRoutes");
const axios = require("axios");
const app = express();

// Middleware globalne
const cors = require("cors");
app.use(cors());
app.use(express.json()); // Parsowanie JSON dla żądań

// Middleware do obsługi błędów JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("Invalid JSON:", err.message);
    return res.status(400).json({ error: "Invalid JSON format" });
  }
  next();
});

// Ścieżka bazowa API
app.get("/api", (req, res) => {
  res.send("Welcome to the API");
});

// Routing dla API
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);

// Konfiguracja połączenia z bazą MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Sprawdzenie połączenia z bazą danych
db.connect((error) => {
  if (error) {
    console.error("Błąd połączenia z MySQL:", error.message);
  } else {
    console.log("Połączono z MySQL");
  }
});

// Przykładowa trasa do testowania połączenia
app.get("/test-db", (req, res) => {
  db.query("SELECT 1 + 1 AS solution", (error, results) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json({ solution: results[0].solution });
  });
});

// Synchronizacja modeli Sequelize
(async () => {
  try {
    await sequelize.sync({ alter: false }); // Ustawienie alter: false
    console.log("Modele zsynchronizowane z bazą danych");
  } catch (error) {
    console.error("Błąd synchronizacji modeli:", error);
  }
})();

// Uruchomienie serwera
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
(async () => {
  try {
    const response = await axios.get("http://ws.audioscrobbler.com/2.0/", {
      params: {
        method: "chart.gettopartists",
        api_key: process.env.LASTFM_API_KEY, // Zastąp właściwym kluczem
        format: "json",
      },
    });
    console.log("Test połączenia z Last.fm:", response.data);
  } catch (error) {
    console.error("Błąd połączenia z Last.fm:", error.message);
    if (error.response) {
      console.error("Szczegóły odpowiedzi:", error.response.data);
    }
  }
})();
