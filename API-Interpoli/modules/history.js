// Microservicio para crear el CRUD de los ciudadanos espaciales

const express = require('express');
const history = express.Router();
const cnx = require('./bdata');

// Desarrollo del CRUD

// Consultar

history.get('/history/list', (req, res) => {
  const query = 'select * from history order by date';
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

history.get('/history/find/:id', (req, res) => {
  const id = req.params.id;

  const query = 'select * from history where id = ' + id;
  cnx.query(query, (error, data) => {
    try {
      res.status(200).send(data);
    } catch (error) {
      console.log(error);
    }
  });
});

// Insertar un ciudadano

history.post('/history/create', (req, res) => {
  let frmdata = req.body;

  const query = 'insert into history set ?';

  cnx.query(query, frmdata, (error, data) => {
    try {
      res.status(200).send('Historial insertado exitosamente');
    } catch (error) {
      console.log(error);
    }
  });
});

history.put('/history/update/:id', (req, res) => {
  let frmdata = req.body;

  const query = 'update history set ? where id=?';

  cnx.query(query, [frmdata, req.params.id], (error, data) => {
    try {
      res.status(200).send('Historial actualizado exitosamente');
    } catch (error) {
      console.log(error);
    }
  });
});

history.delete('/history/delete/:id', (req, res) => {
  const id = req.params.id;
  const query = 'delete from history where id = ' + id;
  cnx.query(query, (error, data) => {
    try {
      if (data.affectedRows == 0) {
        res.status(200).send({
          status: 'correct',
          message: 'El historial no existe en la base de datos',
        });
      } else {
        res.status(200).send({
          status: 'correct',
          message: 'Historial borrado exitosamente',
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
});

module.exports = history;
