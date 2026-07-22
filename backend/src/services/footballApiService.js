const axios = require("axios");

// Instancia para football-data.org
const footballDataClient = axios.create({
  baseURL: "https://api.football-data.org/v4/",
  headers: { "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY }
});

// Instancia para API-Football (RapidAPI)
const apiFootballClient = axios.create({
  baseURL: "https://api-football-v1.p.rapidapi.com/v3/",
  headers: {
    "X-RapidAPI-Key": process.env.RAPIDAPI_FOOTBALL_KEY,
    "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com"
  }
});

// Función para obtener partidos según la fuente que mejor convenga
const getMatchesFromDataOrg = async () => {
  try {
    const response = await footballDataClient.get("matches");
    return response.data;
  } catch (error) {
    console.error("Error en Football-Data API:", error.message);
    return null;
  }
};

const getMatchesFromApiFootball = async () => {
  try {
    const response = await apiFootballClient.get("fixtures", {
      params: { next: "10" } // Trae los próximos 10 partidos
    });
    return response.data;
  } catch (error) {
    console.error("Error en API-Football:", error.message);
    return null;
  }
};

module.exports = {
  getMatchesFromDataOrg,
  getMatchesFromApiFootball
};