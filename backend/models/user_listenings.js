const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Połączenie z bazą danych

const UserListenings = sequelize.define(
  "UserListenings",
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

    artist_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    song_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    listened_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "user_listenings", // Nazwa istniejącej tabeli
    timestamps: false,
  }
);

module.exports = UserListenings;
