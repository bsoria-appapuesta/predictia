const matchService = require("../services/matchService");

const getMatches = async (req, res) => {
  try {
    const matches = await matchService.getUpcomingMatches();
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la lista de partidos" });
  }
};

module.exports = {
  getMatches
};