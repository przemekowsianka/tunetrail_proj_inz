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

    if (typeof maxPopularity !== "number" || maxPopularity < 60000) {
      return res.status(400).json({
        message:
          "Z uwagi na ograniczenia zapytań do Last.fm, maksymalna popularność nie może być mniejsza niż 60000",
      });
    }

    let genreQueue = [...genres]; // Kolejka do przetwarzania gatunków
    let processedGenres = new Set(); // Zestaw przetworzonych gatunków
    let attempts = 0;

    while (genreQueue.length > 0 && attempts < 20) {
      const currentGenre = genreQueue.shift(); // Pobierz pierwszy gatunek z kolejki
      processedGenres.add(currentGenre);

      // Pobierz artystów dla bieżącego gatunku
      const response = await axios.get(`${LAST_FM_BASE_URL}`, {
        params: {
          method: "tag.getTopArtists",
          tag: currentGenre,
          limit: 1000,
          api_key: process.env.LASTFM_API_KEY,
          format: "json",
        },
      });

      const artists = response.data.topartists.artist || [];
      if (!artists || artists.length === 0) continue; // Jeśli brak artystów, przejdź do następnego gatunku

      // Wybierz losowego artystę, który nie istnieje w tabeli ImportedArtists
      for (const candidateArtist of artists) {
        console.log("CANDIDATE NAME: ", candidateArtist.name);
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
          // Znaleziono nowego artystę
          const artistInfoResponse = await axios.get(`${LAST_FM_BASE_URL}`, {
            params: {
              method: "artist.getInfo",
              artist: candidateArtist.name,
              api_key: process.env.LASTFM_API_KEY,
              format: "json",
            },
          });

          const artistData = artistInfoResponse.data?.artist;
          if (!artistData) continue; // Pomijamy, jeśli nie ma danych o artyście

          const listenersData = artistData.stats.listeners;
          const listeners = Number(listenersData);
          const tags = artistData.tags.tag.map((tag) => tag.name.toLowerCase()); // Konwertujemy tagi do lowercase
          if (listeners > maxPopularity) continue;

          const name = artistData.name;
          const mbid = artistData.mbid;
          const spotifyToken = await getSpotifyAccessToken();
          const spotifyResponse = await axios.get(`${SPOTIFY_API_URL}search`, {
            headers: { Authorization: `Bearer ${spotifyToken}` },
            params: { q: name, type: "artist", limit: 10 },
          });

          const spotifyArtists = spotifyResponse.data.artists.items;

          let bestMatch = null;
          let highestScore = 0;

          spotifyArtists.forEach((spotifyArtist) => {
            let score = 0;

            if (spotifyArtist.name.toLowerCase() === name.toLowerCase()) {
              score += 3; // Dopasowanie dokładnej nazwy
            }

            if (mbid && spotifyArtist.id === mbid) {
              score += 5; // Idealne dopasowanie po MBID
            }

            const similarity = stringSimilarity.compareTwoStrings(
              spotifyArtist.name,
              name
            );
            score += similarity * 3; // Dopasowanie Levenshtein

            if (score > highestScore) {
              highestScore = score;
              bestMatch = spotifyArtist;
            }
          });
          if (bestMatch) {
            console.log("🎉 Najlepsze dopasowanie:", bestMatch.name);
            console.log("🎉 Wspólne gatunki:", bestMatch.commonGenres);

            console.log("DISCOVERED ARTIST NAME: ", artistData.name);
            await DiscoveredArtists.create({
              user_id: userId,
              name: artistData.name,
              mbid: artistData?.mbid || null,
              url: artistData?.url || null,
              description: artistData.bio?.content || null,
              genre1: artistData.tags.tag[0].name,
              genre2: artistData.tags.tag[1].name,
              genre3: artistData.tags.tag[2].name,
              listeners: artistData.stats.listeners,
              spotify_link: bestMatch.external_urls.spotify,
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
                genre1: artistData.tags.tag[0].name,
                genre2: artistData.tags.tag[1].name,
                genre3: artistData.tags.tag[2].name,
              },
            });
          } else {
            console.log("❌ Nie znaleziono odpowiedniego artysty na Spotify.");
          }
        }
      }

      // Jeśli nie znaleziono nowego artysty, spróbuj kolejnego gatunku
      attempts++;
    }

    // Jeśli wyczerpano wszystkie gatunki, znajdź podobne
    if (genreQueue.length === 0 && attempts >= 20) {
      const similarGenres = new Set();

      for (const genre of processedGenres) {
        const similarResponse = await axios.get(`${LAST_FM_BASE_URL}`, {
          params: {
            method: "tag.getSimilar",
            tag: genre,
            api_key: process.env.LASTFM_API_KEY,
            format: "json",
          },
        });

        const similarTags = similarResponse.data.similartags.tag || [];
        for (const tag of similarTags) {
          if (tag.name && !processedGenres.has(tag.name)) {
            similarGenres.add(tag.name);
          }
        }
      }

      if (similarGenres.size > 0) {
        genreQueue = [...similarGenres]; // Zastąp kolejkę podobnymi gatunkami
      } else {
        return res.status(404).json({
          message: "Nie znaleziono nowego artysty spełniającego kryteria.",
        });
      }
    }
  } catch (error) {
    console.error("Błąd w funkcji discoverArtist:", error.message);
    res.status(500).json({ message: "Wystąpił problem z serwerem." });
  }
};
