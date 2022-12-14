const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;

process.on("uncaughtException", function (err) {
  console.log(err);
  var stack = err.stack;
});

const usersRouter = require("./src/routes/Users");
app.use("/auth", usersRouter);

app.listen(port, (err) => {
  if (err) throw console.log(err);
  console.log("Escuchando en el puerto: " + port);
});
