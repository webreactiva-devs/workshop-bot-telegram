/*
 Este es el bot de la carpeta iss-location pero generado integramente con IA (ChatGPT o3-mini-high)
*/

import { Telegraf, Markup } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

// Al iniciar, se solicita al usuario compartir su ubicación
bot.start((ctx) => {
  return ctx.reply(
    "Hola, por favor comparte tu ubicación:",
    Markup.keyboard([Markup.button.locationRequest("Enviar ubicación")])
      .oneTime()
      .resize()
  );
});

// Cuando el usuario comparte su ubicación
bot.on("location", async (ctx) => {
  try {
    // Obtenemos la ubicación del usuario
    const userLat = ctx.message.location.latitude;
    const userLon = ctx.message.location.longitude;

    // Obtenemos la ubicación actual de la ISS
    const issResponse = await fetch("http://api.open-notify.org/iss-now.json");
    const issData = await issResponse.json();

    if (issData.message !== "success") {
      return ctx.reply("No se pudo obtener la ubicación de la ISS.");
    }

    const issLat = parseFloat(issData.iss_position.latitude);
    const issLon = parseFloat(issData.iss_position.longitude);

    // Función para convertir grados a radianes
    const toRad = (value) => (value * Math.PI) / 180;

    // Cálculo de la distancia usando la fórmula de Haversine
    const R = 6371; // Radio de la Tierra en km
    const dLat = toRad(issLat - userLat);
    const dLon = toRad(issLon - userLon);
    const lat1Rad = toRad(userLat);
    const lat2Rad = toRad(issLat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Consulta a la API de Wikipedia para lugares cercanos en un radio de 10 km
    const wikiURL = `https://es.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${userLat}|${userLon}&gsradius=10000&gslimit=10&format=json`;
    const wikiResponse = await fetch(wikiURL);
    const wikiData = await wikiResponse.json();

    let places = "";
    if (
      wikiData.query &&
      wikiData.query.geosearch &&
      wikiData.query.geosearch.length > 0
    ) {
      places = wikiData.query.geosearch
        .map((place) => `- ${place.title} (a ${place.distance} m)`)
        .join("\n");
    } else {
      places = "No se encontraron lugares cercanos.";
    }

    // Se envía la información al usuario
    const message = `La ISS se encuentra a aproximadamente ${distance.toFixed(
      2
    )} km de tu ubicación.\n\nLugares cercanos en un radio de 10 km:\n${places}`;
    return ctx.reply(message);
  } catch (error) {
    console.error(error);
    return ctx.reply("Ocurrió un error al procesar tu solicitud.");
  }
});

// Iniciar el bot y manejar el cierre de procesos
bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
