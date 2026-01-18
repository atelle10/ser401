import { createAuthClient } from 'better-auth/react';

const basePath = import.meta.env.VITE_BETTER_AUTH_BASE_PATH || '/api/auth';
const baseURL = import.meta.env.VITE_BETTER_AUTH_URL;

const options = {
  basePath,
};

if (baseURL) {
  options.baseURL = baseURL;
}

export const authClient = createAuthClient(options);
