export class LoggingProxy {
  constructor(client, output = console.log) {
    this.client = client;
    this.output = output;
  }

  async request(req) {
    const time = new Date().toISOString();
    const start = performance.now();

    const response = await this.client.request(req);

    const ms = Math.round(performance.now() - start);
    this.output(
      `${time} ${req.method ?? "GET"} ${req.url}: ${response.status} (${ms} мс)`,
    );

    return response;
  }
}
