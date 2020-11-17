const express = require('express');

const fs = require('fs');
const path = require('path');

const app = express();

const { validarUrl } = require('../middlewares/validation');

app.get('/imagen/:tipo/:img',validarUrl, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname,`../../uploads/${ tipo }/${ img }`);

    if(fs.existsSync(pathImg))
    {
        return res.sendFile(pathImg);
    }
    const noImg = path.resolve(__dirname,'../assets/original.jpg');
    return res.sendFile(noImg);

});

module.exports = app;

