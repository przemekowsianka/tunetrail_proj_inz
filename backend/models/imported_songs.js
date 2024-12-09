const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Połączenie z bazą danych

const ImportedSongs = sequelize.define(
  "ImportedSongs",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    mbid: {
      type: DataTypes.STRING,
      // primaryKey: true,
      // allowNull: false,
      // unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    artist_id: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    playcount: {
      type: DataTypes.INTEGER,
    },
    genre: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "imported_songs",
    timestamps: false,
  }
);

module.exports = ImportedSongs;
