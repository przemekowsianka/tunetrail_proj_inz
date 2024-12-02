const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Brak dostępu" });

  jwt.verify(token, process.env.TOKEN, (err, user) => {
    if (err) return res.status(403).json({ message: "Błędny token" });
    req.user = user;
    next();
  });
};
