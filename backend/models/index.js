const sequelize = require("../config/database");
const User = require("./users");
const Playlists = require("./playlists");
const UserAPI = require("./users_api");
const UserListenings = require("./user_listenings");
const SimilarArtists = require("./similar_artists");
const RandomSongs = require("./random_songs");
const RandomGenres = require("./random_genres");
const RandomArtists = require("./random_artists");
const RandomAlbums = require("./random_albums");
const ImportedSongs = require("./imported_songs");
const ImportedGenres = require("./imported_genres");
const ImportedArtists = require("./imported_artists");
const DiscoveredArtistsSongs = require("./discovered_artists_songs");
const DiscoveredArtists = require("./discovered_artists");

// Definicja relacji
User.hasMany(Playlists, { foreignKey: "play_uid" });
Playlists.belongsTo(User, { foreignKey: "play_uid" });

User.hasMany(UserAPI, { foreignKey: "uapi_uid" });
UserAPI.belongsTo(User, { foreignKey: "uapi_uid" });

User.hasMany(UserListenings, { foreignKey: "ul_uid" });
UserListenings.belongsTo(User, { foreignKey: "ul_uid" });

User.hasMany(ImportedSongs, { foreignKey: "is_uid" });
ImportedSongs.belongsTo(User, { foreignKey: "is_uid" });

User.hasMany(ImportedArtists, { foreignKey: "ia_uid" });
ImportedArtists.belongsTo(User, { foreignKey: "ia_uid" });

User.hasMany(ImportedGenres, { foreignKey: "ig_uid" });
ImportedGenres.belongsTo(User, { foreignKey: "ig_uid" });

User.hasMany(DiscoveredArtists, { foreignKey: "da_uid" });
DiscoveredArtists.belongsTo(User, { foreignKey: "da_uid" });

DiscoveredArtists.hasMany(DiscoveredArtistsSongs, { foreignKey: "das_da" });
DiscoveredArtistsSongs.belongsTo(DiscoveredArtists, { foreignKey: "das_da" });

ImportedGenres.hasMany(ImportedArtists, { foreignKey: "ia_g1" });
ImportedArtists.belongsTo(ImportedGenres, { foreignKey: "ia_g1" });

ImportedGenres.hasMany(ImportedArtists, { foreignKey: "ia_g2" });
ImportedArtists.belongsTo(ImportedGenres, { foreignKey: "ia_g2" });

ImportedGenres.hasMany(ImportedArtists, { foreignKey: "ia_g3" });
ImportedArtists.belongsTo(ImportedGenres, { foreignKey: "ia_g3" });

ImportedGenres.hasMany(ImportedSongs, { foreignKey: "is_g" });
ImportedSongs.belongsTo(ImportedGenres, { foreignKey: "is_g" });

ImportedArtists.hasMany(ImportedSongs, { foreignKey: "is_a" });
ImportedSongs.belongsTo(ImportedArtists, { foreignKey: "is_a" });

UserAPI.hasMany(Playlists, { foreignKey: "play_api" });
Playlists.belongsTo(UserAPI, { foreignKey: "play_api" });

ImportedGenres.hasMany(UserListenings, { foreignKey: "ul_ig" });
UserListenings.belongsTo(ImportedGenres, { foreignKey: "ul_ig" });

ImportedArtists.hasMany(UserListenings, { foreignKey: "ul_ia" });
UserListenings.belongsTo(ImportedArtists, { foreignKey: "ul_ia" });

ImportedSongs.hasMany(UserListenings, { foreignKey: "ul_is" });
UserListenings.belongsTo(ImportedSongs, { foreignKey: "ul_is" });

ImportedArtists.hasMany(SimilarArtists, { foreignKey: "sa_ia" });
SimilarArtists.belongsTo(ImportedArtists, { foreignKey: "sa_ia" });

module.exports = {
  sequelize,
  User,
  Playlists,
  UserAPI,
  UserListenings,
  SimilarArtists,
  RandomSongs,
  RandomGenres,
  RandomArtists,
  RandomAlbums,
  ImportedSongs,
  ImportedGenres,
  ImportedArtists,
  DiscoveredArtistsSongs,
  DiscoveredArtists,
};
