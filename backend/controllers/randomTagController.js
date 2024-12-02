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
      return res.status(404).json({ message: "Nie znaleziono artystów." });
    }

    const randomIndex = Math.floor(Math.random() * tags.length);
    const randomTag = tags[randomIndex];

    const lastFmResponse = await axios.get(`${LAST_FM_BASE_URL}`, {
      params: {
        method: "tag.getinfo",
        tag: randomTag,
        api_key: LAST_FM_API_KEY,
        format: "json",
      },
    });

    const tagData = lastFmResponse.data.tag;

    const lastFmResponse2 = await axios.get(`${LAST_FM_BASE_URL}`, {
      params: {
        method: "tag.getTopTracks",
        tag: randomTag,
        api_key: LAST_FM_API_KEY,
        limit: 1,
        format: "json",
      },
    });
    const topTrackData = lastFmResponse2.toptracks.track;
    // Zwróć dane
    res.json({
      Genre: {
        name: tagData.name,
        wiki: tagData.wiki.summary,
        url: tagData.url,
      },
      TopTrack: {
        name: topTrackData.name,
      },
    });
  } catch (error) {
    console.error("Błąd podczas pobierania danych:", error.message);
    res.status(500).json({ message: "Wystąpił problem z serwerem." });
  }
};
