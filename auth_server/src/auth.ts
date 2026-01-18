import { betterAuth } from "better-auth";
import { Pool } from "pg";

const trustedOrigins = (
  process.env.BETTER_AUTH_TRUSTED_ORIGINS || "http://localhost:5173" //TODO: change from hardcoded origin
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
  basePath: process.env.BETTER_AUTH_BASE_PATH || "/api/auth",
  trustedOrigins,
  database: new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "wuvzak-Nihmi7-gohdoh", // TODO: change from hardcoded password
    database: "famar_db",
    options: "-c search_path=auth",
  }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      username: { type: "string", required: true },
      phone: { type: "string", required: true },
      accountType: { type: "string", required: true },
    },
  },
  session: {
    expiresIn: 300,
    refreshCache: true,
  },
});
