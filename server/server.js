require('./config');
const mongoose = require('mongoose');
const express = require('express');

const app = express();

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// app.use( express.static( __dirname + '/public' ) );


// Configuración de rutas
app.use( require('./routes/index') );


mongoose.connect(process.env.URL_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
},(err) => {
  if (err) {
      throw err;

  }
  console.log('Base de Datos online');

});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}`);
});