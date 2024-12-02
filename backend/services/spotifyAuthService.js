const axios = require("axios");
const qs = require("qs");

// Zmienne środowiskowe, które przechowują klucze aplikacji
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const tokenUrl = "https://accounts.spotify.com/api/token";

// Funkcja do uzyskiwania tokenu dostępowego
async function getSpotifyAccessToken() {
  try {
    const data = qs.stringify({ grant_type: "client_credentials" });

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64")}`,
    };

    const response = await axios.post(tokenUrl, data, { headers });

    // Zwraca token dostępu
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting Spotify access token:", error.message);
    throw new Error("Unable to authenticate with Spotify API");
  }
}

module.exports = {
  getSpotifyAccessToken,
};
