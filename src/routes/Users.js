const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");

const pool = require("../config/config");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    pool.query(
      `INSERT INTO users (username, password) VALUES ('${username}', '${hash}')`
    );
    res.json({
      message: "Usuario creado correctamente",
      body: {
        user: { username, password },
      },
    });
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = pool.query(`SELECT * FROM users WHERE username = '${username}'`);
  if (user.length === 0) {
    return res.json({ error: "El usuario no existe" });
  }
  bcrypt.compare(password, user[0].password).then((match) => {
    if (!match) return res.json({ error: "Contraseña incorrecta" });
    const accessToken = sign(
      {
        username: user[0].username,
        id: user[0].id,
        user_role: user[0].user_role,
      },
      "importantsecret"
    );
    res.json({
      token: accessToken,
      username: user[0].username,
      id: user[0].id,
      user_role: user[0].user_role,
    });
  });
});

router.get("auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/basicinfo/:id", async (req, res) => {
  const basicInfo = pool.query(
    `SELECT id, username, user_role FROM users WHERE id = '${req.params.id}'`
  );
  res.json(basicInfo);
});

router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = pool.query(
    `SELECT * FROM users WHERE username = '${req.user.username}'`
  );
  bcrypt.compare(oldPassword, user[0].password).then((match) => {
    if (!match) return res.json({ error: "Contraseña incorrecta" });
    bcrypt.hash(newPassword, 10).then((hash) => {
      pool.query(
        `UPDATE users SET password = '${hash}' WHERE username = '${req.user.username}'`,

        (err, result) => {
          if (err) {
            res.json(err);
          } else {
            res.json(result);
          }
        }
      );
    });
  });
});

module.exports = router;
