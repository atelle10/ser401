import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "a972773a-46e3-47dd-aea6-80fb76f1f6a6",  
    authority: "https://login.microsoftonline.com/41f88ecb-ca63-404d-97dd-ab0a169fd138",  // Your TENANT_ID
    redirectUri: window.location.origin,  
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const loginRequest = {
  scopes: ["User.Read"],  // Add more if needed for role claims
};
