# Taller de bot de telegram

> Taller práctico con código y referencias para montar un bot de telegram solo para la comunidad de suscriptores premium 🧡 de [Web Reactiva](https://webreactiva.com)

## Qué encontrarás en este taller

- El código para crear tu propio bot
- Diferentes ejemplos de uso basados en la API del bot de telegram
- Usaremos node (v20.10 o superior) y la librería telegraf

---

## Referencias

- [API de Bot de Telegram](https://core.telegram.org/bots/api)
- [Telegraf](https://telegraf.js.org/)
- [Ejemplos con Telegraf](https://github.com/feathers-studio/telegraf-docs/tree/master/examples)
- [Pinggy (túnel para webhooks en local)](https://pinggy.io/)

---

## Ejecutar los bots básicos

> Son los que están en la carpeta bots

1. Crear el bot en @BotFather y generar el API token
2. Duplicar `.env.example` para crear `.env` 
3. Usar el API Token en `BOT_TOKEN` en el `.env` (el resto solo son necesarios en algunos bots)
4. Ejecuta `npm install` para cargar las depencias de la carpeta
5. Con node (versión 20.10 o superior) puedes levantar el bot así: `node --env-file=.env --watch NOMBRE_FICHERO.js`
6. Entra en tu bot generado en telegram y envía los mensajes

--

## Así funciona un bot de telegram

[Ver gráfico](https://mermaid.ink/img/pako:eNp9k99O2zAUxl_lyLstiLRN0mbSJPoHhAYDjW7alnBxGp8Gb44d2QmitH2kXfEIfbE5CRsZTMuVZf--cz5_J96wVHNiEcsMFrewmL1NFMBx_MlWaIS-gYODd9u5utv_RMhJWfxOW5jEx0UBnGBBkpwwv6lFky5rtRSpKCsOCBLh-OpsC9P4msyd4NqQfaWeNuqPRC96zeILAUtdwnT_yEWmG3jWwFdGp2QRSD7j8_h8_5iJFF0DCRNdNvy84S-LVGiFMoJziTlCY8sC3ZdkFNotnLQGHWVh3uxq29GfkiKD4NwXFdkSt3AauwqvrnL6j9Bq6K4iWav-F99FXdl07v88ikTVmK2W7aimWq1EVhlMxf5RwZlyvlHWCMCX2N38BMtbMu0Ep4aanOog10CqNJQhLC7fzz9s4Wu8qP6KlxRPFOuxnEyOgru_Y1NvJ8wVzClhkVtyWmEly4T1OkefnVFcSrI1s2m9JKwwIkeznmqpTSt-08cxH62exDVDPKNzXJKcYPojM7pyFlqUxukwwA7q5lKKF_UoDFa-14Geei7ccLvcqvk6nKVUK_7SXTAM_EGHkkJRF_D4wPfDhNXnu0TtXFZVwbGkORelNixaobTUY1iV-nqtUhaVpqLf0ExgPfU_VIGKRRt2z6KD_qHnDUPftR8HwWDUD3ts7bYHo_Fh6Hn-KDzqh8MjfxjueuxBa1fDOxyO-kHgeyN3Ph6HA6_nwqxdXLQPu3nfTZNvjaB14hLObp8c7H4BHY1SGg?type=png)

![image](https://github.com/user-attachments/assets/c8f8a677-ce5c-499d-a4fb-f19aa6687b5e)


---

## Primeros pasos para crear el bot de telegram

Crear un bot de Telegram con **Node.js** y **Telegraf** sigue un flujo bien definido. Aquí te lo explico paso a paso:

¿Por qué telegraf?
Porque lleva muchos años de desarrollo, porque la API de Bots de telegram es muy estable y porque no tenemos que reinventar la rueda.

### **1. Crear un bot en Telegram**
Antes de programar, necesitas obtener un **Token** de acceso.

1. Abre Telegram y busca **@BotFather**.
2. Escribe `/newbot` y sigue las instrucciones para darle un nombre y un usuario único.
3. Una vez creado, BotFather te dará un **Token**. Guárdalo porque lo necesitarás en tu código.



### **2. Configurar el proyecto en Node.js**
Primero, inicia un nuevo proyecto en Node.js y instala Telegraf:

```sh
mkdir my-telegram-bot
cd my-telegram-bot
npm init -y
npm install telegraf dotenv
```

Para manejar variables de entorno, crea un archivo `.env`:

```sh
BOT_TOKEN=tu_token_aquí
```

Y en `index.js`, carga las variables de entorno:

```js
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);
```



### **3. Definir los comandos y eventos**
El bot responde a comandos y mensajes. Puedes definir respuestas para `/start`, `/help`, o mensajes de texto específicos.

```js
// Responde al comando /start
bot.start((ctx) => ctx.reply('¡Hola! Soy tu bot de Telegram 🤖. ¿En qué puedo ayudarte?'));

// Responde al comando /help
bot.help((ctx) => ctx.reply('Usa /start para iniciar y /help para ver esta ayuda.'));

// Responde a un mensaje de texto específico
bot.hears('Hola', (ctx) => ctx.reply('¡Hola! ¿Cómo estás?'));

// Maneja cualquier otro mensaje
bot.on('text', (ctx) => {
  ctx.reply(`Has dicho: ${ctx.message.text}`);
});
```



### **4. Lanzar el bot**
Para que el bot empiece a funcionar, usa:

```js
bot.launch();
console.log('Bot en funcionamiento...');
```



### **5. Desplegar en producción**
Si quieres que el bot corra en producción sin interrupciones, puedes usar **PM2**:

```sh
npm install -g pm2
pm2 start index.js --name my-telegram-bot
```

Si prefieres Webhooks en lugar de polling, deberás configurar un servidor en **Express** o **Fastify** y usar `bot.telegram.setWebhook()`.


### **Flujo de funcionamiento**
1. **El usuario envía un mensaje** a tu bot en Telegram.
2. **Telegram envía el mensaje a tu bot** usando el token de la API.
3. **Telegraf recibe y procesa el mensaje** según las reglas definidas.
4. **El bot responde** al usuario con texto, imágenes o comandos personalizados.

[Ver gráfico](https://mermaid.ink/img/pako:eNplk8tu1DAUhl_FMptWSkfj3JtFF4XuqISgsEDZnLFPUtPEDraDOozmkVj1EebFcG6QdrzJ5Xz_f_6c2AfKtUBaUIs_e1QcP0ioDbSlIn5B77Tq2x2a6bkD4ySXHShHvtoejNTnhQds8L_FunKrHQE7Xi7uJeGnFyFrfVmqCZ0dr25uFouC3Klfpz9AWlQWfuDELVUPequCfEZ8RZHeghKaYEOcfsLZ3aOL4JPRHC0MwCK5aE4vteRAhH-50-5yLTqLY9B2PVoHZ4HmbxhCOW3UK5QGtEXTghR-3odBWlL3iC2WtPC3AivoG1fSYFX65t1g16AdmMPUrqSdkS2Y_XvdaDOJ34VwLfJqFg8Miho_wg6bW-BPtdG9EjOK1zxOYYU69P_ojR9maZWwFTT3fMBnt-aqca04i1wr8TZdGqdJtKIaqXANMBElSVbSoX4s1dHPqu8EOLwT0g-SFhU0FgM67Mgve8Vp4UyPCzRv2n-U3220ONBnWlyxhG1YkrA8DHOWR2kWBnRPCxYlmyTOsy0LE5bFOYuOAf2ttffYbnIWZ_EoytJtmrPAD3NIcT8dlfHEjE2-j4IpiZ9w_TgnOP4FVmoVpA?type=png)

![image](https://github.com/user-attachments/assets/feb82b06-66fe-4cde-9b29-47a002d14104)

---

## Diferencias entre polling y webhook

Aquí tienes un resumen de las principales diferencias entre **polling** y **webhook** a la hora de recibir mensajes en un bot de Telegram, así como sus ventajas, inconvenientes y usos recomendados.

## Diferencias generales
- **Long polling (polling)**: Tu bot solicita periódicamente a los servidores de Telegram si hay nuevos mensajes; es un ciclo continuo de “¿Hay algo nuevo?”.
- **Webhook**: Telegram envía los mensajes a una URL (endpoint) específica que tu bot expone; básicamente, Telegram “empuja” las actualizaciones al bot.

## Ventajas de polling
1. **Facilidad de configuración**: No necesitas un servidor con SSL ni una URL pública. Puedes ejecutar tu bot en local sin complicaciones.
2. **Ideal para desarrollo y testing**: Para pruebas rápidas, solo inicias tu bot y listo.
3. **Menos requisitos de infraestructura**: No hace falta configurar dominios ni certificados.

## Inconvenientes de polling
1. **Menor eficiencia**: Hay un ciclo constante de preguntar por nuevas actualizaciones. Puede no ser el método más óptimo si tu bot recibe mucho tráfico.
2. **Mayor latencia en algunos casos**: Dependiendo de la configuración, el bot puede tardar un poco más en recibir los mensajes.
3. **Consumo de recursos**: Cada request de polling mantiene conexiones abiertas, lo que puede aumentar el uso de CPU y red en cargas altas.

## Ventajas de webhook
1. **Mayor inmediatez**: En cuanto Telegram recibe un mensaje, lo envía a la URL configurada. No esperas a que el bot pregunte.
2. **Menor consumo de recursos**: No se hacen peticiones continuas; solo hay tráfico cuando realmente hay un mensaje nuevo.
3. **Escalabilidad**: En proyectos con alto volumen de mensajes, la comunicación “push” suele ser más eficiente que “pull”.

## Inconvenientes de webhook
1. **Requiere un servidor accesible**: Necesitas una URL pública y, habitualmente, un certificado SSL válido (HTTPS).
2. **Configuración más compleja**: Hay que gestionar dominios, certificados, puertos, etc.
3. **Dependencia de la disponibilidad del servidor**: Si tu servidor está caído o inaccesible, las actualizaciones no se recibirán.

## ¿Cuándo usar cada uno?
- **Usa polling**:
  - Si estás en **fase de desarrollo** o haciendo **pruebas locales**.
  - Si no necesitas respuesta inmediata en tiempo real y prefieres una configuración más sencilla.
  - Si no tienes un servidor con certificado SSL o una URL pública disponible.

- **Usa webhook**:
  - Si tienes un bot en **producción** con **alto volumen** de mensajes.
  - Quieres **respuestas instantáneas** y optimizar el uso de **recursos**.
  - Tienes la posibilidad de configurar un servidor con **SSL** y un dominio accesible.


### Polling

[Ver gráfico](https://mermaid.ink/img/pako:eNplk9uO0zAQhl_FMje7UrZKujk1F0Xag8QFKyFYEEK5mcbT1JDYwYdqS9VH4ooHQGJfDCdOu6H4Jk7mm3_-jMd7WkmGtKAav1sUFd5xqBW0pSBugTVS2HaFyr93oAyveAfCkI_aguLy_8AjNvgiMY3cSENAD4-LB06q51-M1_KyFB4dFa-Wy6NEQe7F9vknkBaFhq_ouUbKjtwCA_KZaKytYFL7SL-c-j8Kf36_gR0RFrdSH3X06xf-SF65LJdbkDvcWmy2eILJheauqCYb2F36RBTMb3y1Ie-dkhXqM6_nbsb_Uag7i9qAp04elsuxCQV5j0YqMUEJw4aspKEBbVG1wJk7tn0vUFKzwRZLWrgtwzXYxpQ0mIQ-OU1YNah7Zu-LlrRTvAW1u5WNVD751RwWLF-PyT2DrMa3sMLmBqpvtZKu2yOKiypOYYIadEd9podZuk6iCTTWfMQnM-XWw5pwGisp2Lm7NE6T6wnVcIFTIGLXSZKVtI8fSnFwvbIdA4P3jLt20mINjcaA9oP9YScqWhhl8QiNs3-i3NDSYk-faBHFszyOs0UYZ3kSRuH8OqA79znMZ0mcp3kYJ_MsctFDQH9I6STCWR7FWRwlSZRnaZjmUeB62Zt48BduuHdDjS9DgjfiGlxvRgOHv5dcKfQ?type=png)

![image](https://github.com/user-attachments/assets/23044d8c-9686-44d7-b64a-4336042ff1b3)

### Webhook

[Ver gáfico](https://mermaid.ink/img/pako:eNplk01u2zAQha9CsJsUUA3J1p-1yCJtdg0aNG4XhTYjciSzkUiVIts4ho-UVY7gi5X6cSLY3EjU--bN4IncU6Y40ox2-MeiZPhFQKWhySVxC6xR0jYF6nHfgjaCiRakIT86C1qoS2GDNb5bzJUbZQh0w-PqThB2fOWiUoQpSf5hsVXq8WMux7LJ_dP19ckuI7fy7_EFSIOyg984cifVgc72jbn_9rAZfGsgwIyFWjwDE8fXyd6xp4p7rRh2Z7ajftFaY9da7AxcNJ_mzch3NErLGUo41qRQhnq0Qd2A4C7tfW-QU7PFBnOauVeOJdja5NSbST-dJxQ1dj2zH5vmtNWiAb37rGqlx-IPS1jztJyKewZ5hV-hwPoG2GOllZV8QnHNwhhmqEH3h878MInLKJhBU88NPpk5Vw5rxnXoUufn08VhHK1mVC0kzoGAr6IoyWmvH3J5cFnZloPBWy5cnDQroe7Qo_15fNhJRjOjLZ6g6ci-Ue6s0WxPn2gWhIs0DJO1HyZp5Af-cuXRnfvsp4soTOPUD6NlEjj14NFnpZyFv0iDMAmDKArSJPbjNPBclv0Qd-M9Ga7L0OPXUDAO4gKuttMAh_84UBTV?type=png)

![image](https://github.com/user-attachments/assets/6835ce5f-c386-4e77-9c03-2cfbd9df9980)


### Comandos para levantar el webhook


```
# Publica el webhook
curl -X POST "https://api.telegram.org/bot{BOT_TOKEN}/setWebhook?url={WEBHOOK_URL}"

# Comprueba el webhook
curl -s "https://api.telegram.org/bot{BOT_TOKEN}/getWebhookInfo"

# Borra el webhook publicado
curl -X POST "https://api.telegram.org/bot{BOT_TOKEN}/deleteWebhook"

# Test para comprobar que ahí algo ahí
curl -X POST "{WEBHOOK_URL}"
```

---

🧡 Este taller sería imposible sin el apoyo de la comunidad de suscriptores de pago de [Web Reactiva](https://webreactiva.com)
