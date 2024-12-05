const UserAPI = require("../models/users_api");
const axios = require("axios");
const SPOTIFY_API_URL = "https://api.spotify.com/v1/";
const { getSpotifyAccessToken } = require("../services/spotifyAuthService"); // Funkcja do autoryzacji Spotify API

exports.saveLastFmAccount = async (req, res) => {
  const { username } = req.body;
  const userId = req.user.id;

  try {
    await UserAPI.upsert({
      user_id: userId,
      lastfm_account: username,
    });

    res.json({ message: "Last.fm account saved successfully!" });
  } catch (error) {
    console.error("Error saving Last.fm account:", error);
    res.status(500).json({ message: "Failed to save Last.fm account." });
  }
};

exports.saveSpotifyaccount = async (req, res) => {
  //const { code } = req.query;

  try {
    const spotifyToken = await getSpotifyAccessToken(); // Funkcja do autoryzacji

    const { access_token } = spotifyToken.data;

    // Pobierz dane użytkownika
    const userResponse = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const spotifyUser = userResponse.data;

    // Zapisz dane w bazie
    const userId = req.user.id; // Zakładamy, że middleware JWT ustawia req.user
    await UserAPI.upsert({
      user_id: userId,
      spotify_account: spotifyUser.id,
    });

    res.json({ message: "Spotify account linked successfully!", spotifyUser });
  } catch (error) {
    console.error("Error during Spotify authentication:", error);
    res.status(500).json({ message: "Failed to link Spotify account." });
  }
};
