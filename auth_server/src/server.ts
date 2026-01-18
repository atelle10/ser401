import http from "node:http";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";

const port = Number(process.env.AUTH_PORT || 3001);
const handler = toNodeHandler(auth);

const server = http.createServer((req, res) => {
  handler(req, res);
});

server.listen(port, () => {
  const basePath = auth.options.basePath || "/api/auth";
  console.log(`auth server listening on http://localhost:${port}${basePath}`);
});
