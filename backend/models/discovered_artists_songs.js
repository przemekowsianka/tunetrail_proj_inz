const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Połączenie z bazą danych

const DiscoveredArtistsSongs = sequelize.define(
  "DiscoveredArtistsSongs",
  {
    mbid: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    artist_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    spotify_link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "discovered_artists_songs",
    timestamps: false,
  }
);

module.exports = DiscoveredArtistsSongs;
