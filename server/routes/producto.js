const express = require('express');
const app = express();

let _ = require('underscore');

const { validar } = require('../middlewares/validation');

const Producto = require('../models/producto');

// Listar todos los productos paginados
app.get('/productos', validar, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({disponible: true})
        .skip(desde)
        .limit(limite)
        .populate('categoria')
        .populate('usuario', 'email nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    err,
                    status: 500
                });
            }
            Producto.countDocuments((err, num) => {
                res.json({
                    status: 200,
                    success: true,
                    num,
                    productos
                });
            });
        });
});

// Mostrar un producto
app.get('/producto/:id', validar, (req, res) => {
    const id = req.params.id;
    Producto.findById(id)
        .populate('categoria')
        .populate('usuario','email nombre')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    err,
                    status: 500
                });
            }
            if (!producto) {
                return res.status(400).json({
                    success: false,
                    err: {
                        msg: 'Producto no encontrado'
                    },
                    status: 400
                });
            }
            res.json({
                success: true,
                producto,
                status: 200
            });
        });
});
// Buscar producto
app.get('/productos/buscar/:q', validar, (req,res) =>{
    let q = req.params.q;
    let regex = new RegExp(q,'i');
    Producto.find({ nombre: regex })
    .populate('categoria')
    .populate('usuario','email nombre')
    .exec((err, productos) =>{
        if (err) {
            return res.status(500).json({
                success: false,
                err,
                status: 500
            });
        }
        if (!productos) {
            return res.status(400).json({
                success: false,
                err: {
                    msg: 'Sin resultados'
                },
                status: 400
            });
        }
        res.json({
            success: true,
            productos,
            status: 200
        });
    });
});

// Registrar un producto
app.post('/producto', validar, (req, res) => {
    const userId = req.usuario._id;
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: userId
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err,
                status: 400
            });
        }
        res.json({
            success: true,
            categoria: productoDB,
            status: 200
        });
    });
});

// Actualizar producto
app.put('/producto/:id', validar, (req, res) => {

    const id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria', 'disponible']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err,
                status: 500
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                success: false,
                err: {
                    msg: 'Producto no encontrado'
                },
                status: 400
            });
        }
        res.json({
            success: true,
            producto: productoBD,
            status: 200
        });
    });

});

// Desactivar producto
app.delete('/producto/:id', validar, (req, res) => {
    let id = req.params.id;
    let estado = { disponible: false };
    Producto.findByIdAndUpdate(id, estado, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err,
                status: 400
            });
        }
        if (!productoDB) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err: {
                        msg: 'Producto no encontrado'
                    },
                    status: 400
                });
            }
        }
        res.json({
            success: true,
            msg: 'Producto borrado',
            producto: productoDB,
            status: 200
        });
    });
});

module.exports = app;
