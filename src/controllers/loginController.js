'use strict'

var bcrypt = require("bcrypt-nodejs");
var User = require("../models/usuario")
var jwt = require("../services/jwt")

function registrarUsuario(req, res){
    var user = new User();
    var params = req.body;

    if(params.nombre && params.usuario && params.password){
        user.nombre = params.nombre;
        user.usuario = params.usuario;
        user.email = params.email;
        user.rol = 'ROLE_USUARIO';

        User.find({ $or: [
            { usuario: user.usuario },
            { email: user.email }
        ]}).exec((err, usuarios)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion de usuario' })

            if(usuarios && usuarios.length >= 1){
                return res.status(500).send({ message: 'El usuario ya existe' })
            }else{
                bcrypt.hash(params.password, null, null, (err, hash)=>{
                    user.password = hash;

                    user.save((err, usuarioGuardado)=>{
                        if(err) return res.status(500).send({ message: 'Error al guardar el Usuario' })

                        if(usuarioGuardado){
                            res.status(200).send({ user: usuarioGuardado })
                            }else{
                                res.status(404).send({ message: 'No se ha podido registrar el usuario' })
                        }
                    })
                })
            }
        })

    }else{
        res.status(200).send({ 
            message: 'Rellenen todos los datos necesarios' 
        })
    }
}


function registrarHotel(req, res){
    var user = new User();
    var params = req.body;

    if(params.nombre && params.password){
        user.nombre = params.nombre;
        user.ubicacion = params.ubicacion;
        user.email = params.email;
        user.calificacion = params.calificacion;
        user.telefono = params.telefono;
        user.fechas = params.fechas;
        user.precio = params.precio;
        user.rol = 'ROLE_HOTEL';

        User.find({ $or: [
            { email: user.email }
        ]}).exec((err, usuarios)=>{
        if(err) return res.status(500).send({ message: 'error en la peticion de agregar' })
        if(usuarios && usuarios.length >= 1){
            return res.status(500).send({ message: 'El Hotel ya existe' })
        }else {
            bcrypt.hash(params.password, null, null, (err, hash)=>{
                user.password = hash;

                user.save((err, usuarioGuardado)=>{
                    if(err) return res.status(500).send({ message: 'Error al guardar el Hotel' })

                    if(usuarioGuardado){
                        res.status(200).send({ hotel: usuarioGuardado })
                    }else{
                        res.status(404).send({ message: 'No se ha podidio ' })
                    }
                })
            })
        }
    })
     }else{
    res.status(200).send({
        message: 'Rellene todos los datos'
    })
}
}

function login(req, res){
    var params = req.body;

    User.findOne({email: params.email}, (err, user)=>{
        if(err) return res.status(500).send({ message: 'Error en la peticion'})

        if(user){
            bcrypt.compare(params.password, user.password, (err, check)=>{
                if(check){
                    if(params.gettoken){
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        })
                    }else{
                        user.password = undefined;
                        return res.status(200).send({ user })
                    }
                }else{
                    return res.status(404).send({ message: 'El usuario no se ha podido identificar'})                
                }
            })
        
        }else{
            return res.status(404).send({ message: 'El usuario no se ha podido logear'})
        }
    })

}

//PROCEDIMIENTOS EDITAR Y ELIMINAR  
function editarUsuario(req, res){
    var userId = req.params.idUser;
    var params = req.body

    delete params.password

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tiene los permisos para actualiar este usuario'})
     }

     User.findByIdAndUpdate(userId, params, {new: true}, (err, usuarioActualizado)=>{
         if(err) return res.status(500).send({ message: 'Error en la peticion'})
         if(!usuarioActualizado) return res.status(404).send({message: 'No se a podido actualizar los datos del usuario'})

         return res.status(200).send({usuario: usuarioActualizado})
     })
}

function eliminarUsuario(req, res){
    var usuarioId = req.params.idUser;

    if(usuarioId != req.user.sub){
        return res.status(500).send({message: 'No tiene los permisos para eliminar este usuario'})
     }
    User.findByIdAndDelete(usuarioId, (err, usuarioEliminado)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion de eliminar Usuarios'})
        if(!usuarioEliminado) return res.status(404).send({message: 'Error al eliminar el usarios'})
        return res.status(200).send({usuario: usuarioEliminado})
    })

}

// CONSULTAS
function buscarCalificacion(req, res){
    var buscarCalificacion = req.params.calificacion
    User.find({calificacion:{$regex: buscarCalificacion}, rol:/^ROLE_HOTEL/}, (err, BuscarCalificacion)=> {
        if(err) return res.status(500).send({message: 'Error en la peticion de buscar la calificacion'})
        if(!BuscarCalificacion) return res.status(404).send({message: 'No hay calificacion'})
        return res.status(200).send({usuario: BuscarCalificacion})
    })
}

function buscarOrdenAlfabetico(req, res){
    User.find({rol:/^ROLE_HOTEL/},(err, usuario)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion de buscar usuario'})
        if(!usuario) return res.status(404).send({message: 'Error en la consulta de usuario'})
        return res.status(200).send({usuario})
     }).sort({nombre: 1})
}

function buscarPrecioMayorMenor(req, res){
    User.find({rol:/^ROLE_HOTEL/},(err, usuario)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion de buscar usuario'})
        if(!usuario) return res.status(404).send({message: 'Error en la consulta de usuario'})
        return res.status(200).send({usuario})
     }).sort({precio:1})
    
}

function buscarPrecioMenorMayor(req, res){
    User.find({rol:/^ROLE_HOTEL/},(err, usuario)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion de buscar usuario'})
        if(!usuario) return res.status(404).send({message: 'Error en la consulta de usuario'})
        return res.status(200).send({usuario})
     }).sort({precio:-1})
    
}



module.exports = {
    registrarUsuario,
    registrarHotel,
    login,
    editarUsuario,
    eliminarUsuario,

    buscarCalificacion,
    buscarOrdenAlfabetico,
    buscarPrecioMayorMenor,
    buscarPrecioMenorMayor
}