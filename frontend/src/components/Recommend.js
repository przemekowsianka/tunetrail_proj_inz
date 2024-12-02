import React, { useEffect, useState } from "react";
import { fetchRandomAlbum } from "../services/randomMusicService"; // Importuj funkcję

const Recommend = () => {
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRandomAlbum = async () => {
    try {
      setLoading(true);
      const data = await fetchRandomAlbum(); // Wywołaj funkcję z albumService
      setAlbum(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRandomAlbum(); // Załaduj album po załadowaniu komponentu
  }, []);

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;

  return (
    <div className="Section">
      <h2 className="SectionTitle">Polecamy</h2>
      {/* <img className="ArtistRecommend"></img>
      <button className="RecommendButton"></button>
      <button className="RecommendButton"></button>
      <button className="RecommendButton"></button> */}
      <div className="random-album">
        <h2>Losowy Album</h2>
        <h3>{album.name}</h3>
        <p>Wykonawca: {album.artist}</p>
        {album.imageLastFM && <img src={album.imageLastFM} alt={album.name} />}
        <div>
          <a href={album.urlLastFM} target="_blank" rel="noopener noreferrer">
            Last.fm
          </a>
          {album.urlSpotify && (
            <a
              href={album.urlSpotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              Spotify
            </a>
          )}
        </div>
        <button onClick={loadRandomAlbum}>Wylosuj ponownie</button>
      </div>
    </div>
  );
};

export default Recommend;
