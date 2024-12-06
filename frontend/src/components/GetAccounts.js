import React, { useState } from "react";
import api from "../http/requestInterceptor";
const token = localStorage.getItem("token");

// Komponent LastFmLogin
const LastFmLogin = ({ onSubmit }) => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(username);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Last.fm Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <button type="submit">Zapisz</button>
    </form>
  );
};

// Komponent SpotifyAuthButton
const SpotifyAuthButton = () => {
  const handleSpotifyLogin = async () => {
    try {
      const { data: redirectUrl } = await api.get("/users/getaccount/spotify", {
        headers: {
          Authorization: `Bearer ${token}`, // Ustaw token w nagłówku
        },
      });
      window.location.href = redirectUrl; // Przekierowanie na adres podany przez backend
    } catch (error) {
      console.error("Error during Spotify login:", error);
    }
  };

  return (
    <button onClick={handleSpotifyLogin} className="spotify-button">
      Uwierzytelnij konto Spotify
    </button>
  );
};

// Komponent nadrzędny GetAccounts
const GetAccounts = () => {
  const handleLastFmSubmit = async (username) => {
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
    } catch (error) {
      console.error("Error linking Last.fm account:", error);
    }
  };

  return (
    <div>
      <h2>Połącz swoje konta</h2>
      <LastFmLogin onSubmit={handleLastFmSubmit} />
      <SpotifyAuthButton />
    </div>
  );
};

export default GetAccounts;
