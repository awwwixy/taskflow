export async function mockFetch(url, options = {}) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const headers = options.headers ?? {};
  const auth = headers["Authorization"];
  const apiKey = headers["X-API-Key"];

  let status = 200;
  let data = { url, ok: true };

  if (!auth && !apiKey) {
    status = 401;
    data = { error: "потрібна авторизація" };
  } else if (auth === "Bearer expired-token") {
    status = 401;
    data = { error: "токен прострочений" };
  }

  return { status, json: async () => data };
}
