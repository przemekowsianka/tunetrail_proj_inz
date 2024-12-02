const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Połączenie z bazą danych

const RandomGenres = sequelize.define(
  "RandomGenres",
  {
    name: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    spotify_link: {
      type: DataTypes.STRING,
    },
    top_song: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT("long"),
    },
  },
  {
    tableName: "random_genres",
    timestamps: false,
  }
);

module.exports = RandomGenres;
