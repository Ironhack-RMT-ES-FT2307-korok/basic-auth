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
    next(error)
  }



})

// GET "/auth/login" => renderiza al usuario un formulario de acceso
router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs")
})

// POST "/auth/login" => recibir las credenciales del usuario y validarlo/autenticarlo
router.post("/login", async (req, res, next) => {

  console.log(req.body)
  const { email, password } = req.body

  // Que los campos no esten vacios (opcional)

  try {
    // debemos buscar un usuario con ese correo electronico
    const foundUser = await User.findOne({ email: email })
    console.log("foundUser", foundUser)
    if (foundUser === null) {
      res.status(400).render("auth/login.hbs", {
        errorMessage: "Usuario no existe con ese correo"
      })
      return; // detener la ejecucion de la ruta
    }
  
  
    // Que la contraseña sea la correcta
    // lo que escribe el usuario en el campo: password
    // la contraseña cifrada de la DB: foundUser.password
    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password)
    console.log(isPasswordCorrect) // true or false

    if (isPasswordCorrect === false) {
      res.status(400).render("auth/login.hbs", {
        errorMessage: "Contraseña no valida"
      })
      return; // detener la ejecucion de la ruta
    }
  
  
    // aqui ya hemos autenticado al usuario => abrimos una sesion del usuario
    // ...
    // con la configuracion de config/index.js ya tenemos acceso a crear sesiones y buscar sesiones

    // crear una sesion activa del usuario
    req.session.user = {
      _id: foundUser._id,
      email: foundUser.email,
      role: foundUser.role
    }
    // guardamos en la sesion informacion del usuario que no deberia cambiar

    // el metodo .save() se invoca para esperar que se crea la sesion antes de hacer lo siguiente
    req.session.save(() => {

      // Si todo sale bien...
      res.redirect("/user")
      // ! DESPUES DE CREAR LA SESION, TENEMOS ACCESO A REQ.SESSION.USER EN CUALQUIER RUTA DE MI SERVIDOR
    })

  
  } catch (error) {
    next(error)
  }

})

// GET "/auth/logout" => le permite al usuario cerrar la sesion activa
router.get("/logout", (req, res, next) => {

  req.session.destroy(() => {
    res.redirect("/")
  })

})


module.exports = router;