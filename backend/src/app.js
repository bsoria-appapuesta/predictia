const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("PredictIA API funcionando 🚀");
});

module.exports = app;