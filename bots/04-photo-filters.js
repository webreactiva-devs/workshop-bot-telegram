/**
 * 🖼️ Bot de Filtros de Imagen con Telegraf y Jimp
 * -----------------------------------------------
 * 📌 Funcionalidades:
 * - 📷 Recibe fotos y almacena temporalmente la URL en sesión.
 * - 🎨 Muestra un teclado con opciones de filtros: Sepia, Blanco y negro, Invertir.
 * - 🖌️ Aplica el filtro seleccionado y envía la imagen procesada al usuario.
 * - ⏳ La foto tiene una validez de 2 minutos antes de ser descartada.
 * - 🛠️ Manejo de errores y mensajes informativos si algo falla.
 *
 * ⚙️ Notas:
 * - Usa `session()` para almacenar temporalmente la imagen por chat.
 * - Los botones de filtro funcionan con `bot.action()`, enlazados al callback.
 * - Jimp se encarga del procesamiento de imágenes en memoria.
 * - El bot descarga la imagen desde Telegram y la procesa antes de reenviarla.
 */

import { Telegraf, Markup, session } from "telegraf";
import { Jimp, JimpMime } from "jimp";

const bot = new Telegraf(process.env.BOT_TOKEN);

// Almacenamiento global en memoria (por chat ID)
bot.use(session());

// Teclado de filtros
const filterKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback("Sepia", "sepia")],
  [Markup.button.callback("Pixelar", "pixelate")],
  [Markup.button.callback("Invertir", "invert")],
]);

// Manejador de fotos
bot.on("photo", async (ctx) => {
  try {
    const photo = ctx.message.photo.pop();
    const file = await ctx.telegram.getFile(photo.file_id);
    const photoUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

    // Inicializar sesión si no existe
    if (!ctx.session) ctx.session = {};

    // Guardar en sesión
    ctx.session.photoUrl = photoUrl;
    ctx.session.timestamp = Date.now();

    await ctx.reply("Selecciona filtro:", filterKeyboard);
  } catch (error) {
    console.error("Error:", error);
    ctx.reply("Error al procesar la foto ❌");
  }
});

// Manejador de filtros
bot.action(["sepia", "pixelate", "invert"], async (ctx) => {
  try {
    await ctx.answerCbQuery();

    // Verificar existencia de sesión
    if (!ctx.session) ctx.session = {};

    // Verificar foto y tiempo (2 minutos de validez)
    if (
      !ctx.session.photoUrl ||
      !ctx.session.timestamp ||
      Date.now() - ctx.session.timestamp > 120000
    ) {
      return ctx.reply("⚠️ Envía una nueva foto primero");
    }

    // Procesar imagen desde URL almacenada
    const image = await Jimp.read(ctx.session.photoUrl);

    // Aplicar filtro
    switch (ctx.match[0]) {
      case "sepia":
        image.sepia();
        break;
      case "pixelate":
        image.pixelate(40);
        break;
      case "invert":
        image.invert();
        break;
    }

    // Convertir y enviar
    const buffer = await image.getBuffer(JimpMime.jpeg);
    await ctx.replyWithPhoto({ source: buffer });

    // Limpiar datos de sesión
    delete ctx.session.photoUrl;
    delete ctx.session.timestamp;
  } catch (error) {
    console.error("Error:", error);
    ctx.reply("Error aplicando filtro ❌");
  }
});

// Iniciar bot
bot.launch().then(() => console.log("Bot iniciado 🚀"));

// Manejo de cierre
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
