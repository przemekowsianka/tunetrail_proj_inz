const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Połączenie z bazą danych

const RandomAlbums = sequelize.define(
  "RandomAlbums",
  {
    mbid: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
    },
    spotify_link: {
      type: DataTypes.STRING,
    },
    artist: {
      type: DataTypes.STRING,
    },
    genre: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT("long"),
    },
  },
  {
    tableName: "random_albums",
    timestamps: false,
  }
);

module.exports = RandomAlbums;
