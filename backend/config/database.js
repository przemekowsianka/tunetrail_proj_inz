const { Sequelize } = require("sequelize");

// Konfiguracja połączenia z MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false, // Ustaw na true, jeśli chcesz widzieć logi SQL w konsoli
  }
);

// Sprawdzenie połączenia
sequelize
  .authenticate()
  .then(() => console.log("Połączono z bazą danych MySQL"))
  .catch((err) => console.error("Błąd połączenia z MySQL:", err));

module.exports = sequelize;
