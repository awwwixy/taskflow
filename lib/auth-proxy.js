export class AuthProxy {
  constructor(client, strategy) {
    this.client = client;
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  async request(req) {
    const send = () =>
      this.client.request({
        ...req,
        headers: { ...req.headers, ...this.strategy.getHeaders() },
      });

    let response = await send();

    if (response.status === 401 && this.strategy.refresh) {
      await this.strategy.refresh();
      response = await send();
    }

    return response;
  }
}
