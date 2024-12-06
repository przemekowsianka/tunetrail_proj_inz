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

User.hasMany(UserAPI, { foreignKey: "user_id" });
UserAPI.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(UserListenings, { foreignKey: "ul_uid" });
UserListenings.belongsTo(User, { foreignKey: "ul_uid" });

User.hasMany(ImportedSongs, { foreignKey: "user_id" });
ImportedSongs.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(ImportedArtists, { foreignKey: "iuser_id" });
ImportedArtists.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(ImportedGenres, { foreignKey: "user_id" });
ImportedGenres.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(DiscoveredArtists, { foreignKey: "user_id" });
DiscoveredArtists.belongsTo(User, { foreignKey: "user_id" });

DiscoveredArtists.hasMany(DiscoveredArtistsSongs, { foreignKey: "das_da" });
DiscoveredArtistsSongs.belongsTo(DiscoveredArtists, { foreignKey: "das_da" });

ImportedGenres.hasMany(ImportedArtists, { foreignKey: "genre1" });
ImportedArtists.belongsTo(ImportedGenres, { foreignKey: "genre1" });

ImportedGenres.hasMany(ImportedArtists, { foreignKey: "genre2" });
ImportedArtists.belongsTo(ImportedGenres, { foreignKey: "genre2" });

ImportedGenres.hasMany(ImportedArtists, { foreignKey: "genre3" });
ImportedArtists.belongsTo(ImportedGenres, { foreignKey: "genre3" });

ImportedGenres.hasMany(ImportedSongs, { foreignKey: "genre" });
ImportedSongs.belongsTo(ImportedGenres, { foreignKey: "genre" });

ImportedArtists.hasMany(ImportedSongs, { foreignKey: "artist_id" });
ImportedSongs.belongsTo(ImportedArtists, { foreignKey: "artist_id" });

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
