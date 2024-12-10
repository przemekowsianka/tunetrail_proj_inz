const axios = require("axios");
const Sequelize = require("../config/database");
const { Op } = require("sequelize");
const ImportedArtists = require("../models/imported_artists");
const DiscoveredArtists = require("../models/discovered_artists");
const UserAPI = require("../models/users_api");
const LAST_FM_BASE_URL = "http://ws.audioscrobbler.com/2.0/";

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
        period: "1month",
        user: user.lastfm_account,
        api_key: process.env.LASTFM_API_KEY,
        format: "json",
        limit: 100,
      },
    });

    const artists = response.data.topartists.artist;
    //console.log("top artysci: ", artists);
    // Zapisywanie artystów do bazy danych
    for (const artist of artists) {
      const isAlreadyImported = await ImportedArtists.findOne({
        where: {
          user_id: userId,
          [Op.or]: [{ name: artist.name }, { mbid: artist.mbid || null }],
        },
      });
      const isAlreadyDiscovered = await DiscoveredArtists.findOne({
        where: {
          user_id: userId,
          [Op.or]: [{ name: artist.name }, { mbid: artist.mbid || null }],
        },
      });

      if (isAlreadyImported && isAlreadyDiscovered) {
        continue;
      }
      console.log("saving artist: ", artist.name);
      const lastFmResponse = await axios.get(`${LAST_FM_BASE_URL}`, {
        params: {
          method: "artist.getTopTags",
          artist: artist.name,
          api_key: process.env.LASTFM_API_KEY,
          format: "json",
        },
      });

      const details = lastFmResponse.data.toptags?.tag || [];
      if (details.length === 0) {
        console.log(`Brak tagów dla artysty: ${artist.name}`);
        continue; // Przejdź do następnej iteracji, jeśli brak tagów
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
