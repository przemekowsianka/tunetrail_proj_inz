const axios = require("axios");

const LAST_FM_API_KEY = process.env.LASTFM_API_KEY;
const LAST_FM_BASE_URL = "http://ws.audioscrobbler.com/2.0/";
const SPOTIFY_API_URL = "https://api.spotify.com/v1/";
const { getSpotifyAccessToken } = require("../services/spotifyAuthService"); // Funkcja do autoryzacji Spotify API

exports.getRandomSong = async (req, res) => {
  try {
    const topSongsResponse = await axios.get(`${LAST_FM_BASE_URL}`, {
      params: {
        method: "chart.gettoptracks",
        api_key: LAST_FM_API_KEY,
        format: "json",
      },
    });

    const songs = topSongsResponse.data.tracks.track;
    const artists = topSongsResponse.data.tracks.artist;

    if (!artists || artists.length === 0) {
      return res.status(404).json({ message: "Nie znaleziono artystów." });
    }

    const randomIndex = Math.floor(Math.random() * songs.length);
    const randomSong = songs[randomIndex];
    const randomSongArtist = songs[randomIndex];

    const lastFmResponse = await axios.get(`${LAST_FM_BASE_URL}`, {
      params: {
        method: "artist.getinfo",
        track: randomSong,
        artist: randomSongArtist,
        api_key: LAST_FM_API_KEY,
        format: "json",
      },
    });

    const artistData = lastFmResponse.data.artist;
    const songData = lastFmResponse.data.track;
    const mbid = artistData.mbid;

    if (!mbid) {
      return res
        .status(404)
        .json({ message: "MBID nie znaleziono dla podanego artysty." });
    }

    const spotifyToken = await getSpotifyAccessToken(); // Funkcja do autoryzacji
    const spotifyResponse = await axios.get(`${SPOTIFY_API_URL}search`, {
      headers: { Authorization: `Bearer ${spotifyToken}` },
      params: {
        q: `track:${songData} artist:${artistData}`,
        type: "track",
        limit: 1,
      },
    });

    const spotifySong = spotifyResponse.data.tracks.items[0];

    // Zwróć dane
    res.json({
      mbid: randomSong.mbid,
      name: randomSong.name,
      artist: randomSong.artist.name,
      urlLastFM: randomSong.url,
      urlSpotify: spotifySong ? spotifySong.external_urls.spotify : null,
    });
  } catch (error) {
    console.error("Błąd podczas pobierania danych:", error.message);
    res.status(500).json({ message: "Wystąpił problem z serwerem." });
  }
};
