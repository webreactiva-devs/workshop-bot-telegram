import { Telegraf } from "telegraf";
import { setupHandlers } from "./handlers.js";

export const createBotInstance = () => {
  const bot = new Telegraf(process.env.BOT_TOKEN);

  setupHandlers(bot);

  return bot;
};