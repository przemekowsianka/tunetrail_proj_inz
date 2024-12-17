const User = require("../models/users");
const jwt = require("jsonwebtoken");
const Sequelize = require("../config/database");
const { Op } = require("sequelize");

exports.register = async (req, res) => {
  try {
    const { login, email, password } = req.body;

    // Sprawdzenie, czy użytkownik o tym loginie lub emailu już istnieje
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ login }, { email }],
      },
    });

    if (existingUser) {
      if (existingUser.login === login) {
        const error = new Error("Ten login jest już zajęty.");
        error.status = 400; // Dodaj status
        throw error; // Rzuć obiekt error
      }
      if (existingUser.email === email) {
        const error = new Error("Ten email jest już zajęty.");
        error.status = 400; // Dodaj status
        throw error; // Rzuć obiekt error
      }
    }

    // Tworzenie nowego użytkownika
    const user = await User.create({ login, email, password });
    res.status(201).json({ message: "Zarejestrowano pomyślnie" });
  } catch (error) {
    console.log("⚠️ Pełny obiekt błędu:");
    console.dir(error, { depth: null }); // Wyświetla cały obiekt błędu

    // Ustaw status odpowiedzi na 400 lub 500
    const statusCode = error.status || 500;
    const message = error.message || "Wystąpił problem z rejestracją.";
    console.log("MESSAGE: ", message);
    res.status(statusCode).json({ error: message });
  }
};
exports.login = async (req, res) => {
  try {
    const { login, email, password } = req.body;
    const user =
      (await User.findByEmail(email)) || (await User.findByLogin(login));
    console.log("User:", user);
    console.log("comparePassword:", typeof user.comparePassword);
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Nieprawidłowe dane" });
    }
    if (!process.env.TOKEN) {
      throw new Error(
        "JWT_SECRET is not defined. Please set it in your .env file."
      );
    }
    // console.log("user id: ", user.id);
    const token = jwt.sign({ id: user.id }, process.env.TOKEN, {
      expiresIn: "24h",
    });
    res.json({ token });
    //  console.log("token: ", token);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Wyszukiwanie użytkownika po loginie
exports.findUserByLogin = async (req, res) => {
  try {
    const { login } = req.params; // Pobranie loginu z parametrów URL
    const user = await User.findByLogin(login);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Wyszukiwanie użytkownika po emailu
exports.findUserByEmail = async (req, res) => {
  try {
    const { email } = req.params; // Pobranie emaila z parametrów URL
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Wyszukiwanie użytkownika po id
exports.findUserById = async (req, res) => {
  try {
    const { id } = req.params; // Pobranie emaila z parametrów URL
    const user = await User.findByEmail(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
