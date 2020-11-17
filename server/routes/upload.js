const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function (req, res) {

    const tipo = req.params.tipo;
    const id = req.params.id;
    // Validar tipos
    const tiposValidos = ['productos', 'usuarios'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            success: false,
            err: {
                msg: 'El tipo de subida específicado no es válido, los tipos permitidos son ' + tiposValidos.join(', ')
            },
            status: 400
        });
    }

    // Extensiones
    const extensionesPermitidas = ['png', 'jpg', 'gif', 'jepg'];

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            success: false,
            err: {
                msg: 'No se recibió ningún archivo'
            },
            status: 400
        });
    }
    let file = req.files.archivo;
    const nombreFileCortado = file.name.split('.');
    const extension = nombreFileCortado[nombreFileCortado.length - 1];
    if (!extensionesPermitidas.includes(extension)) {
        return res.status(400).json({
            success: false,
            err: {
                msg: 'Tipo de archivo no permitido, las extensiones válidas son ' + extensionesPermitidas.join(', ')
            },
            status: 400
        });
    }
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    if( ! fs.existsSync( path.resolve(`uploads`) ) ) {
        crearDirectorio();
    }
    if( ! fs.existsSync( path.resolve(`uploads/${ tipo }`) ) ){
        crearDirectorio( tipo );
    }
    file.mv(`uploads/${tipo}/${nombreArchivo}`, function (err) {
        if (err) {
            return res.status(500).json({
                success: false,
                err,
                status: 500
            });
        }

        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, res, nombreArchivo);
                break;
            case 'productos':
                imagenProducto(id, res, nombreArchivo);
                break;
            default:
                res.status(400).json({
                    success: false,
                    err: {
                        msg: 'El tipo de subida específicado no es válido, los tipos permitidos son ' + tiposValidos.join(', ')
                    },
                    status: 400
                });
                break;
        }
    });

});

const imagenUsuario = (id, res, nombreFile) => {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            delFile(nombreFile, 'usuarios');
            return res.status(500).json({
                success: false,
                err,
                status: 500
            });
        }
        if (!usuarioDB) {
            delFile(nombreFile, 'usuarios');
            return res.status(400).json({
                success: false,
                err: {
                    msg: 'El usuario no existe'
                },
                status: 400
            });
        }
        delFile(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreFile;
        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    err,
                    status: 500
                });
            }
            return res.json({
                success: true,
                status: 200,
                usuario: usuarioGuardado,
                msg: 'Se guardó con éxito'
            });
        });
    });
};
const imagenProducto = (id, res, nombreFile) => {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            delFile(nombreFile, 'productos');
            return res.status(500).json({
                success: false,
                err,
                status: 500
            });
        }
        if (!productoDB) {
            delFile(nombreFile, 'productos');
            return res.status(400).json({
                success: false,
                err: {
                    msg: 'El producto no existe'
                },
                status: 400
            });
        }
        delFile(productoDB.img, 'productos');
        productoDB.img = nombreFile;
        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    err,
                    status: 500
                });
            }
            return res.json({
                success: true,
                status: 200,
                producto: productoGuardado,
                msg: 'Se guardó con éxito'
            });
        });
    });
};

const delFile = (file, tipo) => {
    let pathUrl = path.resolve(__dirname, `../../uploads/${tipo}/${file}`);
    if (fs.existsSync(pathUrl)) {
        // Borrar imagen antigua
        fs.unlinkSync(pathUrl);
    }
};
function crearDirectorio( tipo ){

    switch ( tipo ) {
        case 'usuarios':
            fs.mkdir(`uploads/${ tipo }`, err => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Directory Created');
                }
            });
            break;

        case 'productos':
            fs.mkdir(`uploads/${ tipo }`, err => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Directory Created');
                }
            });
            break;

        default :

            fs.mkdir('uploads', err => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Directory Created');
                }
            });

            break;
    }

}
module.exports = app;
