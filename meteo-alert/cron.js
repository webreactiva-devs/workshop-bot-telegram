// cron.js

import cron from "node-cron";
import {
  getAllUserIds,
  getUserLocation,
  getWeatherForecast,
  formatForecastMessage,
} from "./helpers.js";

export function initCron(bot, kvdbUrl) {
  // Se ejecuta cada minuto
  cron.schedule("* * * * *", async () => {
    console.log("Ejecutando tarea programada para notificaciones de tiempo");
    const userIds = await getAllUserIds(kvdbUrl);
    for (const userId of userIds) {
      const userData = await getUserLocation(userId, kvdbUrl);
      // console.dir(userData);
      if (!userData) continue;
      // Solo si las notificaciones están activas, y se tiene la hora y zona horaria definidas
      if (
        userData.notifications === false ||
        !userData.notificationTime ||
        !userData.timezone
      )
        continue;
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
          timeZone: userData.timezone,
        });
        const currentUserTime = formatter.format(now); // Ejemplo: "08:30"
        console.log(currentUserTime, userData.notificationTime);
        if (currentUserTime === userData.notificationTime) {
          const forecast = await getWeatherForecast(
            userData.latitude,
            userData.longitude
          );
          if (!forecast) continue;
          const message = `Informe del tiempo:\n\n${formatForecastMessage(
            forecast
          )}`;
          try {
            await bot.telegram.sendMessage(userId, message);
          } catch (error) {
            console.error(
              `Error enviando mensaje al usuario ${userId}:`,
              error
            );
          }
        }
      } catch (error) {
        console.error(
          `Error procesando notificaciones para el usuario ${userId}:`,
          error
        );
      }
    }
  });
}
