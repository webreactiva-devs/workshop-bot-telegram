# Bots de Telegram

Este repositorio contiene varios bots de Telegram creados con Node.js y Telegraf. A continuación se presenta una lista de los bots disponibles y una breve descripción de sus funcionalidades.

## Bots

1. **01-basic.js**
   - **Descripción:** Bot básico que responde a los comandos `/start` y `/help`, saluda cuando el usuario escribe "Hola" y repite cualquier otro mensaje enviado por el usuario.

2. **02-messages.js**
   - **Descripción:** EcoBot que responde a los comandos `/start`, `/help` y `/echo mensaje`. También responde "¡Hola Malandriner 🧡!" si alguien dice "Hola" y registra cada mensaje recibido en la consola.

3. **03-crazy.js**
   - **Descripción:** Bot multimedia que responde a varios comandos para enviar videos, fotos, GIFs y solicitar la ubicación del usuario. También procesa ubicaciones y devuelve la dirección con geocodificación inversa.

4. **04-photo-filters.js**
   - **Descripción:** Bot de filtros de imagen que recibe fotos, muestra un teclado con opciones de filtros (Sepia, Pixelar, Invertir), aplica el filtro seleccionado y envía la imagen procesada al usuario.

5. **05-transcribe.js**
   - **Descripción:** Bot de transcripción de audio que recibe notas de voz y archivos de audio, los descarga, transcribe el audio a texto usando Groq y envía la transcripción al usuario.

6. **06-polling-and-webhook.js**
   - **Descripción:** Bot de echo que responde con el mismo mensaje que envía el usuario. Detecta si está corriendo en modo `polling` o `webhook` y lo informa al usuario. Soporta ejecución en ambos modos según la configuración de entorno.
