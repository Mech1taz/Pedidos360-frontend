export const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_SPA_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_ENTRA_TENANT_ID}`,
        knownAuthorities: [],
        redirectUri: window.location.origin + "/redirect.html",
        postLogoutRedirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

export const tokenRequest = {
    scopes: [
        `api://${import.meta.env.VITE_API_CLIENT_ID}/access_as_user`,
    ],
};