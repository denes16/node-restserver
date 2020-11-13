

// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Base de datos

const urlDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : 'mongodb+srv://denes27:vDcseUnNTF6x8ByU@denes-cluster.bas3u.mongodb.net/cafe' ;

process.env.URL_DB = urlDB;