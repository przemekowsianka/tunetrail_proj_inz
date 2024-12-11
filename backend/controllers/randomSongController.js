const axios = require("axios");

const LAST_FM_API_KEY = process.env.LASTFM_API_KEY;
const LAST_FM_BASE_URL = "http://ws.audioscrobbler.com/2.0/";
const SPOTIFY_API_URL = "https://api.spotify.com/v1/";
const MUSICBRAINZ_BASE_URL = "https://musicbrainz.org/ws/2/";
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
    // const artists = topSongsResponse.data.tracks.track.artist;

    // if (!artists || artists.length === 0) {
    //   return res.status(404).json({ message: "Nie znaleziono artystów." });
    // }

    const randomIndex = Math.floor(Math.random() * songs.length);
    const randomSong = songs[randomIndex];
    console.log("random song: ", randomSong);
    const randomSongArtist = randomSong.artist;
    const randomSongName = randomSong.name;

    const lastFmResponse = await axios.get(`${LAST_FM_BASE_URL}`, {
      params: {
        method: "track.getinfo",
        track: randomSongName,
        artist: randomSongArtist.name,
        api_key: LAST_FM_API_KEY,
        format: "json",
      },
    });

    const artistData = lastFmResponse.data.track.artist;
    //console.log("artist data: ", artistData);
    const songData = lastFmResponse.data.track;
    let mbid = null;
    const response = await axios.get(`${MUSICBRAINZ_BASE_URL}recording`, {
      params: {
        query: `artist:${artistData.name} track:${songData.name}`,
        fmt: "json",
      },
    });

    if (response.data.recordings && response.data.recordings.length > 0) {
      mbid = response.data.recordings[0].id; // MBID utworu
      console.log("MBID: ", mbid);
    } else {
      console.error("Nie znaleziono MBID dla utworu.");
      return null;
    }
    const lastFmResponse2 = await axios.get(`${LAST_FM_BASE_URL}`, {
      params: {
        method: "track.getTopTags",
        track: randomSongName,
        artist: randomSongArtist.name,
        api_key: LAST_FM_API_KEY,
        format: "json",
      },
    });
    // console.log("Tagi: ", lastFmResponse2);
    const tags = lastFmResponse2.data.toptags.tag;
    // console.log("song data: ", songData);
    const spotifyToken = await getSpotifyAccessToken(); // Funkcja do autoryzacji
    const spotifyResponse = await axios.get(`${SPOTIFY_API_URL}search`, {
      headers: { Authorization: `Bearer ${spotifyToken}` },
      params: {
        q: `track:${songData.name} artist:${artistData.name}`,
        type: "track",
        limit: 1,
      },
    });

    const spotifySong = spotifyResponse.data.tracks.items[0];

    console.log("Spotify: ", spotifySong);
    // Zwróć dane
    res.json({
      mbid: mbid,
      name: randomSong.name,
      artist: randomSong.artist.name,
      urlLastFM: randomSong.url,
      urlSpotify: spotifySong ? spotifySong.external_urls.spotify : null,
      tag1: tags[0],
      tag2: tags[1],
      tag3: tags[2],
      img: spotifySong ? spotifySong.album.images[0]?.url : null,
    });
  } catch (error) {
    console.error("Błąd podczas pobierania danych:", error.message);
    res.status(500).json({ message: "Wystąpił problem z serwerem." });
  }
};
