const express = require('express');
const router = express.Router();

// GET "/auth/signup" => renderiza al usuario un formulario de registro
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs")
})

// POST "/auth/signup" => recibir la info del usuario y crearlo en la DB

// GET "/auth/login" => renderiza al usuario un formulario de acceso

// POST "/auth/login" => recibir las credenciales del usuario y validarlo/autenticarlo



module.exports = router;