const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Połączenie z bazą danych

const ImportedGenres = sequelize.define(
  "ImportedGenres",
  {
    name: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    playcount: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "imported_genres",
    timestamps: false,
  }
);

module.exports = ImportedGenres;
