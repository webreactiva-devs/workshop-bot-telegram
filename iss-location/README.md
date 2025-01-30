# ISS Location Bot

> Taller práctico con código y referencias para montar un bot de telegram solo para la comunidad de suscriptores premium 🧡 de [Web Reactiva](https://webreactiva.com)

Este bot de Telegram te ayuda a encontrar la ubicación de la Estación Espacial Internacional (ISS) y te proporciona información sobre lugares cercanos a la ISS utilizando la API de Wikipedia.

## Arquitectura

El bot está diseñado para funcionar tanto en modo polling como en modo webhook:

- **Polling**: El bot consulta continuamente las actualizaciones de Telegram.
- **Webhook**: Telegram envía actualizaciones al bot a través de una URL configurada.

[Ver gráfico](https://mermaid.ink/img/pako:eNqFVn9v2zYQ_SoEgwItoASWbFm2MBRYkhbL0HRdna3A5v1BSyebi0yqJNXWS_PddxQpm7LblIAN3fHe4_14ov1AC1kCzelasWZD7i6XguB69oy8-mJACVaTPzQo7dz28fnzO6gBw7ed-eKF2-qdP7-7CSLQsgF70lvGBVnstIEtuZLCoAnK7ep25XJY0pvFgryRBTNcCnIpjUcsqYu06wOsNlLeI__fS-oNe9pPK_XyLVZ08a9e0n8O8chyI7RhogAEWM7etAifb3WMOjwF2Vnwldw2UoAwOkzKLtzZMlH-gp8aFJ7lHcR7njrOrr7uA8G-EwHDr-wTWxSKN-aEwDfjlgm27vB9d7znB_Br7tpyxeqirZmRlqJ3koP3CRoQpTO6h1NBuWnqk7EfAkB94gUMenujtRu2FYcf9G8NCPJWGl7tBgl84Pe8gZIzL4_e7HG31rDePWqY6Xuou47rDW8C5ZPz85dfl3SBwZoUbqyY49dQ-ycvgwe9luozU4jbgtY4hg53ELGDHWyPei9bA5oo-NiCNh0mELIDue_A7bHvlMQWahimOpTn97BuW5PaS88ij4T5PahTmSafXS1BmV5_YdZHnJ6iFxmylF54luZUmU-RvAZTbJDByqWRmvdlOB09hfy9BcURKYCp1Y40NSv8uAJZhVUMezpQiQKN94SGb8vk2-f_CLmX6cLsai7Wzi5qpvU1VDhtf62Sitd1fgZxlVYQaaPkPeRnozjN5qsTjL_OesysSmG-xySQlePkCAP92-ogVQETKPaQ2WwEkyrsUgcMJB6F2imGvwUudtjX6Khb0VBW0ak8DmWFrE4AUTjMKHxf-7qWgkZ0C2rLeIm_jw-WY0nNBraoxhwfS6hYW-PVFwVbfzLF2aq2Y8vJg6-fNopvmdpdyRpF24HPEjYvZ5UH2xgo1_CGraC-ZMX9WskWryQXCvNiMmVBKCZo-BEfZNMqjYMgf-Yd1hPGVd0K4jRg88vj7KaTaToOolBoEAbE5ThNM3dBPy7FI_aqbUp8Z1-VHFtP84rVGiLKWiMXO1HQ3KgW-qBrzmy791ENEzR_oF9ofh5Pk4s4nmTpZDSOk2Q-TiK6Q_9kNLrI4ngaZ1mSZrNkNnmM6H9SIkl8MZkl02kaz-I4nc-zcRxhN20at-6_TfcXpzvlrw7gUsEWrzc-hcf_AUY18EI?type=png)



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