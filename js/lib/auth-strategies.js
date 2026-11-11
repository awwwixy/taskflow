export function apiKeyStrategy(key) {
    return {
        name: "API Key",
        getHeaders: () => ({ "X-API-Key": key })
    };
}

export function jwtStrategy(token) {
    return {
        name: "JWT",
        getHeaders: () => ({ Authorization: `Bearer ${token}` })
    };
}

export function oauthStrategy(accessToken) {
    return {
        name: "OAuth",
        getHeaders: () => ({ Authorization: `Bearer ${accessToken}` })
    };
}