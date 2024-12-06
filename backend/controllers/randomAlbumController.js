const axios = require("axios");

const LAST_FM_API_KEY = process.env.LASTFM_API_KEY;
const LAST_FM_BASE_URL = "http://ws.audioscrobbler.com/2.0/";
const SPOTIFY_API_URL = "https://api.spotify.com/v1/";
const { getSpotifyAccessToken } = require("../services/spotifyAuthService"); // Funkcja do autoryzacji Spotify API

exports.getRandomAlbum = async (req, res) => {
  try {
    const topArtistsResponse = await axios.get(`${LAST_FM_BASE_URL}`, {
      params: {
        method: "chart.gettopartists",
        api_key: LAST_FM_API_KEY,
        format: "json",
      },
    });
    //console.log("Odpowiedź Last.fm (artysci):", topArtistsResponse.data);
    const artists = topArtistsResponse.data.artists.artist;

    if (!artists || artists.length === 0) {
      return res.status(404).json({ message: "Nie znaleziono artystów." });
    }

    const randomArtistIndex = Math.floor(Math.random() * artists.length);
    const randomArtist = artists[randomArtistIndex];

    const topAlbumsResponse = await axios.get(`${LAST_FM_BASE_URL}`, {
      params: {
        method: "artist.gettopalbums",
        artist: randomArtist.name,
        api_key: LAST_FM_API_KEY,
        format: "json",
      },
    });

    const albums = topAlbumsResponse.data.topalbums.album;

    //console.log("Artists fetched:", artists);
    //console.log("Albums fetched for artist:", albums);

    if (!albums || albums.length === 0) {
      return res.status(404).json({
        message: `Nie znaleziono albumów dla artysty ${randomArtist.name}.`,
      });
    }

    // // Wybierz albumy, które mają więcej niż jedną piosenkę
    // const validAlbums = [];
    // for (const album of albums) {
    //   const albumDetailsResponse = await axios.get(`${LAST_FM_BASE_URL}`, {
    //     params: {
    //       method: "album.getinfo",
    //       api_key: LAST_FM_API_KEY,
    //       artist: album.artist.name,
    //       album: album.name,
    //       format: "json",
    //     },
    //   });

    //   const tracks = albumDetailsResponse.data.album?.tracks?.track;

    //   // Jeśli liczba utworów jest większa niż 1, dodaj do listy
    //   if (Array.isArray(tracks) && tracks.length > 1) {
    //     validAlbums.push(album);
    //   }
    // }
    // console.log(validAlbums);
    // if (validAlbums.length === 0) {
    //   return res.status(404).json({
    //     message: `Nie znaleziono albumów z więcej niż jedną piosenką dla artysty ${randomArtist.name}.`,
    //   });
    // }
    // Wybierz losowy album
    const randomAlbumIndex = Math.floor(Math.random() * albums.length);
    const randomAlbum = albums[randomAlbumIndex];

    const spotifyToken = await getSpotifyAccessToken(); // Funkcja do autoryzacji
    const spotifyResponse = await axios.get(`${SPOTIFY_API_URL}search`, {
      headers: { Authorization: `Bearer ${spotifyToken}` },
      params: {
        q: `album:${randomAlbum.name} artist:${randomAlbum.artist.name}`,
        type: "album",
        limit: 1,
      },
    });

    const spotifyAlbum = spotifyResponse.data.albums.items[0];

    // Zwróć dane o albumie z Last.fm i link do Spotify
    res.json({
      mbid: randomAlbum.mbid,
      name: randomAlbum.name,
      artist: randomAlbum.artist.name,
      urlLastFM: randomAlbum.url,
      imageLastFM:
        randomAlbum.image.find((img) => img.size === "large")?.["#text"] ||
        null,
      urlSpotify: spotifyAlbum ? spotifyAlbum.external_urls.spotify : null,
    });
  } catch (error) {
    console.error("Błąd podczas pobierania danych:", error.message);
    res.status(500).json({ message: "Wystąpił problem z serwerem." });
  }
};
