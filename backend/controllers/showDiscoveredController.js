const Sequelize = require("../config/database");
const { Op } = require("sequelize");
const DiscoveredArtists = require("../models/discovered_artists");

exports.showDiscovered = async (req, res) => {
  try {
    const userId = req.user.id; // Zakładamy, że user_id jest dostępne w tokenie

    if (!userId) {
      return res.status(400).json({ message: "Brak user_id w tokenie" });
    }

    const discovered = await DiscoveredArtists.findAll({
      where: { user_id: userId },
    });

    res.json(discovered);
  } catch (error) {
    console.error("Błąd podczas pobierania gatunków:", error);
    res.status(500).json({ message: "Wewnętrzny błąd serwera" });
  }
};
