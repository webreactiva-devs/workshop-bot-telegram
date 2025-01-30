/**
 * 🤖 Bot de Multimedia y Ubicación con Telegraf
 * ---------------------------------------------
 * 📌 Funcionalidades:
 * - 📹 Comando `/dani`: Envía un video almacenado localmente.
 * - 🖼️ Comando `/photo`: Envía una foto aleatoria desde la web.
 * - 📸 Comando `/album`: Envía un grupo de fotos aleatorias.
 * - ☕ Comando `/coffee`: Obtiene y envía una imagen aleatoria de café.
 * - 🎭 Comando `/wow`: Envía un GIF animado de Tenor.
 * - 📍 Comando `/whereami`: Solicita la ubicación del usuario.
 * - 🗺️ Procesa ubicaciones y devuelve la dirección con geocodificación inversa.
 *
 * ⚙️ Notas:
 * - Utiliza `fetch()` para obtener imágenes desde APIs externas.
 * - Usa `reverseGeocode(lat, lon)` con OpenStreetMap para obtener direcciones.
 * - Integra `Markup.keyboard()` para solicitar ubicación de manera interactiva.
 * - Muestra logs en consola con detalles de los mensajes recibidos.
 */

import { Input, Markup, Telegraf } from "telegraf";
import path from "path";

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
  const chatId = ctx.chat?.id || "Desconocido";
  const updateId = ctx.update.update_id;
  console.log(
    `[INCOMING] Chat ID: ${chatId}, Update ID: ${updateId}, Message:`
  );
  console.dir(ctx.message, { depth: null });

  await next();
});

bot.start((ctx) => ctx.reply("Hola! Chat de prueba, me recibes?"));

// Variables de rutas y URLs
const VIDEO_PATH = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "assets/dani.mp4"
);

const RANDOM_PHOTO_URL = "https://picsum.photos/200/300/?random";
const RANDOM_ALBUM_PHOTO_URL = "https://picsum.photos/300/300/?random";
const RANDOM_COFFEE_API = "https://coffee.alexflipnote.dev/random.json";
const COUB_VIDEO_URL = "http://coub.com/view/9cjmt";
const TENOR_GIF_URL = "https://c.tenor.com/swYDigA0_sAAAAAd/tenor.gif";

function reverseGeocode(lat, lon) {
  const url = `http://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.dir(data);
      return data.display_name;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}

bot.command("wow", (ctx) => {
  ctx.replyWithAnimation(TENOR_GIF_URL);
});

bot.command("coffee", async (ctx) => {
  try {
    const response = await fetch(RANDOM_COFFEE_API);
    const data = await response.json();
    ctx.replyWithPhoto(data.file);
  } catch (error) {
    console.error("Error:", error);
    ctx.reply("Lo siento, no pude obtener una foto de café.");
  }
});

bot.command("dani", (ctx) => {
  ctx.replyWithVideo(Input.fromLocalFile(VIDEO_PATH));
});

bot.command("whereami", (ctx) => {
  ctx.reply(
    "Por favor, comparte tu ubicación:",
    Markup.keyboard([Markup.button.locationRequest("Enviar ubicación")])
      .oneTime()
      .resize()
  );
});

bot.on("location", (ctx) => {
  const { latitude, longitude } = ctx.message.location;
  reverseGeocode(latitude, longitude)
    .then((location) => {
      ctx.reply(`Estás en: ${location}`);
    })
    .catch((error) => {
      console.error("Error:", error);
      ctx.reply("Lo siento, no pude determinar tu ubicación.");
    });
});

bot.command("album", async (ctx) => {
  const photos = Array.from({ length: 5 }, () => RANDOM_ALBUM_PHOTO_URL);
  const mediaGroup = photos.map((url) => ({
    type: "photo",
    media: { url },
  }));

  ctx.replyWithMediaGroup(mediaGroup);
});

bot.command("help", (ctx) => {
  const helpMessage = `
Comandos disponibles:
/start - Iniciar el bot
/wow - Enviar un GIF de sorpresa
/coffee - Obtener una foto de café
/dani - Enviar un video
/whereami - Compartir tu ubicación
/album - Obtener un álbum de fotos aleatorias
/help - Mostrar esta ayuda
  `;
  ctx.reply(helpMessage);
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
