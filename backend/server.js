const app = require("./src/app");
const { initWhatsApp } = require("./src/services/whatsappService");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  // Inicia la conexión con WhatsApp
  initWhatsApp();
});