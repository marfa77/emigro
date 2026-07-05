#!/usr/bin/env npx tsx
/**
 * One-time OAuth setup for @Emigro_news YouTube uploads.
 *
 * 1. Enable YouTube Data API v3 in Google Cloud Console.
 * 2. Create OAuth client (Desktop or Web) with redirect http://localhost:8765/callback
 * 3. Set EMIGRO_YOUTUBE_CLIENT_ID and EMIGRO_YOUTUBE_CLIENT_SECRET in .env.local
 * 4. Run: npm run youtube:oauth-setup
 * 5. Sign in as the channel owner and paste refresh token into .env / VPS .env
 */
import { config } from "dotenv";
import http from "http";
import { exec } from "child_process";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const REDIRECT_PORT = 8765;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}/callback`;
const SCOPES = [
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube.force-ssl",
].join(" ");

function clientConfig() {
  const clientId =
    process.env.EMIGRO_YOUTUBE_CLIENT_ID?.trim() || process.env.YOUTUBE_CLIENT_ID?.trim();
  const clientSecret =
    process.env.EMIGRO_YOUTUBE_CLIENT_SECRET?.trim() ||
    process.env.YOUTUBE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    throw new Error(
      "Set EMIGRO_YOUTUBE_CLIENT_ID and EMIGRO_YOUTUBE_CLIENT_SECRET in .env.local first"
    );
  }
  return { clientId, clientSecret };
}

function authUrl(clientId: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPES,
    access_type: "offline",
    prompt: "consent",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

async function exchangeCode(code: string, clientId: string, clientSecret: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });
  return res.json() as Promise<{
    refresh_token?: string;
    access_token?: string;
    error?: string;
    error_description?: string;
  }>;
}

function openBrowser(url: string) {
  const cmd =
    process.platform === "darwin"
      ? `open "${url}"`
      : process.platform === "win32"
        ? `start "" "${url}"`
        : `xdg-open "${url}"`;
  exec(cmd, () => {});
}

async function main() {
  const { clientId, clientSecret } = clientConfig();
  const url = authUrl(clientId);

  console.log("\n=== Emigro YouTube OAuth setup ===\n");
  console.log("1. Open this URL in a browser (logged in as @Emigro_news owner):\n");
  console.log(url);
  console.log("\n2. Approve access. Browser will redirect to localhost.\n");

  openBrowser(url);

  await new Promise<void>((resolvePromise, reject) => {
    const server = http.createServer(async (req, res) => {
      if (!req.url?.startsWith("/callback")) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }

      const callbackUrl = new URL(req.url, REDIRECT_URI);
      const code = callbackUrl.searchParams.get("code");
      const error = callbackUrl.searchParams.get("error");

      if (error) {
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(`OAuth error: ${error}`);
        reject(new Error(error));
        server.close();
        return;
      }

      if (!code) {
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Missing code");
        return;
      }

      try {
        const tokens = await exchangeCode(code, clientId, clientSecret);
        if (!tokens.refresh_token) {
          throw new Error(
            tokens.error_description ||
              tokens.error ||
              "No refresh_token — revoke app access in Google Account and run again with prompt=consent"
          );
        }

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end("<h1>OK</h1><p>You can close this tab and return to the terminal.</p>");

        console.log("\n=== Add to .env.local and VPS /opt/emigro/.env ===\n");
        console.log(`EMIGRO_YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}`);
        console.log("\nEMIGRO_YOUTUBE_UPLOAD_ENABLED=1");
        console.log("EMIGRO_YOUTUBE_UPLOAD_PRIVACY=public   # or unlisted for QA\n");

        const envPath = resolve(process.cwd(), ".env.local");
        try {
          const fs = await import("fs");
          let text = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
          const line = `EMIGRO_YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}`;
          if (/^EMIGRO_YOUTUBE_REFRESH_TOKEN=.*$/m.test(text)) {
            text = text.replace(/^EMIGRO_YOUTUBE_REFRESH_TOKEN=.*$/m, line);
          } else {
            if (!text.endsWith("\n")) text += "\n";
            text += `${line}\n`;
          }
          fs.writeFileSync(envPath, text);
          console.log(`Saved ${envPath}`);
        } catch (writeErr) {
          console.warn("Could not write .env.local:", writeErr);
        }

        resolvePromise();
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(err instanceof Error ? err.message : String(err));
        reject(err);
      } finally {
        server.close();
      }
    });

    server.listen(REDIRECT_PORT, "127.0.0.1", () => {
      console.log(`Waiting for callback on ${REDIRECT_URI} ...`);
    });

    server.on("error", reject);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
