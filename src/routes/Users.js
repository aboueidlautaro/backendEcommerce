const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");

const connection = require("../config/config");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    connection.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hash],
      (err, result) => {
        if (err) {
          res.json(err);
        } else {
          res.json(result);
        }
      }
    );
    res.json("Usuario creado correctamente");
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = connection.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    }
  );
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
  const id = req.params.id;

  const basicInfo = connection.query(
    connection.query(
      "SELECT * from users WHERE id = ?",
      [id],
      (err, rows, fields) => {
        if (err) {
          res.json(err);
        } else {
          res.json(rows);
        }
      }
    )
  );
  res.json(basicInfo);
});

router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = connection.query(
    "SELECT * FROM users WHERE username = ?",
    [req.user.username],
    (err, rows, fields) => {
      if (err) {
        res.json(err);
      } else {
        res.json(rows);
      }
    }
  );
  bcrypt.compare(oldPassword, user[0].password).then((match) => {
    if (!match) return res.json({ error: "Contraseña incorrecta" });
    bcrypt.hash(newPassword, 10).then((hash) => {
      connection.query(
        "UPDATE users SET password = ? WHERE username = ?",
        [hash, req.user.username],
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
