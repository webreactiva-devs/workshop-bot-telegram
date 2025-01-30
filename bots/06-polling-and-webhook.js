/**
 * 🤖 Bot de Echo con Telegraf (Polling & Webhook)
 * -----------------------------------------------
 * 📌 Funcionalidades:
 * - 🗣️ Responde con el mismo mensaje que envía el usuario (modo echo).
 * - 🔄 Detecta si está corriendo en modo `polling` o `webhook` y lo informa al usuario.
 * - 🚀 Soporta ejecución en ambos modos según la configuración de entorno.
 *
 * ⚙️ Notas:
 * - Si `WEBHOOK_URL` está definido, el bot usará `webhook`, escuchando en el puerto configurado.
 * - Si `WEBHOOK_URL` no está definido, usará `polling`, consultando a Telegram periódicamente.
 * - `startBot()` determina automáticamente el modo de ejecución según las variables de entorno.
 */

import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

// Manejador simple de echo
bot.on("text", (ctx) => {
  ctx.reply(ctx.message.text);
  if (process.env.WEBHOOK_URL) {
    ctx.replyWithHTML("Estás usando <b>webhook</b>");
  } else {
    ctx.replyWithHTML("Estás usando <b>polling</b>");
  }
});

// Función para elegir el modo de ejecución
async function startBot() {
  if (process.env.WEBHOOK_URL) {
    // Modo webhook
    const webhookUrl = `${process.env.WEBHOOK_URL}/webhook`;

    await bot.launch({
      webhook: {
        domain: process.env.WEBHOOK_URL,
        port: process.env.PORT || 3000,
      },
    });
    //await bot.telegram.setWebhook(webhookUrl);
    console.log(`🤖 Bot en webhook: ${webhookUrl}`);
  } else {
    // Modo polling
    await bot.launch();
    console.log("🤖 Bot en modo polling");
  }
}

// Manejo de cierre
async function gracefulShutdown() {
  if (process.env.WEBHOOK_URL) {
    await bot.telegram.deleteWebhook();
    console.log("🛑 Webhook eliminado");
  }
  bot.stop();
  process.exit(0);
}

process.once("SIGINT", gracefulShutdown);
process.once("SIGTERM", gracefulShutdown);

// Iniciar bot
startBot().catch((err) => {
  console.error("Error al iniciar el bot:", err);
  process.exit(1);
});
