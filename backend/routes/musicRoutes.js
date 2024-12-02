const express = require("express");
const router = express.Router();
const userMusicController = require("../controllers/userMusicController");
const randomTagController = require("../controllers/randomTagController");
const randomSongController = require("../controllers/randomSongController");
const randomAlbumController = require("../controllers/randomAlbumController");
const randomArtistController = require("../controllers/randomArtistController");

const auth = require("../middleware/auth"); // Middleware do autoryzacji

// Trasy do pobierania danych z Last.fm
router.get("/top-artists", userMusicController.getUserTopArtists);
router.get("/top-tracks", userMusicController.getUserTopTracks);
router.get("/top-tags", userMusicController.getUserTopTags);
router.get("/random-tag", randomTagController.getRandomTag);
router.get("/random-song", randomSongController.getRandomSong);
router.get("/random-album", randomAlbumController.getRandomAlbum);
router.get("/random-artist", randomArtistController.getRandomArtist);

module.exports = router;
