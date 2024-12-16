const axios = require("axios");

const LAST_FM_API_KEY = process.env.LASTFM_API_KEY;
const LAST_FM_BASE_URL = "http://ws.audioscrobbler.com/2.0/";

exports.getRandomTag = async (req, res) => {
  try {
    const topTagsResponse = await axios.get(`${LAST_FM_BASE_URL}`, {
      params: {
        method: "chart.gettoptags",
        api_key: LAST_FM_API_KEY,
        format: "json",
      },
    });

    const tags = topTagsResponse.data.tags.tag;

    if (!tags || tags.length === 0) {
      return res.status(404).json({ message: "Nie znaleziono tagów." });
    }

    const randomIndex = Math.floor(Math.random() * tags.length);
    const randomTag = tags[randomIndex];
    //console.log("Random Tag:", randomTag.url);
    const lastFmResponse = await axios.get(`${LAST_FM_BASE_URL}`, {
      params: {
        method: "tag.getinfo",
        tag: randomTag.name,
        lang: "pl",
        api_key: LAST_FM_API_KEY,
        format: "json",
      },
    });

    const tagData = lastFmResponse.data.tag;
    console.log("Random Tag Data:", tagData);
    const lastFmResponse2 = await axios.get(`${LAST_FM_BASE_URL}`, {
      params: {
        method: "tag.getTopAlbums",
        tag: randomTag.name,
        api_key: LAST_FM_API_KEY,
        limit: 1,
        format: "json",
      },
    });
    //console.log("Top Track:", lastFmResponse2);
    const topTracks = lastFmResponse2.data.albums?.album;

    const topTrack = Array.isArray(topTracks) ? topTracks[0] : topTracks; // Obsługa przypadku, gdy `track` jest tablicą lub obiektem
    //  console.log("Top Track:", topTracks);
    // console.log("Top Track Name:", topTrack.name);
    // Zwróć dane
    res.json({
      Genre: {
        name: tagData.name,
        wiki: tagData.wiki.content,
        url: randomTag.url,
      },
      TopTrack: {
        name: topTrack?.name,
        artist: topTrack?.artist,
      },
    });
  } catch (error) {
    console.error("Błąd podczas pobierania danych:", error.message);
    res.status(500).json({ message: "Wystąpił problem z serwerem." });
  }
};
