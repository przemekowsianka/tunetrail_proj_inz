const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Połączenie z bazą danych

const Playlists = sequelize.define(
  "Playlists",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    spotify_link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    api: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img: {
      type: DataTypes.BLOB("long"),
    },
  },
  {
    tableName: "playlists",
    timestamps: false,
  }
);

module.exports = Playlists;
