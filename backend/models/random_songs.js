const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Połączenie z bazą danych

const RandomSongs = sequelize.define(
  "RandomSongs",
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
    tableName: "random_songs",
    timestamps: false,
  }
);

module.exports = RandomSongs;
