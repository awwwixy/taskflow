export const api = {
    async request(endpoint, options = {}) {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const headers = options.headers ?? {};
        if (!headers["Authorization"] && !headers["X-API-Key"]) {
            throw new Error("401: потрібна авторизаія");
        }

        return { endpoint, status: 200, headers };
    }
};