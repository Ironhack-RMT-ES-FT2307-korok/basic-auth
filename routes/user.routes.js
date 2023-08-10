const express = require('express');
const User = require('../models/User.model');
const router = express.Router();

const { isLoggedIn, isAdmin } = require("../middlewares/auth.middlewares.js")

const uploader = require("../middlewares/cloudinary.middlewares.js")

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

// ejemplo de una ruta que solo deberia ser accesible por administradores
router.get("/admin", isLoggedIn, isAdmin, (req, res, next) => {
  res.render("admin-only.hbs")
})

// ejemplo de ruta que recibe la imagen para subirla a cloudinary y actualizar el URL en el documento del usuario

//                                      el nombre del campo donde viene la imagen
//                                                  |
router.post("/upload-profile-pic", uploader.single("profilePic"),  (req, res, next) => {
  // cuando nosotros recibimos la imagen
  // esa imagen la pasamos a cloudinary

  // cloudinary nos devuelve el URL de acceso
  console.log(req.file)

  // buscar el usuario que está subiendo esa imagen, actualizarlo y cambiar su profilePic por el req.file.path de cloudinary
  User.findByIdAndUpdate( req.session.user._id, {
    profilePic: req.file.path
  } )
  .then(() => {
    res.redirect("/user")
  })
  .catch((error) => {
    next(error)
  })

})


module.exports = router;