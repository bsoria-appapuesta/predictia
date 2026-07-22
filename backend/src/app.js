require("dotenv").config(); // <--- Carga el archivo .env antes de arrancar

const express = require("express");

const predictionRoutes = require("./routes/predictionRoutes");
const matchesRoutes = require("./routes/matchesRoutes");

const app = express();

app.use(express.json());

// app.use(express.static("src/public"));

app.get("/", (req, res) => {
  res.send("PredictIA API funcionando 🚀");
});

app.use("/predictions", predictionRoutes);
app.use("/matches", matchesRoutes);

module.exports = app;