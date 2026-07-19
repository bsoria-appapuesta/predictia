const express = require("express");
const router = express.Router();

const { 
  getPrediction, 
  createPrediction 
} = require("../controllers/predictionController");


router.get("/", getPrediction);


// Crear una nueva predicción
router.post("/", createPrediction);


module.exports = router;