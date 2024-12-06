import React, { useState } from "react";
const token = localStorage.getItem("token");

const FetchUserData = () => {
  const [results, setResults] = useState({
    artists: null,
    tracks: null,
    tags: null,
  });
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const userId = 7; // Zamień na właściwy userId
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Upewnij się, że token jest prawidłowy
      };

      // Wywołanie funkcji pobierających dane
      const [artistsResponse, tracksResponse, tagsResponse] = await Promise.all(
        [
          fetch(`/api/music/top-artists?user_id=${userId}`, { headers }),
          fetch(`/api/music/top-tracks?user_id=${userId}`, { headers }),
          fetch(`/api/music/top-tags?user_id=${userId}`, { headers }),
        ]
      );

      // Sprawdzenie nagłówka Content-Type
      console.log(
        "Artists Response Content-Type:",
        artistsResponse.headers.get("Content-Type")
      );
      console.log(
        "Tracks Response Content-Type:",
        tracksResponse.headers.get("Content-Type")
      );
      console.log(
        "Tags Response Content-Type:",
        tagsResponse.headers.get("Content-Type")
      );

      // Sprawdzenie, czy odpowiedź jest JSON
      if (!artistsResponse.ok) {
        throw new Error("Błąd odpowiedzi z API dla Top Artists");
      }
      if (!tracksResponse.ok) {
        throw new Error("Błąd odpowiedzi z API dla Top Tracks");
      }
      if (!tagsResponse.ok) {
        throw new Error("Błąd odpowiedzi z API dla Top Tags");
      }

      const artistsData = await artistsResponse.json();
      const tracksData = await tracksResponse.json();
      const tagsData = await tagsResponse.json();

      setResults({
        artists: artistsData,
        tracks: tracksData,
        tags: tagsData,
      });
      setError(null);
    } catch (error) {
      console.error("Wystąpił błąd:", error);
      setError("Wystąpił błąd podczas pobierania danych.");
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Pobierz dane użytkownika</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {results.artists && (
        <div>
          <h2>Top Artists</h2>
          <pre>{JSON.stringify(results.artists, null, 2)}</pre>
        </div>
      )}
      {results.tracks && (
        <div>
          <h2>Top Tracks</h2>
          <pre>{JSON.stringify(results.tracks, null, 2)}</pre>
        </div>
      )}
      {results.tags && (
        <div>
          <h2>Top Tags</h2>
          <pre>{JSON.stringify(results.tags, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FetchUserData;
