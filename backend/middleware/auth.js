const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Brak dostępu" });

  jwt.verify(token, process.env.TOKEN, (err, user) => {
    if (err) return res.status(403).json({ message: "Błędny token" });
    console.log("Decoded JWT payload:", user);
    req.user = user;

    if (!req.user.id) {
      console.error("User ID is missing in JWT payload!");
      return res
        .status(400)
        .json({ message: "Invalid token: missing user ID" });
    }

    next();
  });
};
