const axios = require("axios");

// Pobranie top artystów dla użytkownika
exports.getUserTopArtists = async (req, res) => {
  try {
    const response = await axios.get(`http://ws.audioscrobbler.com/2.0/`, {
      params: {
        method: "user.gettopartists",
        user: req.query.username, // Nazwa użytkownika Last.fm podana jako parametr
        api_key: process.env.LASTFM_API_KEY,
        format: "json",
        limit: req.query.limit || 50, // Opcjonalnie limit wyników
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pobranie top utworów dla użytkownika
exports.getUserTopTracks = async (req, res) => {
  try {
    const response = await axios.get(`http://ws.audioscrobbler.com/2.0/`, {
      params: {
        method: "user.gettoptracks",
        user: req.query.username,
        api_key: process.env.LASTFM_API_KEY,
        format: "json",
        limit: req.query.limit || 50,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pobranie ulubionych gatunków (tagów) użytkownika
exports.getUserTopTags = async (req, res) => {
  try {
    const response = await axios.get(`http://ws.audioscrobbler.com/2.0/`, {
      params: {
        method: "user.gettoptags",
        user: req.query.username,
        api_key: process.env.LASTFM_API_KEY,
        format: "json",
        limit: req.query.limit || 50,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pobranie globalnych top artystów (nie tylko dla użytkownika)
exports.getGlobalTopArtists = async (req, res) => {
  try {
    const response = await axios.get(`http://ws.audioscrobbler.com/2.0/`, {
      params: {
        method: "chart.gettopartists",
        api_key: process.env.LASTFM_API_KEY,
        format: "json",
        limit: req.query.limit || 50,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pobranie globalnych top utworów
exports.getGlobalTopTracks = async (req, res) => {
  try {
    const response = await axios.get(`http://ws.audioscrobbler.com/2.0/`, {
      params: {
        method: "chart.gettoptracks",
        api_key: process.env.LASTFM_API_KEY,
        format: "json",
        limit: req.query.limit || 50,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getGlobalTopArtists = async (req, res) => {
  try {
    const response = await axios.get(`http://ws.audioscrobbler.com/2.0/`, {
      params: {
        method: "chart.gettopartists",
        api_key: process.env.LASTFM_API_KEY,
        format: "json",
        limit: req.query.limit || 50,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGlobalTopArtists = async (req, res) => {
  try {
    const response = await axios.get(`http://ws.audioscrobbler.com/2.0/`, {
      params: {
        method: "chart.gettopartists",
        api_key: process.env.LASTFM_API_KEY,
        format: "json",
        limit: req.query.limit || 50,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getGlobalTopTags = async (req, res) => {
  try {
    const response = await axios.get(`http://ws.audioscrobbler.com/2.0/`, {
      params: {
        method: "chart.gettoptags",
        api_key: process.env.LASTFM_API_KEY,
        format: "json",
        limit: req.query.limit || 50,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGlobalTopAlbums = async (req, res) => {
  try {
    const randomTag = await getGlobalTopTags(); // Użycie funkcji zwracającej losowy top Tag

    const response = await axios.get(`http://ws.audioscrobbler.com/2.0/`, {
      params: {
        method: "tag.getTopAlbums",
        tag: randomTag,
        api_key: LASTFM_API_KEY,
        format: "json",
        limit: 50, // Pobierz maksymalnie 50 albumów
      },
    });

    const albums = response.data.albums.album;

    if (!albums || albums.length === 0) {
      return res
        .status(404)
        .json({ message: `Nie znaleziono albumów dla tagu: ${randomTag}` });
    }

    const randomIndex = Math.floor(Math.random() * albums.length);
    const randomAlbum = albums[randomIndex];

    res.json({
      artist: randomAlbum.artist.name,
      album: randomAlbum.name,
      image: randomAlbum.image?.[2]?.["#text"], // Średniej wielkości obrazek
      url: randomAlbum.url,
    });
  } catch (error) {
    console.error("Błąd podczas pobierania albumów:", error.message);
    res.status(500).json({ message: "Wystąpił problem z serwerem." });
  }
};
