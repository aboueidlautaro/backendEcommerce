const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");
  if (!accessToken)
    return res.json({ error: "El usuario no generó ningún token" });

  try {
    const validToken = verify(accessToken, "importantsecret");
    req.user = validToken;
    if (validToken) {
      return next();
    }
  } catch (err) {
    res.json({ error: "El token no es válido" });
  }
};

module.exports = { validateToken };
