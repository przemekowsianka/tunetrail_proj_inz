const axios = require("axios");
const Sequelize = require("../config/database");
const { Op } = require("sequelize");
const ImportedArtists = require("../models/imported_artists");
const ImportedGenres = require("../models/imported_genres");
const ImportedSongs = require("../models/imported_songs");
const UserAPI = require("../models/users_api");
const LAST_FM_BASE_URL = "http://ws.audioscrobbler.com/2.0/";

// Pobranie top artystów dla użytkownika
exports.getUserTopArtists = async (req, res) => {
  try {
    const userId = req.user.id; // Zakładamy, że middleware ustawia req.user.id

    const user = await UserAPI.findOne({
      where: {
        user_id: userId,
        lastfm_account: {
          [Op.ne]: null, // Sprawdza, czy pole lastfm_account nie jest null
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Użytkownik nie znaleziony" });
    }

    const response = await axios.get(`${LAST_FM_BASE_URL}`, {
      params: {
        method: "user.gettopartists",
        user: user.lastfm_account,
        api_key: process.env.LASTFM_API_KEY,
        format: "json",
        limit: 50,
      },
    });

    const artists = response.data.topartists.artist;
    //console.log("top artysci: ", artists);
    // Zapisywanie artystów do bazy danych
    for (const artist of artists) {
      console.log("saving artist: ", artist);

      const lastFmResponse = await axios.get(`${LAST_FM_BASE_URL}`, {
        params: {
          method: "artist.getTopTags",
          artist: artist.name,
          api_key: process.env.LASTFM_API_KEY,
          format: "json",
        },
      });
      // console.log(
      //   "Odpowiedź Last.fm (artist.getTopTags):",
      //   JSON.stringify(lastFmResponse.data, null, 2)
      // );
      const details = lastFmResponse.data.toptags?.tag || [];
      if (details.length === 0) {
        console.log(`Brak tagów dla artysty: ${artist.name}`);
        continue; // Przejdź do następnej iteracji, jeśli brak tagów
      }
      //const genre_names = details.name;
      for (let int = 0; int < details.length; int++) {
        let genre = await ImportedGenres.findOne({
          where: { name: details[int].name },
        });

        // Jeśli artysta nie istnieje, dodaj go do tabeli
        if (!genre) {
          genre = await ImportedGenres.create({
            user_id: userId,
            name: details[int].name,
            playcount: 0, // lub inne wartości domyślne
          });
        }
      }
      try {
        await ImportedArtists.create({
          mbid: artist.mbid || null,
          user_id: userId,
          name: artist.name,
          // listeners: artist.listeners,
          playcount: artist.playcount,
          genre1: details[0].name,
          genre2: details[1].name,
          genre3: details[2].name,
        });
      } catch (error) {
        console.error("Błąd zapisu artysty:", error.message);
      }
    }

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pobranie top utworów dla użytkownika
exports.getUserTopTracks = async (req, res) => {
  try {
    const userId = req.user.id; // Zakładamy, że middleware ustawia req.user.id

    const user = await UserAPI.findOne({
      where: {
        user_id: userId,
        lastfm_account: {
          [Op.ne]: null,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Użytkownik nie znaleziony" });
    }

    const response = await axios.get(`${LAST_FM_BASE_URL}`, {
      params: {
        method: "user.gettoptracks",
        user: user.lastfm_account,
        api_key: process.env.LASTFM_API_KEY,
        format: "json",
        limit: 50,
      },
    });

    const tracks = response.data.toptracks.track;

    // Zapisywanie utworów do bazy danych
    for (const track of tracks) {
      const lastFmResponse2 = await axios.get(`${LAST_FM_BASE_URL}`, {
        params: {
          method: "track.getTopTags",
          track: track.name,
          artist: track.artist.name,
          api_key: process.env.LASTFM_API_KEY,
          format: "json",
        },
      });
      // console.log(
      //   "Odpowiedź Last.fm (track.getTopTags):",
      //   JSON.stringify(lastFmResponse2.data, null, 2)
      // );
      //console.log("Tagi: ", lastFmResponse2);
      const tags = lastFmResponse2.data.toptags.tag;
      // console.log("saving track: ", track);
      const artistMbid = track.artist.mbid;
      let artist = await ImportedArtists.findOne({
        where: { mbid: artistMbid },
      });

      // Jeśli artysta nie istnieje, dodaj go do tabeli
      if (!artist) {
        artist = await ImportedArtists.create({
          mbid: artistMbid || null, // lub "Unknown" jeśli brak ID
          user_id: userId,
          name: track.artist.name,
          playcount: 0, // lub inne wartości domyślne
        });
      }
      try {
        await ImportedSongs.create({
          mbid: track.mbid,
          user_id: userId,
          artist_id: track.artist.mbid,
          title: track.name,
          playcount: track.playcount,
          genre: tags[0].name,
        });
      } catch (error) {
        console.error("Błąd zapisu piosenki:", error.message);
      }

      for (let i = 0; i < 5; i++) {
        const tagName = tags[i].name;
        console.log("TAG NAME: ", tagName);
        // Sprawdź, czy tag już istnieje w ImportedGenres
        const existingGenre = await ImportedGenres.findOne({
          where: {
            name: tagName,
            user_id: userId,
          },
        });

        if (existingGenre) {
          // Jeśli istnieje, zaktualizuj playcount
          await existingGenre.update({
            playcount: existingGenre.playcount + track.playcount,
          });
        } else {
          // Jeśli nie istnieje, utwórz nowy rekord
          try {
            await ImportedGenres.create({
              name: tagName,
              user_id: userId,
              playcount: track.playcount,
            });
          } catch (error) {
            console.error("Błąd zapisu artysty:", error.message);
          }
        }
      }
    }

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
