// index.js

import { Telegraf, Markup } from "telegraf";
import tzlookup from "tz-lookup";
import {
  storeUserLocation,
  getUserLocation,
  getWeatherForecast,
  formatForecastMessage,
  getCoordinates,
} from "./helpers.js";
import { initCron } from "./cron.js";
import { t } from "./i18n.js";

// Variables de entorno necesarias: TELEGRAM_BOT_TOKEN, KVDB_URL y opcionalmente WEBHOOK_URL (y PORT para webhook)
const botToken = process.env.BOT_TOKEN;
const kvdbUrl = process.env.KVDB_URL;
const webhookUrl = process.env.WEBHOOK_URL;

if (!botToken) {
  console.error(
    "No se encontró TELEGRAM_BOT_TOKEN en las variables de entorno"
  );
  process.exit(1);
}
if (!kvdbUrl) {
  console.error("No se encontró KVDB_URL en las variables de entorno");
  process.exit(1);
}

const bot = new Telegraf(botToken);
const defaultLang = "es";
const defaultNotificationTime = "08:00"; // Valor por defecto

/**
 * Función auxiliar para enviar mensajes de error con sugerencia de reintentar.
 */
function sendError(ctx, errorKey, retryCommand = null) {
  let message = t(errorKey, defaultLang);
  if (retryCommand) {
    message += `\n\n${t("retryCommand", defaultLang, {
      command: retryCommand,
    })}`;
  } else {
    message += `\n\nIntenta de nuevo.`;
  }
  return ctx.reply(message);
}

/**
 * Devuelve un teclado con las opciones para gestionar la notificación.
 */
function getNotificationKeyboard() {
  return Markup.keyboard([
    [t("changeTime", defaultLang), t("cancelAlert", defaultLang)],
  ])
    .resize()
    .oneTime();
}

// Comando /start: Bienvenida y solicitud de ubicación
bot.start(async (ctx) => {
  const keyboard = Markup.keyboard([
    [Markup.button.locationRequest("Compartir ubicación")],
  ])
    .resize()
    .oneTime();

  await ctx.reply(t("startMessage", defaultLang), keyboard);
});

// Comando /help: Muestra la ayuda
bot.command("help", async (ctx) => {
  await ctx.reply(t("helpMessage", defaultLang));
});

// Comando /weather: Envía la previsión meteorológica
bot.command("weather", async (ctx) => {
  const userId = ctx.from.id;
  const userData = await getUserLocation(userId, kvdbUrl);
  if (!userData) {
    return sendError(ctx, "errorNoLocation", "/start");
  }
  const { latitude, longitude } = userData;
  const forecast = await getWeatherForecast(latitude, longitude);
  if (!forecast) {
    return sendError(ctx, "errorNoWeather", "/weather");
  }
  const message =
    t("weatherInfo", defaultLang) + formatForecastMessage(forecast);
  return ctx.reply(message);
});

// Comando /placename: Permite enviar el nombre del lugar y obtener coordenadas
bot.command("placename", async (ctx) => {
  // Se espera: /placename NombreDeLaCiudad
  const input = ctx.message.text.split(" ").slice(1).join(" ");
  if (!input) {
    return sendError(ctx, "errorPlacenameNoInput", "/placename");
  }
  const geoData = await getCoordinates(input);
  if (!geoData) {
    return sendError(ctx, "errorPlacenameNotFound", "/placename");
  }
  // Se obtiene la zona horaria a partir de las coordenadas con tzlookup
  let timezone;
  try {
    timezone = tzlookup(geoData.latitude, geoData.longitude);
  } catch (err) {
    console.error("Error determinando timezone:", err);
    timezone = "UTC"; // Fallback a UTC en caso de error
  }
  const data = {
    latitude: geoData.latitude,
    longitude: geoData.longitude,
    timestamp: Date.now(),
    name: geoData.name,
    notifications: true,
    notificationTime: defaultNotificationTime,
    timezone: timezone,
  };
  const userId = ctx.from.id;
  const success = await storeUserLocation(userId, data, kvdbUrl);
  if (success) {
    return ctx.reply(
      t("placenameSuccess", defaultLang, { place: geoData.name }) +
        "\n\n" +
        t("alertActivated", defaultLang, { time: defaultNotificationTime }),
      getNotificationKeyboard()
    );
  } else {
    return sendError(ctx, "errorSavingLocation", "/placename");
  }
});

