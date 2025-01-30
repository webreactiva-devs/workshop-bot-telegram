/**
 * 🤖 EcoBot de Telegram con Node.js y Telegraf
 * -------------------------------------------
 * 📌 Funcionalidades:
 * - 🚀 Comando `/start`: Da la bienvenida y envía una animación divertida.
 * - ℹ️ Comando `/help`: Muestra información sobre los comandos disponibles.
 * - 🗣️ Comando `/echo mensaje`: Repite el mensaje enviado por el usuario.
 * - 👋 Responde "¡Hola Malandriner 🧡!" si alguien dice "Hola".
 * - 🔒 Opción para restringir el uso solo a un chat específico (comentado por defecto).
 * - 🔎 Registra cada mensaje recibido en la consola.
 * - 🚧 Prevención para que el bot solo sea usado en chats privados (desactivado por ahora).
 *
 * ⚙️ Notas:
 * - Si se activa la restricción `ALLOWED_CHAT_ID`, solo un chat podrá usar el bot.
 * - Si se habilita la verificación de grupos, evitará funcionar en grupos y supergrupos.
 *
 * 🛠️ Mantenimiento:
 * - Para agregar más comandos, usa `bot.command('nombre', callback)`.
 * - Para escuchar frases específicas, usa `bot.hears('texto', callback)`.
 */

import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

const ALLOWED_CHAT_ID = null;

bot.use(async (ctx, next) => {
  const chatId = ctx.chat?.id || "Desconocido";

  // // Restringir el uso del bot a un chat (Usuario) específico
  // if (ALLOWED_CHAT_ID && chatId !== ALLOWED_CHAT_ID) {
  //   console.log(`[BLOCKED] Chat ID: ${chatId} no está autorizado.`);
  //   return ctx.reply("No estás autorizado para usar este bot.");
  // }

  // // Prevenimos que el bot solo sea usado en privado
  // const isGroup =
  //   ctx.message?.chat.type === "group" ||
  //   ctx.message?.chat.type === "supergroup";

  // if (isGroup) {
  //   await ctx.reply("Este bot solo puede usarse de forma privada.");
  //   return;
  // }

  const updateId = ctx.update.update_id;
  console.log(
    `[INCOMING] Chat ID: ${chatId}, Update ID: ${updateId}, Message:`
  );

  console.dir(ctx.message, { depth: null });

  await next();
});

// Comando /start
bot.start((ctx) => {
  ctx.reply("¡Hola! Soy el EcoBot de Telegram 🤖. Papagallo for you!");
  ctx.replyWithAnimation("https://c.tenor.com/AuNEcFDvGaYAAAAd/tenor.gif");
});

// Comando /help
bot.help((ctx) =>
  ctx.reply("Usa /start para iniciar y /echo para hacer eco eco.")
);

// Responder a "Hola"
bot.hears("Hola", (ctx) => ctx.reply("¡Hola Malandriner 🧡!"));

// Manejar cualquier otro mensaje
bot.command("echo", (ctx) => {
  const chatId = ctx.chat.id;
  const message = ctx.message.text.split(" ").slice(1).join(" ");

  if (message) {
    const username = ctx.message.from.username || "Desconocido";
    const response = `*${username}* has dicho: _${message}_`;
    console.log(`[OUTGOING] Chat ID: ${chatId}, Respuesta: "${response}"`);
    ctx.replyWithMarkdownV2(response);
  } else {
    const response = "Por favor, escribe algo después de /echo";
    console.log(`[OUTGOING] Chat ID: ${chatId}, Respuesta: "${response}"`);
    ctx.reply(response);
  }
});

// Iniciar el bot
bot.launch();

// Manejar cierre seguro (CTRL+C)
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
