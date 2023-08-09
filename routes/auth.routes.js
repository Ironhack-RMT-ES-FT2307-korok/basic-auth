const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs")

const User = require("../models/User.model.js")

// GET "/auth/signup" => renderiza al usuario un formulario de registro
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs")
})

// POST "/auth/signup" => recibir la info del usuario y crearlo en la DB
router.post("/signup", async (req, res, next) => {
  console.log(req.body)
  // haremos muchas cosas
  const { username, email, password } = req.body

  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/signup.hbs", {
      errorMessage: "Todos los campos deben estar llenos"
    })
    return; // detener la ejecucion de la ruta
  }


  // para validaciones complejas sobre strings regex
  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
  if (regexPassword.test(password) === false) {
    res.status(400).render("auth/signup.hbs", {
      errorMessage: "La contraseña debe tener al menos, una mayuscula, una minuscula, un caracter especial y tener 8 caracteres o más"
    })
    return; // detener la ejecucion de la ruta
  }

  // opcionalmente pueden hacer otros checkeos de regex. Email, telefonos.


  // validacion de que el usuario no estar duplicado
  try {
 
    const foundUser = await User.findOne({$or: [{email: email}, {username: username}]})
    console.log(foundUser)
    if (foundUser !== null) {
      res.status(400).render("auth/signup.hbs", {
        errorMessage: "Ya existe un usuario con nombre de usuario o correo electronico"
      })
      return; // detener la ejecucion de la ruta
    }

    // aqui ciframos la contraseña
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    console.log(passwordHash)

    await User.create({
      username: username,
      email: email,
      password: passwordHash
    })

    // lo ultimo que ocurrira cuando se ejecute todo...
    res.redirect("/auth/login")
  } catch (error) {
    
  }



})

// GET "/auth/login" => renderiza al usuario un formulario de acceso

// POST "/auth/login" => recibir las credenciales del usuario y validarlo/autenticarlo



module.exports = router;