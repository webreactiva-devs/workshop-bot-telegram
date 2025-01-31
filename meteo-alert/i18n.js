// i18n.js

export const translations = {
  es: {
    startMessage: `Bienvenido al bot del tiempo.
    
Comandos disponibles:
- /start: Inicia el bot y muestra opciones para enviar tu ubicación.
- /weather: Obtén la previsión meteorológica para las próximas 24 horas.
- /placename <nombre>: Envía el nombre de tu ciudad para obtener la previsión.
- /settime <HH:MM>: Cambia la hora de notificación diaria.
- /cancel: Cancela las notificaciones diarias de previsión.
- /help: Muestra este mensaje de ayuda.`,
    helpMessage: `Comandos disponibles:
- /start: Inicia el bot y muestra opciones para enviar tu ubicación.
- /weather: Obtén la previsión meteorológica para las próximas 24 horas.
- /placename <nombre>: Envía el nombre de tu ciudad para obtener la previsión.
- /settime <HH:MM>: Cambia la hora de notificación diaria.
- /cancel: Cancela las notificaciones diarias de previsión.
- /help: Muestra este mensaje de ayuda.`,
    errorNoLocation:
      "No he encontrado tu ubicación. Por favor, comparte tu ubicación o utiliza el comando /placename <nombre> para enviarla.",
    errorNoWeather:
      "Lo siento, no pude obtener la previsión meteorológica en este momento.",
    errorPlacenameNoInput:
      "Debes enviar el nombre del lugar. Ejemplo: /placename Madrid",
    errorPlacenameNotFound:
      "No se encontró la ubicación para el lugar indicado.",
    placenameSuccess: "Ubicación de {place} guardada correctamente.",
    errorSavingLocation: "Error al guardar tu ubicación.",
    locationSaved: "Ubicación guardada correctamente.",
    cancelSuccess:
      "Notificaciones canceladas. Ya no recibirás el informe diario del tiempo.",
    errorCancel: "Error al cancelar las notificaciones.",
    weatherInfo: "Previsión meteorológica para las próximas 24 horas:\n\n",
    cronMessage: "Informe del tiempo:\n\n",
    retryCommand: "Intenta de nuevo usando el comando: {command}",
    alertActivated:
      "Alerta activada. Recibirás notificaciones diarias a las {time} de tu hora local. Puedes cambiar la hora usando /settime o cancelarla con /cancel.",
    chooseNotificationOption: "Elige una opción:",
    changeTime: "Cambiar hora",
    cancelAlert: "Cancelar alerta",
    promptNewTime: "Envía la nueva hora en formato HH:MM (ejemplo: 07:30).",
    timeUpdated: "La hora de notificación se ha actualizado a {time}.",
    invalidTimeFormat:
      "Formato de hora inválido. Debe ser HH:MM. Intenta de nuevo con /settime.",
  },
  // Se pueden añadir más idiomas en el futuro (por ejemplo, 'en', 'fr', etc.)
};

export function t(key, lang = "es", replacements = {}) {
  let translation = (translations[lang] && translations[lang][key]) || key;
  Object.keys(replacements).forEach((token) => {
    translation = translation.replace(`{${token}}`, replacements[token]);
  });
  return translation;
}
