const express = require('express');
const router = express.Router();

// aqui ejecutamos la funcion que actualiza las variables locales en TODAS las llamadas
const { updateLocals } = require("../middlewares/auth.middlewares.js")
router.use(updateLocals)

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const authRouter = require("./auth.routes.js")
router.use("/auth", authRouter)

const userRouter = require("./user.routes.js")
router.use("/user", userRouter)

// aqui creo una ruta nueva de desarrollo
console.log("probando")

module.exports = router;

