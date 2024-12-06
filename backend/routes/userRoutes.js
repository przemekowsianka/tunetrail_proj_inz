const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const accountsController = require("../controllers/accountsController");
const auth = require("../middleware/auth"); // Middleware do autoryzacji

// Endpoint do wyszukiwania użytkownika po loginie
router.get("/login/:login", userController.findUserByLogin);

// Endpoint do wyszukiwania użytkownika po emailu
router.get("/email/:email", userController.findUserByEmail);

router.post("/getaccount/lastfm", auth, accountsController.saveLastFmAccount);
router.get("/getaccount/spotify", auth, accountsController.spotifyLogin);
router.get(
  "/getaccount/spotify/callback",
  auth,
  accountsController.saveSpotifyAccount
);

module.exports = router;
