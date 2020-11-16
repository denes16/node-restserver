const express = require('express');

const bcrypt = require('bcrypt');

var _ = require('underscore');

const app = express();

const Usuario = require('../models/usuario');

const { validar, validarAdmin } = require('../middlewares/validation');

app.get('/usuario', validar, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    let filtro = { estado: true };
    Usuario.find(filtro, 'nombre email role estado google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err,
                    status: 400
                });
            }

            Usuario.countDocuments(filtro, (err, num) => {
                res.json({
                    status: 200,
                    success: true,
                    num,
                    usuarios
                });
            });
        });


});
app.post('/usuario', [validar, validarAdmin], (req, res) => {

    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err,
                status: 400
            });
        }
        // usuarioDB.password = null;

        res.json({
            success: true,
            usuario: usuarioDB,
            status: 200
        });
    });
});
app.put('/usuario/:id', [validar, validarAdmin], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err,
                status: 500
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                success: false,
                err: {
                    msg: 'Usuario no encontrado'
                },
                status: 400
            });
        }
        res.json({
            success: true,
            usuario: usuarioDB,
            status: 200
        });
    });

});
app.delete('/usuario/:id', [validar, validarAdmin], (req, res) => {

    let id = req.params.id;
    let estado = { estado: false };
    Usuario.findByIdAndUpdate(id, estado, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err,
                status: 400
            });
        }
        if (!usuarioDB) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err: {
                        msg: 'Usuario no encontrado'
                    },
                    status: 400
                });
            }
        }
        res.json({
            success: true,
            msg: 'Usuario borrado',
            usuario: usuarioDB,
            status: 200
        });
    });
    // Borrado físico y permanente
    // Usuario.findByIdAndRemove(id, (err, usuario) => {
    //     if (err) {
    //         return res.status(400).json({
    //             success: false,
    //             err,
    //             status: 400
    //         });
    //     }
    //     if(!usuario){
    //         if (err) {
    //             return res.status(400).json({
    //                 success: false,
    //                 err:{
    //                     msg: 'Usuario no encontrado'
    //                 },
    //                 status: 400
    //             });
    //         }
    //     }
    //     res.json({
    //         success: true,
    //         status: 200,
    //         usuario,
    //         msg: 'Usuario borrado'
    //     });
    // });
});

module.exports = app;