import { createBotInstance } from "../bot/index.js";

const bot = createBotInstance();

// Configura el webhook automáticamente al desplegar
const setupWebhook = async () => {
  if (process.env.VERCEL_ENV === "production") {
    const webhookUrl = `${process.env.WEBHOOK_URL}/api/telegram`;
    await bot.telegram.setWebhook(webhookUrl);
    console.log(`✅ Webhook configurado en: ${webhookUrl}`);
  }
};

setupWebhook();

export default bot.webhookCallback("/api/telegram");
