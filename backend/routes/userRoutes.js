const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Endpoint do wyszukiwania użytkownika po loginie
router.get("/login/:login", userController.findUserByLogin);

// Endpoint do wyszukiwania użytkownika po emailu
router.get("/email/:email", userController.findUserByEmail);

module.exports = router;
