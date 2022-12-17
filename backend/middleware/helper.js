const jwt = require("jsonwebtoken");

module.exports = {
  verifyToken: (req, res, next) => {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      const decoded = jwt.verify(process.env.TOKEN_SECRET, token);
      req.user = decoded;
    } catch (err) {
      return res.status(401).json({
        message : "Auth Failed",
        error: error,
    });
    }
    return next();
  },
};
