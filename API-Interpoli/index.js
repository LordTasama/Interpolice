const express = require("express");
const cors = require("cors");
const user = require("./modules/user");
const citizen = require("./modules/citizen");
const history = require("./modules/history");
const auth = require("./modules/auth");
const token = require("./modules/token");
const loginConfirm = require("./modules/login");
const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;

// Rutas de la app

// Microservicio citizen
app.use("/", token);
app.use("/", loginConfirm);
app.use("/", auth, user);
app.use("/", auth, citizen);
app.use("/", auth, history);

app.listen(port, () => {});

// const multiplicar = require('./modules/multiplicar');

// console.log(multiplicar.multiplicar(3, 3));

// const os = require('os');
// const path = require('path');
// const process = require('process');
// console.log(os.type());
// console.log(path.dirname('http://www.facebook.com'));
// console.log(process.env);
