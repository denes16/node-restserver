const express = require('express');

const bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, user) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err,
                status: 500
            });
        }
        if (!user) {
            return res.status(400).json({
                success: false,
                err: {
                    msg: '(Usuario) o contraseña incorrectos'
                },
                status: 400
            });
        }
        if (!bcrypt.compareSync(body.password, user.password)) {
            return res.status(400).json({
                success: false,
                err: {
                    msg: 'Usuario o (contraseña) incorrectos'
                },
                status: 400
            });
        }
        let token = jwt.sign({
            usuario: user,
        }, process.env.SEED_JWT,{expiresIn:process.env.CAD_JWT});
        res.json({
            success: true,
            token,
            usuario: user,
            status: 200
        });
    });

});

module.exports = app;
