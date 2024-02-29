// Microservicio para crear el CRUD de los Usuarios espaciales

const express = require("express");
const user = express.Router();
const cnx = require("./bdata");
const md5 = require("js-md5");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { error } = require("console");

// Configuración del multer: creación del espacio de almacenamiento en el servidor

const storage = multer.diskStorage({
  // Destination es una variable de multer para configurar el directorio de destino de la API

  // Recuerde cerrar la ruta con el slash
  destination: (req, file, cb) => {
    cb(null, "./media/user/");
  },

  // Configuración del nombre del archivo a guardar en el disco duro de la API
  filename: function (req, file, cb) {
    cb(null, "user" + "-" + Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Desarrollo del CRUD

// Consultar

user.get("/user/login", (req, res) => {
  res.status(200).send({ respuesta: true });
});

user.get("/user/list", (req, res) => {
  const query = "select * from user";
  cnx.query(query, (error, data) => {
    try {
      res.status(200).send(data);
    } catch (error) {
      res.status(404).send({
        status: "error",
        message: "Error al traer datos",
        error: error.message,
      });
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
      res.status(404).send({
        status: "error",
        message: "Error al traer datos",
        error: error.message,
      });
    }
  });
});

// Insertar un usuario

user.post("/user/create", upload.single("photo"), (req, res) => {
  let frmdata = req.body;

  let hash = md5.create();
  hash.update(frmdata.password);
  hash.hex();
  frmdata.password = hash;

  if (req.file) {
    let file = req.file.originalname;
    let extension = file.includes(".png")
      ? true
      : false || file.includes(".jpg")
      ? true
      : false || file.includes(".jpeg")
      ? true
      : false;

    if (!extension) {
      fs.unlink(req.file.path, (error) => {
        res.status(404).send({
          status: "error",
          Mensaje:
            "Formato de archivo no válido, asegurese de que este sea jpg, jpeg o png",
        });
      });
      return true;
    } else {
      let photo = req.file.filename;

      frmdata.photo = photo;
    }
  } else {
    res.status(404).send({
      status: "error",
      Mensaje:
        "No existe ningún archivo asegúrese de que lo envío correctamente",
    });
    return true;
  }

  const query = "insert into user set ?";

  cnx.query(query, frmdata, (error, data) => {
    try {
      res
        .status(200)
        .send({ status: "ok", Mensaje: "Usuario insertado exitosamente" });
    } catch (error) {
      res.status(404).send({
        status: "error",
        message: "Error al insertar el usuario",
        error: error.message,
      });
    }
  });
});

user.put("/user/update/:id/:route", upload.single("photo"), (req, res) => {
  let frmdata = req.body;

  if (req.file) {
    let file = req.file.originalname;
    let extension = file.includes(".jpg")
      ? true
      : false || file.includes(".png")
      ? true
      : false || file.includes(".jpeg")
      ? true
      : false;

    if (!extension) {
      fs.unlink(req.file.path, (error) => {
        res.status(404).send({
          status: "error",
          Mensaje:
            "Formato de archivo no válido, asegurese de que este sea jpg, jpeg o png",
        });
      });
      return true;
    } else {
      let route = "./media/user/";
      fs.unlink(route + req.params.route, (error) => {});
      let photo = req.file.filename;
      frmdata.photo = photo;
    }
  } else {
    res.status(404).send({
      status: "error",
      Mensaje: "No existe el archivo, asegurate de que lo envío correctamente",
    });
    return true;
  }

  const query = "update user set ? where id=?";
  cnx.query(query, [frmdata, req.params.id], (error, data) => {
    try {
      res
        .status(200)
        .send({ status: "ok", Mensaje: "Usuario actualizado exitosamente" });
    } catch (error) {
      res.status(404).send({
        status: "error",
        message: "Error al actualizar el usuario",
        error: error.message,
      });
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
          status: "ok",
          message: "El usuario no existe en la base de datos",
        });
      } else {
        res.status(200).send({
          status: "ok",
          message: "Usuario borrado exitosamente",
        });
      }
    } catch (error) {
      res.status(404).send({
        status: "error",
        message: "Error al borrar el usuario",
        error: error.message,
      });
    }
  });
});
// Subir imagen, tener el cuenta el middleware de multer que configuramos en el objeto upload

user.get("/user/sendImage/:photo", (req, res) => {
  try {
    const photo = req.params.photo;
    const ruta = "./media/user/" + photo;

    fs.access(ruta, (error) => {
      if (!error) {
        res.sendFile(path.resolve(ruta));
      } else {
        res.status(200).send({
          status: "ok",
          Mensaje: "No se pudo obtener la imagen",
          error: error.message,
        });
      }
    });
  } catch (error) {
    res.status(404).send({
      status: "error",
      Mensaje: "Algo ocurrió...",
      error: error.message,
    });
  }
});
module.exports = user;
