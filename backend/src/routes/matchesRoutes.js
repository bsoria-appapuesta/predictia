const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {

    const partidos = [
        {
            id: 1,
            local: "River Plate",
            visitante: "Boca Juniors",
            estadio: "Monumental",
            horario: "20:00"
        },
        {
            id: 2,
            local: "Barcelona",
            visitante: "Real Madrid",
            estadio: "Camp Nou",
            horario: "16:00"
        },
        {
            id: 3,
            local: "Argentina",
            visitante: "Brasil",
            estadio: "Nacional",
            horario: "21:30"
        }
    ];


    res.json(partidos);

});


module.exports = router;