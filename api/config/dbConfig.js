require("dotenv").config();

module.exports = {
  development: {
    db: process.env.DEV_DATABASE,
    user: process.env.DEV_DATABASE_USER,
    pw: process.env.DEV_DATABASE_PW,
    settings: {
      host: process.env.DEV_DATABASE_URL,
      dialect: "mysql",
      logging: false,
      define: {
        charset: "utf8mb4",
      },
    },
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: "mysql",
    define: {
      charset: "utf8mb4",
    },
  },
  production: {
    url: process.env.JAWSDB_URL,
    dialect: "mysql",
    logging: false,
    define: {
      charset: "utf8mb4",
    },
  },
};
