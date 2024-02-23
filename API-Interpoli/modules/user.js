// Microservicio para crear el CRUD de los Usuarios espaciales

const express = require("express");
const user = express.Router();
const cnx = require("./bdata");
const md5 = require("js-md5");

// Desarrollo del CRUD

// Consultar

user.get("/user/list", (req, res) => {
  const query = "select * from user";
  cnx.query(query, (error, data) => {
    try {
      res.status(200).send(data);
    } catch (error) {
      console.log(error);
    }
  });
});

user.get("/user/find/:id", (req, res) => {
  const id = req.params.id;

  const query = "select * from user where id = " + id;
  cnx.query(query, (error, data) => {
    try {
      res.status(200).send(data);
    } catch (error) {
      console.log(error);
    }
  });
});

// Insertar un usuario

user.post("/user/create", (req, res) => {
  let frmdata = req.body;
  let hash = md5.create();
  hash.update(frmdata.password);
  hash.hex();
  frmdata.password = hash;
  const query = "insert into user set ?";

  cnx.query(query, frmdata, (error, data) => {
    try {
      res.status(200).send({ Mensaje: "Usuario insertado exitosamente" });
    } catch (error) {
      console.log(error);
    }
  });
});

user.put("/user/update/:id", (req, res) => {
  let frmdata = req.body;
  const query = "update user set ? where id=?";
  cnx.query(query, [frmdata, req.params.id], (error, data) => {
    try {
      res.status(200).send({ mensaje: "Usuario actualizado exitosamente" });
    } catch (error) {
      console.log(error);
    }
  });
});

user.delete("/user/delete/:id", (req, res) => {
  const id = req.params.id;
  const query = "delete from user where id = " + id;
  cnx.query(query, (error, data) => {
    try {
      if (data.affectedRows == 0) {
        res.status(200).send({
          status: "correct",
          message: "El usuario no existe en la base de datos",
        });
      } else {
        res.status(200).send({
          status: "correct",
          message: "Usuario borrado exitosamente",
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
});

module.exports = user;
