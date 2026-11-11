export const api = {
  async request(endpoint, options = {}) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const headers = options.headers ?? {};
    if (!headers["Authorization"] && !headers["X-API-Key"]) {
      throw new Error("401: потрібна авторизаія");
    }

      if (headers["Authorization"] === "Bearer expired-token") {
        throw new Error("401: токен прострочений");
      }

    return { endpoint, status: 200, headers };
  },
};
