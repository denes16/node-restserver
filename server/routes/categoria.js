
const express = require('express');
const app = express();

let _ = require('underscore');

const { validar, validarAdmin } = require('../middlewares/validation');

const Categoria = require('../models/categoria');


// Mostrar todas las categorias
app.get('/categorias', validar, (req, res) => {
    Categoria.find({})
    .sort('nombre')
    .populate('usuario','email nombre')
    .exec( (err, categorias) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err,
                status: 500
            });
        }
        Categoria.countDocuments((err, num) => {
            res.json({
                status: 200,
                success: true,
                num,
                categorias
            });
        });
    });
});

// Mostrar una categoria
app.get('/categoria/:id', validar, (req, res) => {
    const id = req.params.id;
    Categoria.findById(id)
    .populate('usuario','email nombre')
    .exec((err, categoria) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err,
                status: 500
            });
        }
        if (!categoria) {
            return res.status(400).json({
                success: false,
                err: {
                    msg: 'Categoría no encontrada'
                },
                status: 400
            });
        }
        res.json({
            success: true,
            categoria,
            status: 200
        });
    });
});

// Registrar categoría
app.post('/categoria', validar, (req, res) => {
    const userId = req.usuario._id;
    let body = req.body;
    let categoria = new Categoria({
        usuario: userId,
        nombre: body.nombre
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err,
                status: 400
            });
        }
        res.json({
            success: true,
            categoria: categoriaDB,
            status: 200
        });
    });
});
// Editar categoria
app.put('/categoria/:id', validar, (req, res) => {

    const id = req.params.id;
    let body = _.pick(req.body, ['nombre']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err,
                status: 500
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                success: false,
                err: {
                    msg: 'Categoria no encontrado'
                },
                status: 400
            });
        }
        res.json({
            success: true,
            categoria: categoriaDB,
            status: 200
        });
    });

});
// Borrar categoria
app.delete('/categoria/:id', [validar, validarAdmin], (req, res) => {

    const id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err,
                status: 400
            });
        }
        if (!categoriaDB) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err: {
                        msg: 'Categoría no encontrada'
                    },
                    status: 400
                });
            }
        }
        res.json({
            success: true,
            status: 200,
            categoria:categoriaDB,
            msg: 'Categoría borrada'
        });
    });
});
module.exports = app;
