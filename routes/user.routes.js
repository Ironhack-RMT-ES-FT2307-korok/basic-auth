const express = require('express');
const User = require('../models/User.model');
const router = express.Router();

const { isLoggedIn } = require("../middlewares/auth.middlewares.js")

// ejemplo de alguna ruta privada
router.get("/", isLoggedIn, (req, res, next) => {

  
  // esta vista deberia ser privada
  // solo usuarios con una session activa deberian poder entrar
  console.log( req.session.user )
  // si es undefined => el usuario no ha hecho login. no tiene sesion activa
  // si es un objeto => el usuario está activa. Ese es el usuario haciendo las llamadas.

  User.findById(req.session.user._id)
  .then((response) => {

    res.render("user-profile.hbs", {
      user: response
    })

  })
  .catch((error) => {
    next(error)
  })

})


module.exports = router;