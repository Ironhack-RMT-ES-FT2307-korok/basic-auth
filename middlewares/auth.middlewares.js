
function isLoggedIn(req, res, next) {

  if (req.session.user === undefined) {
    // el usuario no está logeado
    res.redirect("/auth/login")
  } else {
    // el usuario si está activo
    next()
  }

}

function isAdmin(req, res, next) {

  if (req.session.user.role === "admin") {
    next() // adelante
  } else {
    res.redirect("/auth/login")
  }

}


function updateLocals(req, res, next) {

  if (req.session.user === undefined) {
    // creo una variable local que indique que no está logeado
    res.locals.isUserActive = false;
  } else {
    // creo una variable local que indique que si está logeado
    res.locals.isUserActive = true;
  }

  next() // despues de actualizar la variable, continua con las rutas
}


module.exports = {
  isLoggedIn: isLoggedIn,
  updateLocals: updateLocals,
  isAdmin: isAdmin
}
