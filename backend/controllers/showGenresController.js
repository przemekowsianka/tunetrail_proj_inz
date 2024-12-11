const Sequelize = require("../config/database");
const { Op } = require("sequelize");
const ImportedGenres = require("../models/imported_genres");

exports.showGenres = async (req, res) => {
  try {
    const userId = req.user.id; // Zakładamy, że user_id jest dostępne w tokenie

    if (!userId) {
      return res.status(400).json({ message: "Brak user_id w tokenie" });
    }

    const genres = await ImportedGenres.findAll({
      where: { user_id: userId },
      order: [["playcount", "DESC"]], // Sortowanie według playcount malejąco
      attributes: ["name"], // Zwracamy tylko kolumnę name
    });

    res.json(genres);
  } catch (error) {
    console.error("Błąd podczas pobierania gatunków:", error);
    res.status(500).json({ message: "Wewnętrzny błąd serwera" });
  }
};
