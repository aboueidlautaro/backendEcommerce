const { mysql } = require("mysql2");

const connection = mysql.createConnection({
  host: "containers-us-west-41.railway.app",
  user: "root",
  password: "mT9XZ1uFBtLDTBXf6SXE",
  database: "railway",
  port: "7183",
});

module.exports = connection;
