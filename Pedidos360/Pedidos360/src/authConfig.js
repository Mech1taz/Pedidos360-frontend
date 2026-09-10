export const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_SPA_CLIENT_ID,
        authority: "https://mechitaz.ciamlogin.com/mechitaz.onmicrosoft.com",
        knownAuthorities: [
            "mechitaz.ciamlogin.com",
            "2c0bd16d-0958-4f75-b6dd-3fc74486f74d.ciamlogin.com"
        ],
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