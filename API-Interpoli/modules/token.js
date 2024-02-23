const jwt = require("jsonwebtoken");
const express = require("express");
const generarToken = express.Router();
generarToken.post("/token", (req, res) => {
  try {
    const token = jwt.sign(
      { email: req.body.email, password: req.body.password },
      "AdSo2671333",
      {
        expiresIn: 60 * 60,
      }
    );
    res.status(200).send({
      token: token,
    });
  } catch {
    res.send({ Mensaje: "Error al generar el token" });
  }
});
module.exports = generarToken;
