const sequelize = require("../config/database");
const User = require("./users");

const UserAPI = require("./users_api");

const ImportedSongs = require("./imported_songs");
const ImportedGenres = require("./imported_genres");
const ImportedArtists = require("./imported_artists");

const DiscoveredArtists = require("./discovered_artists");

User.hasMany(UserAPI, { foreignKey: "user_id" });
UserAPI.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(ImportedSongs, { foreignKey: "user_id" });
ImportedSongs.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(ImportedArtists, { foreignKey: "user_id" });
ImportedArtists.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(ImportedGenres, { foreignKey: "user_id" });
ImportedGenres.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(DiscoveredArtists, { foreignKey: "user_id" });
DiscoveredArtists.belongsTo(User, { foreignKey: "user_id" });

module.exports = {
  sequelize,
  User,

  UserAPI,

  ImportedSongs,
  ImportedGenres,
  ImportedArtists,

  DiscoveredArtists,
};
