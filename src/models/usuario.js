'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var UserSchema = Schema({
    nombre: String,
    usuario: String,
    email: String,
    password: String,
    ubicacion: String,
    calificacion: String,
    telefono: String,
    fechas: String,
    precio: String,
    rol: String
})

module.exports = mongoose.model('user', UserSchema)