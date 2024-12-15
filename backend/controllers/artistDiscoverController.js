const axios = require("axios");
const Sequelize = require("../config/database");
const { Op } = require("sequelize");
const LAST_FM_API_KEY = process.env.LASTFM_API_KEY;
const LAST_FM_BASE_URL = "http://ws.audioscrobbler.com/2.0/";
const MUSICBRAINZ_BASE_URL = "https://musicbrainz.org/ws/2/";
const SPOTIFY_API_URL = "https://api.spotify.com/v1/";
const { getSpotifyAccessToken } = require("../services/spotifyAuthService"); // Funkcja do autoryzacji Spotify API
const DiscoveredArtists = require("../models/discovered_artists");
const ImportedArtists = require("../models/imported_artists");
const stringSimilarity = require("string-similarity");

exports.discoverArtist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { genres, maxPopularity } = req.body;

    if (!genres || !Array.isArray(genres) || genres.length === 0) {
      return res
        .status(400)
        .json({ message: "Musisz podać przynajmniej jeden gatunek." });
    }

    if (typeof maxPopularity !== "number" || maxPopularity < 1000) {
      return res.status(400).json({
        message: "Maksymalna ilość słuchaczy musi być większa niż 1000",
      });
    }

    let genreQueue = [...genres];
    let processedGenres = new Set();
    let attempts = 0;

    while (genreQueue.length > 0 && attempts < 20) {
      const currentGenre = genreQueue.shift();
      processedGenres.add(currentGenre);
      attempts++;

      const response = await axios.get(`${LAST_FM_BASE_URL}`, {
        params: {
          method: "tag.getTopArtists",
          tag: currentGenre,
          limit: 1000,
          api_key: process.env.LASTFM_API_KEY,
          format: "json",
        },
      });

      const artists = response.data?.topartists?.artist || [];
      if (!artists || artists.length === 0) continue;

      for (const candidateArtist of artists) {
        const isAlreadyImported = await ImportedArtists.findOne({
          where: {
            user_id: userId,
            [Op.or]: [
              { name: candidateArtist.name },
              { mbid: candidateArtist.mbid || null },
            ],
          },
        });

        const isAlreadyDiscovered = await DiscoveredArtists.findOne({
          where: {
            user_id: userId,
            [Op.or]: [
              { name: candidateArtist.name },
              { mbid: candidateArtist.mbid || null },
            ],
          },
        });

        if (!isAlreadyImported && !isAlreadyDiscovered) {
          const artistInfoResponse = await axios.get(`${LAST_FM_BASE_URL}`, {
            params: {
              method: "artist.getInfo",
              artist: candidateArtist.name,
              api_key: process.env.LASTFM_API_KEY,
              format: "json",
            },
          });

          const artistData = artistInfoResponse.data?.artist;
          if (!artistData) continue;

          const listenersData = artistData.stats?.listeners;
          const listeners = Number(listenersData);
          if (listeners > maxPopularity) continue;

          const spotifyToken = await getSpotifyAccessToken();
          const spotifyResponse = await axios.get(`${SPOTIFY_API_URL}search`, {
            headers: { Authorization: `Bearer ${spotifyToken}` },
            params: { q: artistData.name, type: "artist", limit: 10 },
          });

          const spotifyArtists = spotifyResponse.data?.artists?.items || [];

          let bestMatch = null;
          let highestScore = 0;

          spotifyArtists.forEach((spotifyArtist) => {
            let score = 0;
            if (
              spotifyArtist.name.toLowerCase() === artistData.name.toLowerCase()
            ) {
              score += 3;
            }

            const similarity = stringSimilarity.compareTwoStrings(
              spotifyArtist.name,
              artistData.name
            );
            score += similarity * 3;

            if (score > highestScore) {
              highestScore = score;
              bestMatch = spotifyArtist;
            }
          });

          if (bestMatch) {
            await DiscoveredArtists.create({
              user_id: userId,
              name: artistData.name,
              mbid: artistData.mbid || null,
              url: artistData.url || null,
              description: artistData.bio?.content || null,
              genre1: artistData.tags?.tag[0]?.name || null,
              genre2: artistData.tags?.tag[1]?.name || null,
              genre3: artistData.tags?.tag[2]?.name || null,
              listeners: artistData.stats?.listeners,
              spotify_link: bestMatch.external_urls?.spotify || null,
            });

            return res.json({
              message: "Pomyślnie znaleziono artystę.",
              artist: {
                name: artistData.name,
                mbid: artistData.mbid,
                url: artistData.url,
                bio: artistData.bio?.content,
                spotify_url: bestMatch.external_urls.spotify,
                listeners: artistData.stats.listeners,
                imageLastFM: bestMatch.images[0]?.url || null,
                genre1: artistData.tags.tag[0]?.name || null,
                genre2: artistData.tags.tag[1]?.name || null,
                genre3: artistData.tags.tag[2]?.name || null,
              },
            });
          }
        }
      }
    }

    if (attempts >= 20 || genreQueue.length === 0) {
      return res.status(404).json({
        message: "Nie znaleziono nowego artysty spełniającego kryteria.",
      });
    }
  } catch (error) {
    console.error("Błąd w funkcji discoverArtist:", error);
    res.status(500).json({ message: "Wystąpił problem z serwerem." });
  }
};
