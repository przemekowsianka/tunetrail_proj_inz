const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Połączenie z bazą danych

const RandomArtists = sequelize.define(
  "RandomArtists",
  {
    mbid: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
    },
    spotify_link: {
      type: DataTypes.STRING,
    },
    img: {
      type: DataTypes.BLOB("long"),
    },
    description: {
      type: DataTypes.TEXT("long"),
    },
  },
  {
    tableName: "random_artists",
    timestamps: false,
  }
);

module.exports = RandomArtists;
