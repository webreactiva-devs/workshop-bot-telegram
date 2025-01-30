import { Markup } from "telegraf";
import { haversine } from "./utils.js";

export const setupHandlers = (bot) => {
  // Comando /start
  bot.command("start", (ctx) => {
    ctx.reply(
      "¡Hola! Puedo ayudarte a encontrar la ISS.\n" +
        "Usa /location para compartir tu ubicación."
    );
  });

  // Comando /help
  bot.help((ctx) =>
    ctx.reply("Con /location puedes saber cómo de lejos estás de la ISS")
  );

  // Comando /location
  bot.command("location", (ctx) => {
    ctx.reply(
      "Comparte tu ubicación:",
      Markup.keyboard([
        Markup.button.locationRequest("📍 Envía ubicación"),
      ]).resize()
    );
  });

  // Manejador de ubicación
  bot.on("location", async (ctx) => {
    try {
      const { latitude: userLat, longitude: userLon } = ctx.message.location;

      // 2. Obtener posición ISS
      const issRes = await fetch("http://api.open-notify.org/iss-now.json");
      const {
        iss_position: { latitude: issLat, longitude: issLon },
      } = await issRes.json();

      // 3. Calcular distancia
      const distance = haversine(
        parseFloat(issLat),
        parseFloat(issLon),
        userLat,
        userLon
      );

      // 4. Buscar lugares cercanos a la ISS en Wikipedia
      const baseUrl = "https://en.wikipedia.org/w/api.php";
      const params = new URLSearchParams({
        action: "query",
        list: "geosearch",
        gscoord: `${issLat}|${issLon}`,
        gsradius: 10000,
        gslimit: 1,
        format: "json",
      });
      const wikiResponse = await fetch(`${baseUrl}?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const wikiData = await wikiResponse.json();

      // Preparar la respuesta con la información de Wikipedia
      let wikiInfo = "No se encontraron lugares cercanos en Wikipedia.";
      if (wikiData.query?.geosearch?.length > 0) {
        const place = wikiData.query.geosearch[0];
        wikiInfo =
          `Lugar más cercano: ${place.title}\n` +
          `Distancia al lugar: ${(place.dist / 1000).toFixed(2)} km\n` +
          `Más información: https://en.wikipedia.org/wiki?curid=${place.pageid}`;
      }

      // 5. Enviar respuestas
      // Primero, enviar mensaje con la distancia y la información de Wikipedia
      await ctx.reply(
        `🛸 La Estación Espacial Internacional está a ${distance.toFixed(
          2
        )} km de tu ubicación.\n\n` +
          `📍 Posición actual:\n` +
          `Latitud: ${issLat}\n` +
          `Longitud: ${issLon}\n\n` +
          `📚 ${wikiInfo}`
      );
      await ctx.replyWithLocation(issLat, issLon);
    } catch (error) {
      console.error("Error:", error);
      ctx.reply("❌ Error al procesar tu solicitud");
    }
  });
};
