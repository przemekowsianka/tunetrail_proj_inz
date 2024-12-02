const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Połączenie z bazą danych

const UserAPI = sequelize.define(
  "UserAPI",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      unique: false,
    },

    lastfm_account: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    spotify_account: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
  },
  {
    tableName: "users_api", // Nazwa istniejącej tabeli
    timestamps: false,
  }
);

module.exports = UserAPI;
