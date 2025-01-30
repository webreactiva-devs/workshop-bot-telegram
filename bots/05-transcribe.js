/**
 * 🎤 Bot de Transcripción de Audio con Telegraf y Groq
 * ----------------------------------------------------
 * 📌 Funcionalidades:
 * - 🔊 Recibe notas de voz y archivos de audio en Telegram.
 * - 🌐 Descarga el audio desde los servidores de Telegram.
 * - 📝 Usa Groq (modelo Whisper) para transcribir el audio a texto.
 * - 📩 Envía la transcripción al usuario como respuesta.
 * - 🚨 Manejo de errores globales y mensajes informativos en caso de fallos.
 *
 * ⚙️ Notas:
 * - Se usa `fetch()` para descargar el audio desde Telegram.
 * - El audio se convierte en un `Blob` y luego en un `File` antes de enviarlo a Groq.
 * - `whisper-large-v3-turbo` es el modelo utilizado para la transcripción.
 * - Mira https://premium.danielprimo.io/desafios/directos/integrando-ia-en-proyectos-web-taller-con-groq
 */

import { Telegraf } from "telegraf";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on(["audio", "voice"], async (ctx) => {
  try {
    // Obtener file ID según el tipo de mensaje
    const fileId = ctx.message.audio
      ? ctx.message.audio.file_id
      : ctx.message.voice.file_id;

    // Obtener URL del archivo
    const fileLink = await ctx.telegram.getFileLink(fileId);

    // Descargar el audio
    const response = await fetch(fileLink);
    const data = await response.arrayBuffer();

    // Crear un Blob a partir de los datos
    const audioBlob = new Blob([data]);

    // Crear un File a partir del Blob
    const audioFile = new File([audioBlob], "audio.ogg", { type: "audio/ogg" });

    // Transcribir con Groq
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3-turbo",
      response_format: "json",
      language: "es",
    });

    // Enviar transcripción
    await ctx.reply(`🎤 Transcripción:\n\n${transcription.text}`);
  } catch (error) {
    console.error("Error:", error);
    await ctx.reply("❌ Error al procesar el audio. Intenta nuevamente.");
  }
});

// Comandos básicos
bot.start((ctx) => ctx.reply("Envía un audio o nota de voz para transcribir"));
bot.help((ctx) =>
  ctx.reply("Solo envía un mensaje de audio y recibirás la transcripción")
);

// Manejar errores
bot.catch((err, ctx) => {
  console.error("Error global:", err);
  ctx.reply("🚨 Ocurrió un error inesperado");
});

// Iniciar bot
bot.launch().then(() => console.log("Bot iniciado"));

// Manejar cierre limpio
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
