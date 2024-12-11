const express = require("express");
const router = express.Router();
const showGenresController = require("../controllers/showGenresController");
const showDiscoveredController = require("../controllers/showDiscoveredController");

const auth = require("../middleware/auth"); // Middleware do autoryzacji

router.get("/genres", auth, showGenresController.showGenres);
router.get("/discovered", auth, showDiscoveredController.showDiscovered);

module.exports = router;
