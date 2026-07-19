const getPrediction = (req, res) => {

  res.json({
    producto: "Ejemplo",
    prediccion: "Sin análisis todavía",
    confianza: "0%"
  });

};


const createPrediction = (req, res) => {

  const { 
    partido, 
    river, 
    empate, 
    boca,
    rendimientoLocal,
    rendimientoVisitante
  } = req.body;


  // Convertimos datos a números
  const votosLocal = Number(river);
  const votosEmpate = Number(empate);
  const votosVisitante = Number(boca);

  const rendimientoL = Number(rendimientoLocal);
  const rendimientoV = Number(rendimientoVisitante);


  // Porcentaje de encuesta
  const totalVotos = votosLocal + votosEmpate + votosVisitante;

  let porcentajeLocal = 0;
  let porcentajeVisitante = 0;
  let porcentajeEmpate = 0;

  if(totalVotos > 0){
    porcentajeLocal = (votosLocal / totalVotos) * 100;
    porcentajeVisitante = (votosVisitante / totalVotos) * 100;
    porcentajeEmpate = (votosEmpate / totalVotos) * 100;
  }


  // Combinamos encuesta + rendimiento
  const puntajeLocal = (porcentajeLocal * 0.5) + (rendimientoL * 0.5);
  const puntajeVisitante = (porcentajeVisitante * 0.5) + (rendimientoV * 0.5);


  let prediccion = "";
  let confianza = 0;


  if(puntajeLocal > puntajeVisitante && puntajeLocal > porcentajeEmpate){

    prediccion = "El equipo local tiene mayor probabilidad de ganar";
    confianza = Math.round(puntajeLocal);

  }
  else if(puntajeVisitante > puntajeLocal && puntajeVisitante > porcentajeEmpate){

    prediccion = "El equipo visitante tiene mayor probabilidad de ganar";
    confianza = Math.round(puntajeVisitante);

  }
  else {

    prediccion = "El partido tiene alta probabilidad de empate";
    confianza = Math.round(porcentajeEmpate);

  }


  res.json({
    producto: partido,
    prediccion,
    confianza: confianza + "%"
  });

};


module.exports = {
  getPrediction,
  createPrediction
};

module.exports = {
  getPrediction,
  createPrediction
};