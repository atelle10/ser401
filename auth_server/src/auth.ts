import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins"
import { Pool } from "pg";
import crypto from "node:crypto";

const trustedOrigins = (
  process.env.BETTER_AUTH_TRUSTED_ORIGINS || "http://localhost:5173" //TODO: change from hardcoded origin
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5173",
  basePath: process.env.BETTER_AUTH_BASE_PATH || "/api/auth",
  trustedOrigins,
  database: new Pool({
    host: (process.env.DB_HOST as string) || "localhost",
    port: 5432,
    user: (process.env.DB_USER as string) || "postgres",
    password: (process.env.DB_PASSWORD as string) || "password",
    database: "famar_db",
    options: "-c search_path=auth",
  }),
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const pendingSuffix = crypto.randomUUID().slice(0, 8);
          const fallbackUsername = `pending_${pendingSuffix}`;
          const username = user.username as string | undefined;
          const phone = user.phone as string | undefined;
          return {
            data: {
              ...user,
              username:
                username && username.trim()
                  ? username
                  : fallbackUsername,
              phone:
                phone && phone.trim() ? phone : "__pending__",
            },
          };
        },
      },
    },
  },
  emailAndPassword: { enabled: true },
  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true, // TODO: remove for production and enable email verification flow.
    },
    additionalFields: {
      username: { type: "string", required: false },
      phone: { type: "string", required: false },
    },
  },
  session: {
    expiresIn: 300,
    refreshCache: true,
  },
  socialProviders: {
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID as string,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string, 
      tenantId: 'common', 
      authority: "https://login.microsoftonline.com", // Authentication authority URL
      prompt: "select_account", // Forces account selection
    }
  },
  plugins: [
    admin({
      defaultRole: "viewer",
      adminRoles: ["admin"],
      roles: ["admin", "analyst", "viewer"],
    }),
  ]
});
