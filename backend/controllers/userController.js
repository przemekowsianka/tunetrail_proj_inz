const User = require("../models/users");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { login, email, password } = req.body;
    const user = new User({ login, email, password });
    await user.save();
    res.status(201).json({ message: "Zarejestrowano pomyślnie" });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
      expiresIn: "1h",
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
