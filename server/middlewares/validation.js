
const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');



// Verificar token

let validar = ( req, res, next ) => {

    let token = req.get('Authorization');
    jwt.verify( token, process.env.SEED_JWT, (err, data) => {
        if( err )
        {
            return res.status(401).json({
                status: 401,
                success: false,
                err
            });
        }


        req.usuario = data.usuario;
        next();
    });

};

let validarUrl = ( req, res, next ) => {

    let token = req.query.token;
    jwt.verify( token, process.env.SEED_JWT, (err, data) => {
        if( err )
        {
            return res.status(401).json({
                status: 401,
                success: false,
                err
            });
        }


        req.usuario = data.usuario;
        next();
    });

};

// Verofocar ADMIN_ROLE

let validarAdmin = ( req, res, next ) => {

    let usuario =req.usuario;
    if(usuario.role === 'ADMIN_ROLE')
    {
        next();
    }
    else
    {
        return res.status(401).json({
            status: 401,
            success: false,
            err:{
                msg: 'No cuentas con los permisos necesarios para esta operación'
            },
        });
    }


};


module.exports = {
    validar,
    validarAdmin,
    validarUrl
};
