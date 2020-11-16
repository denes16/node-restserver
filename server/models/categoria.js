const mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    usuario:{
        type: Schema.Types.ObjectId,
        required: [true, 'El usuario es necesario'],
        ref: 'Usuario'
    },
    nombre:{
        type: String,
        unique:true,
        required: [true, 'El nombre es necesario']
    }
});


categoriaSchema.plugin( uniqueValidator, { message: '{PATH} ya registrado' } );

module.exports = mongoose.model('Categoria',categoriaSchema);
