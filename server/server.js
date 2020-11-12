require('./config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// app.use( express.static( __dirname + '/public' ) );

app.get('/usuario', (req, res) => {
  res.json('getUsuario');
});
app.post('/usuario/:id', (req, res) => {
  let body = req.body;
  if(body.nombre === undefined)
  {
    res.status(400).json({
        status: 400,
        success: false,
        msg: 'Nombre necesario'
    });
  }
  else{
      res.json({
          body
      });
  }
});
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
  res.json({
    id,
    msg: 'Put'
});
});
app.delete('/usuario', (req, res) => {
  res.json('deleteUsuario');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}`);
});