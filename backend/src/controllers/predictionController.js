const predictionService = require("../services/predictionService");

// GET /predictions?local=River&visitante=Boca
const getPrediction = async (req, res) => {
  try {
    // Si la URL trae query params los usa, si no, usa un ejemplo por defecto
    const local = req.query.local || "River Plate";
    const visitante = req.query.visitante || "Boca Juniors";

    const result = await predictionService.analyzeMatch({ local, visitante });
    
    // Devolvemos el texto listo para leer
    res.send(`<pre>${result.textMessage}</pre>`);
  } catch (error) {
    console.error("Error en getPrediction:", error);
    res.status(500).json({ error: "Error al generar la predicción" });
  }
};

// POST /predictions (Para cuando WhatsApp envié JSON)
const createPrediction = async (req, res) => {
  try {
    const { local, visitante } = req.body;

    if (!local || !visitante) {
      return res.status(400).json({ 
        error: "Se requieren los nombres de los equipos 'local' y 'visitante'." 
      });
    }

    const result = await predictionService.analyzeMatch({ local, visitante });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error en createPrediction:", error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
};

module.exports = {
  getPrediction,
  createPrediction
};