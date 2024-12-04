import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { fetchRandomAlbum } from "../services/randomMusicService"; // Importuj funkcję
import { fetchRandomArtist } from "../services/randomMusicService";

const Recommend = () => {
  const [album, setAlbum] = useState(null);
  const [artist, setArtist] = useState(null);
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
  const loadRandomArtist = async () => {
    try {
      setLoading(true);
      const data = await fetchRandomArtist(); // Wywołaj funkcję z albumService
      setArtist(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  console.log("Artist object:", artist);
  useEffect(() => {
    loadRandomAlbum();
    loadRandomArtist(); // Załaduj po załadowaniu komponentu
  }, []);

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;
  const bio = artist?.lastFm?.bio || "Brak biografii";
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
      <div className="random-artist">
        <h2>Losowy Artysta</h2>
        <h3>{artist?.lastFm.name}</h3>
        {parse(bio)}
        {/* {album.imageLastFM && <img src={album.imageLastFM} alt={album.name} />} */}
        <div>
          <a
            href={artist?.lastFm.tag1.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {artist?.lastFm.tag1.name}
          </a>
        </div>
        <div>
          <a
            href={artist?.lastFm.tag2.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {artist?.lastFm.tag2.name}
          </a>
        </div>
        <div>
          <a
            href={artist?.lastFm.tag3.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {artist?.lastFm.tag3.name}
          </a>
        </div>

        <div>
          <a
            href={artist?.lastFm.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Last.fm
          </a>
          {album.urlSpotify && (
            <a
              href={artist?.spotify.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Spotify
            </a>
          )}
        </div>
        <button onClick={loadRandomArtist}>Wylosuj ponownie</button>
      </div>
    </div>
  );
};

export default Recommend;
