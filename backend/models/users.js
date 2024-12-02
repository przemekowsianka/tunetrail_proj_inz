const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Połączenie z bazą danych
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 10],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8],
      },
    },
  },
  {
    tableName: "users", // Nazwa istniejącej tabeli
    timestamps: false,
    //hashowanie hasła
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10); // Hashowanie hasła przed zapisaniem
        }
      },
      beforeUpdate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10); // Hashowanie hasła przy aktualizacji
        }
      },
    },
  }
);
User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

User.findByLogin = async function (login) {
  console.log("Searching for user with login:", login); // Debug
  const user = await User.findOne({ where: { login } });
  console.log("User found:", user); // Debug
  return user;
};

User.findByEmail = async function (email) {
  const user = await User.findOne({ where: { email } });
  console.log("findByEmail result:", user); // Debugging
  return user;
};

User.findById = async function (id) {
  const user = await User.findOne({ where: { id } });
  console.log("findById result:", user); // Debugging
  return user;
};
module.exports = User;
