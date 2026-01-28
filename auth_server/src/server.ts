import "dotenv/config";
import http from "node:http";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";

const requiredEnvVars = [
  "DB_PASSWORD",
  "MICROSOFT_CLIENT_ID",
  "MICROSOFT_CLIENT_SECRET",
] as const;

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}. ` +
      "Copy auth_server/.env.example to auth_server/.env and fill in values."
  );
  process.exit(1);
}

const port = Number(process.env.AUTH_PORT || 3001);
const handler = toNodeHandler(auth);

const server = http.createServer((req, res) => {
  handler(req, res);
});

server.listen(port, () => {
  const basePath = auth.options.basePath || "/api/auth";
  console.log(`auth server listening on http://localhost:${port}${basePath}`);
});
