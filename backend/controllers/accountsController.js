const UserAPI = require("../models/users_api");
//const User = require("../models/users");
const axios = require("axios");
const querystring = require("querystring");

const SPOTIFY_API_URL = "https://api.spotify.com/v1/";
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URL = process.env.SPOTIFY_REDIRECT_URL;
const SPOTIFY_SCOPES = "user-read-private";

exports.saveLastFmAccount = async (req, res) => {
  console.log("req: ", req);
  const { username } = req.body;
  const userId = req.user.id;
  console.log("userId:", userId);
  console.log("username:", username);
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

exports.spotifyLogin = (req, res) => {
  const query = querystring.stringify({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: SPOTIFY_SCOPES,
    redirect_uri: REDIRECT_URL,
  });
  console.log(
    "Spotify Auth URL:",
    `https://accounts.spotify.com/authorize?${query}`
  );
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${query}`;
  res.redirect(spotifyAuthUrl);
};

exports.saveSpotifyAccount = async (req, res) => {
  const { code } = req.query;

  try {
    // 1. Wymień `code` na tokeny dostępu
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_url: REDIRECT_URL,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = tokenResponse.data;

    // 2. Pobierz dane użytkownika Spotify
    const userResponse = await axios.get(`${SPOTIFY_API_URL}me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const spotifyUser = userResponse.data;

    // 3. Zapisz dane w bazie
    const userId = req.user.id; // Zakładamy, że middleware JWT ustawia req.user
    console.log("user spoti: ", spotifyUser);
    await UserAPI.upsert({
      user_id: userId,
      spotify_account: spotifyUser.id,
    });

    // 4. Odpowiedz na żądanie
    res.json({ message: "Spotify account linked successfully!", spotifyUser });
  } catch (error) {
    console.error("Error during Spotify authentication:", error.message);
    res.status(500).json({ message: "Failed to link Spotify account." });
  }
};
