

// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// Vencimiento del token

process.env.CAD_JWT = "30 days";

// Seed

process.env.SEED_JWT = process.env.SEED_JWT || 'este-es-mi-secret-key-de-desarrollo';
// Base de datos

const urlDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : process.env.MONGO_DB_URL ;

process.env.URL_DB = urlDB;