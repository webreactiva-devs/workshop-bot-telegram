# ISS Location Bot

> Taller práctico con código y referencias para montar un bot de telegram solo para la comunidad de suscriptores premium 🧡 de [Web Reactiva](https://webreactiva.com)

Este bot de Telegram te ayuda a encontrar la ubicación de la Estación Espacial Internacional (ISS) y te proporciona información sobre lugares cercanos a la ISS utilizando la API de Wikipedia.

## Arquitectura

El bot está diseñado para funcionar tanto en modo polling como en modo webhook:

- **Polling**: El bot consulta continuamente las actualizaciones de Telegram.
- **Webhook**: Telegram envía actualizaciones al bot a través de una URL configurada.

## Lanzar en local con Polling

Para ejecutar el bot en modo polling localmente:

1. Clona el repositorio y navega al directorio del proyecto.
2. Crea un archivo `.env` basado en `.env.example` y agrega tu `BOT_TOKEN`.
3. Instala las dependencias:
    ```bash
    npm install
    ```
4. Ejecuta el bot en modo polling:
    ```bash
    npm run dev:watch
    ```

## Lanzar en local con Pinggy y Webhook

Para ejecutar el bot en modo webhook localmente usando Pinggy:

1. Clona el repositorio y navega al directorio del proyecto.
2. Crea un archivo `.env` basado en `.env.example` y agrega tu `BOT_TOKEN`.
3. Instala las dependencias:
    ```bash
    npm install
    ```
4. Inicia un túnel con Pinggy:
    ```bash
    ssh -p 443 -R0:localhost:3000 -L4300:localhost:4300 qr@a.pinggy.io
    ```
5. Copia la URL proporcionada por Pinggy y configúrala en el archivo `.env` como `WEBHOOK_URL`.
6. Ejecuta el bot en modo webhook:
    ```bash
    npm start
    ```

## Desplegar en la nube con Vercel CLI

Para desplegar el bot en Vercel:

1. Abre tu cuenta en vercel.com si no la tienes
2. Instala Vercel CLI si no lo tienes:
    ```bash
    npm install -g vercel
    ```
3. Inicia sesión en Vercel:
    ```bash
    vercel login
    ```
4. Despliega el proyecto:
    ```*bash*
    vercel
5. Despliega el proyecto en producción:
    ```bash
    vercel --prod
    ```

## Configuración en Vercel (Preview y Production)

Para configurar el bot en Vercel:

1. Ve a tu proyecto en el dashboard de Vercel.
2. En la sección de "Environment Variables", agrega las siguientes variables:
    - `BOT_TOKEN`: Tu token del bot de Telegram.
    - `WEBHOOK_URL`: La URL de tu despliegue en Vercel (por ejemplo, `https://tu-proyecto.vercel.app`).

En el entorno de producción, el bot configurará automáticamente el webhook utilizando la URL proporcionada.

## Publicar y gestionar el Webhook en Telegram

Puedes gestionar el webhook de tu bot en Telegram utilizando los siguientes comandos:

Nota: El método `bot.launch()` configura automáticamente el webhook para ti cuando se despliega en producción.

### Publicar el webhook

```bash
curl -X POST "https://api.telegram.org/bot{BOT_TOKEN}/setWebhook?url={WEBHOOK_URL}"
```

### Comprobar el webhook

```bash
curl -s "https://api.telegram.org/bot{BOT_TOKEN}/getWebhookInfo"
```

### Borrar el webhook publicado

```bash
curl -X POST "https://api.telegram.org/bot{BOT_TOKEN}/deleteWebhook"
```


### Desplegar con Docker (no comprobado)

```bash
# Construir la imagen
docker build -t iss-bot .

# Ejecutar el contenedor (usando el archivo .env)
docker run -p 3000:3000 --env-file .env iss-bot

# O usando docker-compose
docker-compose up --build
```

### Despliegue en Coolify

Asegúrate de que el repositorio contenga el `Dockerfile`, `docker-compose.yml` y el archivo `.env`.

**Configura Coolify:**

- Selecciona "Dockerfile" como método de construcción.
- Asegúrate de que el contexto de construcción sea la raíz del repositorio.

**Variables de entorno en Coolify:**

Coolify permite inyectar variables de entorno directamente en su panel, pero si prefieres usar el archivo .env, asegúrate configúralo manualmente en Coolify. NO lo subas nunca a tu repositorio.

¡Y eso es todo! Ahora tienes tu bot de Telegram funcionando tanto en local como en la nube.

---

🧡 Este taller sería imposible sin el apoyo de la comunidad de suscriptores de pago de [Web Reactiva](https://webreactiva.com)