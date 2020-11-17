// Rutas

const express = require('express');

const app = express();


app.use( require('./usuario'));
app.use( require('./login') );
app.use( require('./categoria'));
app.use( require('./producto'));
app.use( require('./upload'));
app.use( require('./img'));

module.exports = app;