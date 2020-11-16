const express = require('express');

const bcrypt = require('bcrypt');

let jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.G_CLIENT_ID);

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
        }, process.env.SEED_JWT, { expiresIn: process.env.CAD_JWT });
        res.json({
            success: true,
            token,
            usuario: user,
            status: 200
        });
    });

});
// Google id
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.G_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
}
//   verify().catch(console.error);
app.post('/google', async (req, res) => {
    let t = true;
    let token = req.body.idtoken;
    let user = await verify(token)
        .catch(err => {
            t = false;
            return res.status(403).json({
                success: false,
                status: 403,
                err: err
            });
        });
    if(t) Usuario.findOne({ email: user.email }, (e, userDB) => {
        if (e) {
            return res.status(500).json({
                success: false,
                err,
                status: 500
            });
        }
        if (userDB) {
            if (userDB.google === false) {
                return res.status(400).json({
                    success: false,
                    status: 400,
                    err: {
                        msg: 'Debes iniciar sesión de manera normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: userDB,
                }, process.env.SEED_JWT, { expiresIn: process.env.CAD_JWT });
                return res.json({
                    success: true,
                    token,
                    usuario: userDB,
                    status: 200
                });
            }

        }
        else {
            // Correcto pero sin registro, nuevo registro
            let usuario = new Usuario();
            usuario.nombre = user.nombre;
            usuario.email = user.email;
            usuario.img = user.img;
            usuario.google = true;
            usuario.password = ':)';
            usuario.save((err, r) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        err,
                        status: 500
                    });
                }
                else {
                    let token = jwt.sign({
                        usuario: r,
                    }, process.env.SEED_JWT, { expiresIn: process.env.CAD_JWT });
                    return res.json({
                        success: true,
                        token,
                        usuario: user,
                        status: 200
                    });
                }
            });

        }
    });
});
module.exports = app;
