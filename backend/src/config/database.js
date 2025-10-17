const knex = require('knex');
require('dotenv').config();

const config = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'afcf_user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'afcf_database',
    charset: 'utf8mb4'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations'
  },
  seeds: {
    directory: './seeds'
  }
};

// For development
if (process.env.NODE_ENV === 'development') {
  config.debug = true;
}

// For production
if (process.env.NODE_ENV === 'production') {
  config.connection.ssl = {
    rejectUnauthorized: false
  };
}

const db = knex(config);

// Test database connection
db.raw('SELECT 1+1 as result')
  .then(() => {
    console.log('Database connection established successfully');
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

module.exports = db;
