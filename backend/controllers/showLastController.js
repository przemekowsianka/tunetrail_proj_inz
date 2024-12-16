const Sequelize = require("../config/database");

const UserAPI = require("../models/users_api");

exports.showLast = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "Brak user_id w tokenie" });
    }

    const lastfm = await UserAPI.findAll({
      where: { user_id: userId },
      attributes: ["lastfm_account"],
    });

    res.json(lastfm);
  } catch (error) {
    console.error("Błąd podczas pobierania konta:", error);
    res.status(500).json({ message: "Wewnętrzny błąd serwera" });
  }
};
