import { createBotInstance } from "./bot/index.js";

const bot = createBotInstance();

await bot.launch();
console.log("Bot en modo polling (local)");

// Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));