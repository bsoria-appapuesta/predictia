const axios = require("axios");

const footballDataClient = axios.create({
  baseURL: "https://api.football-data.org/v4/",
  headers: { "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY }
});

const analyzeMatch = async ({ local, visitante }) => {
  // 1. Algoritmo base de probabilidades (mock estadístico)
  // En la siguiente fase podemos refinarlo con la racha de los últimos 5 partidos
  const probLocal = Math.floor(Math.random() * (60 - 35 + 1)) + 35; // Entre 35% y 60%
  const probAway = Math.floor(Math.random() * (40 - 20 + 1)) + 20;  // Entre 20% y 40%
  const probDraw = 100 - (probLocal + probAway);

  // 2. Determinar nivel de confianza
  let confianza = "Media";
  if (probLocal > 55 || probAway > 50) {
    confianza = "Alta";
  } else if (probDraw > 35) {
    confianza = "Baja";
  }

  // 3. Formatear la respuesta lista para WhatsApp
  const resultFormatted = 
`⚽ *${local} vs ${visitante}*

Victoria local: ${probLocal}%
Empate: ${probDraw}%
Victoria visitante: ${probAway}%

*Confianza:* ${confianza}

*Análisis:*
${local} llega con buen rendimiento como local en sus últimos compromisos. Se proyecta un encuentro dinámico con ventaja táctica para el equipo de casa.`;

  return {
    raw: { probLocal, probDraw, probAway, confianza },
    textMessage: resultFormatted
  };
};

module.exports = {
  analyzeMatch
};