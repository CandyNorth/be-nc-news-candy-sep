const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";
const config = {};

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE and DATABASE_URL not set");
}

if (ENV === "development") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

if (ENV === "test") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

module.exports = new Pool(config);
