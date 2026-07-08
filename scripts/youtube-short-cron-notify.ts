import { config } from "dotenv";
import { resolve } from "path";
import { notifyYoutubeShortCronShell } from "../lib/news/youtube-short/notify-owner";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const message = process.argv.slice(2).join(" ").trim() || "Неизвестная ошибка cron";
void notifyYoutubeShortCronShell(message).then(() => process.exit(0));
