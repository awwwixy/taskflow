export class BaseClient {
  constructor(fetchFn) {
    this.fetchFn = fetchFn;
  }

  async request(req) {
    const response = await this.fetchFn(req.url, {
      method: req.method ?? "GET",
      headers: req.headers ?? {},
      body: req.body,
    });

    return { status: response.status, data: await response.json() };
  }
}
