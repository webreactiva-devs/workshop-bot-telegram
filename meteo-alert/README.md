# Telegram Weather Bot

> Bot que te da el parte metereológico por tu ubicación.
> 🧡 Por y para la Comunidad Malandriner de webreactiva.com

## Descripción

El **Telegram Meteo Bot** es un bot desarrollado en Node.js (v20.10) utilizando Telegraf que permite a los usuarios obtener la previsión meteorológica para las próximas 24 horas. Entre sus funcionalidades se incluyen:

- **Obtener la previsión meteorológica:** Basada en la localización del usuario.
- **Gestión de localización:** El usuario puede compartir su ubicación mediante un teclado o enviar el nombre de su ciudad usando el comando `/placename`.
- **Notificaciones diarias:** Se envía un informe del tiempo a una hora configurada por el usuario (basada en su zona horaria).
- **Personalización de alertas:** El usuario puede cambiar la hora de notificación con `/settime HH:MM` o cancelar las notificaciones con `/cancel`.
- **Multidioma preparado:** Aunque actualmente funciona en español, la arquitectura está preparada para soportar otros idiomas.
- **Modos de arranque flexibles:** El bot puede ejecutarse en modo *polling* o mediante *webhook* (configurable a través de la variable de entorno `WEBHOOK_URL`).

## Instalación

### Requisitos

- **Node.js v20.10** o superior (incluye la función global `fetch`).
- Una cuenta y un bot de Telegram (obtenido a través de [BotFather](https://core.telegram.org/bots#6-botfather)).
- Un bucket en [kvdb.io](https://kvdb.io) para almacenar la información de los usuarios.
- Variables de entorno definidas:
  - `TELEGRAM_BOT_TOKEN`
  - `KVDB_URL`
  - Opcionalmente, `WEBHOOK_URL` y `PORT` (para el modo webhook).

### Pasos

1. **Clonar el repositorio:**

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_PROYECTO>
   ```

2. **Instalar las dependencias:**

   ```bash
   npm install telegraf node-cron tz-lookup
   ```

   *Nota:* No se requiere instalar `node-fetch` ni `dotenv` ya que se usa la función global `fetch` de Node.js v20.10 y se asumen las variables de entorno ya definidas.

## Ejecución

El bot se puede iniciar de dos formas:

- **Modo Polling (por defecto):**

  ```bash
  node --env-file=.env --watch index.js
  ```

- **Modo Webhook:**

  Define la variable de entorno `WEBHOOK_URL` (y opcionalmente `PORT`) y ejecuta:

  ```bash
  node --env-file=.env index.js
  ```

El bot utilizará el modo configurado según la presencia o ausencia de la variable `WEBHOOK_URL`.

## Uso

El bot responde a los siguientes comandos:

- **`/start`**  
  Inicia el bot, muestra la bienvenida y solicita la ubicación del usuario mediante un teclado.

- **`/help`**  
  Muestra los comandos y funcionalidades disponibles.

- **`/placename <nombre>`**  
  Permite enviar el nombre de una ciudad (en caso de no querer compartir la ubicación) para obtener las coordenadas y activar las notificaciones.

- **`/weather`**  
  Envía la previsión meteorológica para las próximas 24 horas.

- **`/settime <HH:MM>`**  
  Permite cambiar la hora de notificación diaria, respetando la zona horaria del usuario.

- **`/cancel`**  
  Cancela las notificaciones diarias.

Además, al enviar la ubicación o usar el comando `/placename`, el bot activa automáticamente las notificaciones y muestra un teclado con opciones para **Cambiar hora** o **Cancelar alerta**.

## Dependencias Externas

- **[Telegraf](https://telegraf.js.org/):** Framework para desarrollar bots de Telegram.
- **[node-cron](https://www.npmjs.com/package/node-cron):** Permite programar tareas (cron) en Node.js.
- **[tz-lookup](https://www.npmjs.com/package/tz-lookup):** Determina la zona horaria (IANA) a partir de coordenadas geográficas.
- **[open-meteo API](https://open-meteo.com/):** Servicio gratuito de previsión meteorológica.
- **[kvdb.io](https://kvdb.io/):** API key-value store para almacenar la configuración y localización de los usuarios.

## Arquitectura del Proyecto

[![](https://mermaid.ink/img/pako:eNpVUd1ugjAYfZXmu9IEiKAgcLFEhf0lS5bM3Qy8qLRKJ7SkFKNTn2qPsBdbBbe5XrXn9Jzz_RwgE4RCCGuJqxzNo5QjfSbJa91gycQCmebNMeZbhlEmSsyJqNEeNUuW4Yx9ffIjmvbmtKBaX6KpUP3OYHrWoVnCOKE7671edPCshaNeTouKyloT_Wsi7mVS8D80atHbZLMlS0sXc43eJaKi3CypogJNnh_-kfeJ-jALITZNdcHjtpGZtkePYokyTDAqGW-U0B2AASWVJWZET-JwFqSgclrSFEJ9JXSFm0KlkPKT_oq16GXPMwiVbKgBTUWwohHD5xlAuMJFrdEKcwgPsIPQHrmW6w2G3th3naHneb4BewhN2x5YYydwfXc8dJzRyPdOBnwIoT0GVhC4nmZGjucGgW37PzExYUrI3xTaPp-6HbarbJPfWpeuPCmadX4RnL4BUSWXFA?type=png)](https://mermaid.live/edit#pako:eNpVUd1ugjAYfZXmu9IEiKAgcLFEhf0lS5bM3Qy8qLRKJ7SkFKNTn2qPsBdbBbe5XrXn9Jzz_RwgE4RCCGuJqxzNo5QjfSbJa91gycQCmebNMeZbhlEmSsyJqNEeNUuW4Yx9ffIjmvbmtKBaX6KpUP3OYHrWoVnCOKE7671edPCshaNeTouKyloT_Wsi7mVS8D80atHbZLMlS0sXc43eJaKi3CypogJNnh_-kfeJ-jALITZNdcHjtpGZtkePYokyTDAqGW-U0B2AASWVJWZET-JwFqSgclrSFEJ9JXSFm0KlkPKT_oq16GXPMwiVbKgBTUWwohHD5xlAuMJFrdEKcwgPsIPQHrmW6w2G3th3naHneb4BewhN2x5YYydwfXc8dJzRyPdOBnwIoT0GVhC4nmZGjucGgW37PzExYUrI3xTaPp-6HbarbJPfWpeuPCmadX4RnL4BUSWXFA)

## Estructura de Archivos

- **index.js:**  
  Punto de entrada del bot. Configura comandos, teclados, y modos de arranque (polling/webhook).

- **helpers.js:**  
  Funciones auxiliares para interactuar con APIs externas (kvdb.io, open-meteo, tz-lookup) y formatear datos.

- **cron.js:**  
  Tarea programada que envía notificaciones diarias según la configuración de cada usuario.

- **i18n.js:**  
  Gestión de traducciones y textos para soportar múltiples idiomas (actualmente implementado en español).
 
> 🧡 Por y para la Comunidad Malandriner de webreactiva.com
