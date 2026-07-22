// Caché en memoria para no saturar las llamadas a la API
const userMatchesCache = new Map();

sock.ev.on("messages.upsert", async ({ messages, type }) => {
  if (type !== "notify") return;

  for (const msg of messages) {
    if (msg.key.fromMe) continue;

    const remoteJid = msg.key.remoteJid;
    const rawText = (msg.message?.conversation || msg.message?.extendedTextMessage?.text || "").trim();
    const text = rawText.toLowerCase();

    if (!text) continue;

    // 1. SI PIDE VER LOS PARTIDOS DISPONIBLES
    if (text.includes("hola") || text.includes("partido") || text.includes("menu") || text === "1") {
      try {
        await sock.sendMessage(remoteJid, { text: "⏳ Buscando la cartelera del día y calculando tendencias..." });

        // Traemos los partidos (usando caché para cuidar la cuota de la API)
        const matches = await matchService.getUpcomingMatches();

        if (!matches || matches.length === 0) {
          await sock.sendMessage(remoteJid, { 
            text: "⚽ ¡Hola! No hay partidos destacados cargados para las próximas horas. Probá consultando más tarde." 
          });
          return;
        }

        // Guardamos los partidos del usuario para que pueda seleccionar luego
        userMatchesCache.set(remoteJid, matches);

        let response = "⚽ *¡PRÓXIMOS PARTIDOS DISPONIBLES!*\n";
        response += "────────────────────────\n\n";

        matches.forEach((m) => {
          response += `🏆 *${m.competicion.toUpperCase()}*\n`;
          response += `⚔️ *${m.local} vs ${m.visitante}*\n`;
          if (m.estadio) response += `🏟️ *Estadio:* ${m.estadio}\n`;
          if (m.hora) response += `⏰ *Hora:* ${m.hora} hs\n`;
          
          // Racha reciente (Formato V-E-D / G-E-P)
          response += `📊 *Racha reciente:*\n`;
          response += `   • ${m.local}: ${m.rachaLocal || "V-V-E-D"}\n`;
          response += `   • ${m.visitante}: ${m.rachaVisitante || "E-D-V-V"}\n`;
          
          // Métrica rápida de IA
          if (m.promedioGoles) response += `⚽ *Prom. Goles:* ${m.promedioGoles} por partido\n`;
          if (m.tendenciaIA) response += `🤖 *Termómetro IA:* ${m.tendenciaIA}\n`;

          response += "\n";
        });

        response += "────────────────────────\n";
        response += "💡 *¿Qué equipo querés analizar?*\n";
        response += "Escribí directamente el nombre (ej: *Boca*, *River*, *Palmeiras*).";

        await sock.sendMessage(remoteJid, { text: response });
      } catch (error) {
        console.error("Error al traer partidos:", error);
        await sock.sendMessage(remoteJid, { text: "❌ Tuve un problema al conectar con la base de datos. Intentá de nuevo en unos minutos." });
      }
    } 
    
    // 2. SI MANDA UN NOMBRE DE EQUIPO O PREGUNTA POR UN CRUCE
    else {
      const cachedMatches = userMatchesCache.get(remoteJid) || [];
      let selectedMatch = null;

      // Buscamos si la palabra escrita coincide con el Local o Visitante guardado
      if (cachedMatches.length > 0) {
        selectedMatch = cachedMatches.find(m => 
          m.local.toLowerCase().includes(text) || 
          m.visitante.toLowerCase().includes(text)
        );
      }

      if (selectedMatch) {
        await sock.sendMessage(remoteJid, { 
          text: "🧠 *PredictIA pensando...*\nAnalizando alineaciones, historial reciente y patrones estadísticas..." 
        });

        // Llamamos al servicio de IA pasándole la data ya capturada
        const prediction = await predictionService.analyzeMatch({ 
          local: selectedMatch.local, 
          visitante: selectedMatch.visitante,
          estadio: selectedMatch.estadio,
          rachaLocal: selectedMatch.rachaLocal,
          rachaVisitante: selectedMatch.rachaVisitante
        });

        await sock.sendMessage(remoteJid, { text: prediction.textMessage });
      } else {
        // Si mandó cualquier otra cosa que no coincide
        await sock.sendMessage(remoteJid, { 
          text: "😊 No reconocí ese equipo en la lista actual.\n\nEscribí *Partidos* o *Hola* para ver la cartelera disponible." 
        });
      }
    }
  }
});