// Manejo del envío de ubicación a través del teclado
bot.on("location", async (ctx) => {
  const userId = ctx.from.id;
  const location = ctx.message.location;
  if (!location) return;
  // Se determina la zona horaria utilizando tzlookup
  let timezone;
  try {
    timezone = tzlookup(location.latitude, location.longitude);
  } catch (err) {
    console.error("Error determinando timezone:", err);
    timezone = "UTC";
  }
  const data = {
    latitude: location.latitude,
    longitude: location.longitude,
    timestamp: Date.now(),
    notifications: true,
    notificationTime: defaultNotificationTime,
    timezone: timezone,
  };
  const success = await storeUserLocation(userId, data, kvdbUrl);
  if (success) {
    await ctx.reply(
      t("locationSaved", defaultLang) +
        "\n\n" +
        t("alertActivated", defaultLang, { time: defaultNotificationTime }),
      getNotificationKeyboard()
    );
  } else {
    await sendError(ctx, "errorSavingLocation", "/start");
  }
});

// Comando /settime: Permite cambiar la hora de notificación
bot.command("settime", async (ctx) => {
  const parts = ctx.message.text.split(" ");
  if (parts.length < 2) {
    return ctx.reply(t("promptNewTime", defaultLang));
  }
  const newTime = parts[1].trim();
  // Validación: debe ser en formato HH:MM (00:00 a 23:59)
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(newTime)) {
    return sendError(ctx, "invalidTimeFormat", "/settime");
  }
  const userId = ctx.from.id;
  const userData = await getUserLocation(userId, kvdbUrl);
  if (!userData) {
    return sendError(ctx, "errorNoLocation", "/start");
  }
  userData.notificationTime = newTime;
  const success = await storeUserLocation(userId, userData, kvdbUrl);
  if (success) {
    return ctx.reply(
      t("timeUpdated", defaultLang, { time: newTime }),
      getNotificationKeyboard()
    );
  } else {
    return sendError(ctx, "errorSavingLocation", "/settime");
  }
});

// Opciones del teclado: “Cambiar hora” y “Cancelar alerta”
bot.hears(t("changeTime", defaultLang), async (ctx) => {
  return ctx.reply(t("promptNewTime", defaultLang));
});

bot.hears(t("cancelAlert", defaultLang), async (ctx) => {
  const userId = ctx.from.id;
  const userData = await getUserLocation(userId, kvdbUrl);
  if (!userData) {
    return sendError(ctx, "errorNoLocation", "/start");
  }
  userData.notifications = false;
  const success = await storeUserLocation(userId, userData, kvdbUrl);
  if (success) {
    return ctx.reply(t("cancelSuccess", defaultLang));
  } else {
    return sendError(ctx, "errorCancel", "/cancel");
  }
});

// Comando /cancel: Cancela las notificaciones diarias
bot.command("cancel", async (ctx) => {
  const userId = ctx.from.id;
  const userData = await getUserLocation(userId, kvdbUrl);
  if (!userData) {
    return sendError(ctx, "errorNoLocation", "/start");
  }
  userData.notifications = false;
  const success = await storeUserLocation(userId, userData, kvdbUrl);
  if (success) {
    return ctx.reply(t("cancelSuccess", defaultLang));
  } else {
    return sendError(ctx, "errorCancel", "/cancel");
  }
});

// Arranque del bot: modo webhook o polling
(async () => {
  if (webhookUrl) {
    const port = process.env.PORT || 3000;
    await bot.launch({
      webhook: {
        domain: webhookUrl,
        port: port,
      },
    });
    console.log(`Bot iniciado con webhook en ${webhookUrl} (Puerto: ${port})`);
  } else {
    await bot.launch();
    console.log("Bot iniciado con polling");
  }
})();
// Iniciar la tarea cron para notificaciones
initCron(bot, kvdbUrl);

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
