export function apiKeyStrategy(key) {
  return {
    name: "API Key",
    getHeaders: () => ({ "X-API-Key": key }),
  };
}

export function jwtStrategy(token) {
  return {
    name: "JWT",
    getHeaders: () => ({ Authorization: `Bearer ${token}` }),
  };
}

export function oauthStrategy(accessToken, refreshToken) {
  let token = accessToken;

  return {
    name: "OAuth",
    getHeaders: () => ({ Authorization: `Bearer ${token}` }),
    async refresh() {
      await new Promise((resolve) => setTimeout(resolve, 200));
      token = `new-token-${refreshToken}`;
      console.log("Токен оновлено:", token);
    },
  };
}
