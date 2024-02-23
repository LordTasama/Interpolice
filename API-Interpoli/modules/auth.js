const jwt = require("jsonwebtoken");
module.exports = autentificar = (req, res, next) => {
  try {
    const verify = jwt.verify(req.headers.authorization, "AdSo2671333");
    next();
  } catch (error) {
    if (res.status(500)) {
      res.send({
        Codigo: 500,
        Mensaje:
          "Error de parte del servidor, ¿El token ya expiró? ¿No se pudo obtener el token? Intenta iniciar sesión nuevamente.",
      });
    } else if (res.status(400)) {
      res.send({
        Codigo: 400,
        Mensaje:
          "Error de parte del cliente, algo está bloqueando el ingreso, comprueba tu conexión...",
      });
    }
  }
};
