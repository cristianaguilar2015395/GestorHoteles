'use strict'

var express = require("express")
var LoginController = require("../controllers/loginController")
var md_auth = require("../middlewares/authenticated")

var api = express.Router()
api.post('/registrarUsuario', LoginController.registrarUsuario);
api.post('/registrarHotel', LoginController.registrarHotel)
api.post('/login', LoginController.login)
api.put('/editarUsuario/:idUser',md_auth.ensureAuth, LoginController.editarUsuario);
api.delete('/eliminarUsuario/:idUser',md_auth.ensureAuth, LoginController.eliminarUsuario)
api.get('/buscarCalificacion/:calificacion', LoginController.buscarCalificacion);
api.get('/buscarOrdenAlfabetico',LoginController.buscarOrdenAlfabetico)
api.get('/buscarPrecioMayorMenor',LoginController.buscarPrecioMayorMenor)
api.get('/buscarPrecioMenorMayor',LoginController.buscarPrecioMenorMayor)




module.exports = api;