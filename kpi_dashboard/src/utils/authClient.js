import { createAuthClient } from 'better-auth/react';
import { adminClient } from 'better-auth/client/plugins';

const basePath = import.meta.env.VITE_BETTER_AUTH_BASE_PATH || '/api/auth';
const baseURL = import.meta.env.VITE_BETTER_AUTH_URL;

const options = {
  basePath,
  plugins: [
    adminClient({
      roles: ['admin', 'analyst', 'viewer'],
    }),
  ],
};

if (baseURL) {
  options.baseURL = baseURL;
}

export const authClient = createAuthClient(options);
