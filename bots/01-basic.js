/**
 * 🤖 Bot de Telegram con Node.js y Telegraf
 * -----------------------------------------
 * 🚀 Pasos básicos:
 * 1️⃣ Crea un bot en Telegram con @BotFather y obtén tu TOKEN.
 * 2️⃣ Instala las dependencias: `npm install telegraf`
 * 3️⃣ Crea un archivo `.env` y agrega `BOT_TOKEN=tu_token_aquí`
 * 4️⃣ Ejecuta el bot con `node index.js`
 *
 * 📌 Funcionalidades:
 * - Responde a /start y /help con mensajes de bienvenida y ayuda.
 * - Responde "Hola" cuando el usuario escribe "Hola".
 * - Repite cualquier otro mensaje que el usuario envíe.
 *
 * 🔧 Manejamos cierre seguro con SIGINT y SIGTERM.
 */

import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

// Comando /start
bot.start((ctx) =>
  ctx.reply("¡Hola! Soy tu bot de Telegram 🤖. ¿En qué puedo ayudarte?")
);

// Comando /help
bot.help((ctx) =>
  ctx.reply("Usa /start para iniciar y /help para ver esta ayuda.")
);

// Responder a "Hola"
bot.hears("Hola", (ctx) => ctx.reply("¡Hola! ¿Cómo estás?"));

// Manejar cualquier otro mensaje
bot.on("text", (ctx) => {
  ctx.reply(`Has dicho: ${ctx.message.text}`);
});

// Iniciar el bot
bot.launch();

// Manejar cierre seguro (CTRL+C)
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
