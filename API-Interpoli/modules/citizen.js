// Microservicio para crear el CRUD de los ciudadanos espaciales

const express = require('express');

const citizen = express.Router();

const cnx = require('./bdata');

// Desarrollo del CRUD

// Consultar

citizen.get('/citizen/list', (req, res) => {
  const query = 'select * from citizen';
  cnx.query(query, (error, data) => {
    try {
      res.status(200).send(data);
    } catch (error) {
      console.log(error);
      //   res.status(404).send({
      //     id: error.id,
      //     message: error.message,
      //   });
    }
  });
});

citizen.get('/citizen/find/:id', (req, res) => {
  const id = req.params.id;

  const query = 'select * from citizen where id = ' + id;
  cnx.query(query, (error, data) => {
    try {
      res.status(200).send(data);
    } catch (error) {
      console.log(error);
    }
  });
});

// Insertar un ciudadano

citizen.post('/citizen/create', (req, res) => {
  let frmdata = req.body;

  const query = 'insert into citizen set ?';

  cnx.query(query, frmdata, (error, data) => {
    try {
      res.status(200).send('Ciudadano insertado exitosamente');
    } catch (error) {
      console.log(error);
    }
  });
});

citizen.put('/citizen/update/:id', (req, res) => {
  let frmdata = req.body;

  const query = 'update citizen set ? where id=?';

  cnx.query(query, [frmdata, req.params.id], (error, data) => {
    try {
      res.status(200).send('Ciudadano actualizado exitosamente');
    } catch (error) {
      res.status(404).send({
        codigo: 'Error',
        mensaje:
          'No es posible ejecutar la consulta, verifique que la información sea correcta',
        id: error.code,
        mensaje: error.message,
      });
    }
  });
});

citizen.delete('/citizen/delete/:id', (req, res) => {
  const id = req.params.id;
  const query = 'delete from citizen where id = ' + id;
  cnx.query(query, (error, data) => {
    try {
      if (data.affectedRows == 0) {
        res.status(200).send({
          status: 'correct',
          message: 'El ciudadano no existe en la base de datos',
        });
      } else {
        res.status(200).send({
          status: 'correct',
          message: 'Ciudadano borrado exitosamente',
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
});

module.exports = citizen;
