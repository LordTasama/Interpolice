// Microservicio para crear el CRUD de los Usuarios espaciales
const express = require("express");
const loginConfirm = express.Router();
const cnx = require("./bdata");

// Desarrollo del CRUD

// Consultar
loginConfirm.get("/user/login/:email/:password", (req, res) => {
  const query = `select * from user where email = '${req.params.email}' and password = '${req.params.password}'`;
  cnx.query(query, (error, data) => {
    try {
      res.status(200).send(data);
    } catch (error) {
      console.log(error);
    }
  });
});

module.exports = loginConfirm;
