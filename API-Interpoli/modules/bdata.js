// Módulo que gestiona la conexión con la base de datos

const mysql = require('mysql2');

const user = 'root';
const pass = '';
const server = 'localhost';
const dbInfo = 'interpolice';

const conexion = mysql.createConnection({
  host: server,
  user: user,
  password: pass,
  database: dbInfo,
});

conexion.connect(error => {
  if (error) {
    console.log(error);
    throw 'Database connection error !';
  } else {
    console.log('Connection successful !');
  }
});

module.exports = conexion;
