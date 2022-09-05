var { Pool } = require("pg");

var pool = new Pool({
  host: "containers-us-west-81.railway.app",
  user: "postgres",
  password: "zGsqfYYPRIIwcfa3FPDH",
  database: "railway",
  port: "7507",
});

module.exports = pool;
