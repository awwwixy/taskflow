export class SyncService {
  constructor(client) {
    this.client = client;
  }

  async save(tasks) {
    const response = await this.client.request({
      url: "/sync",
      method: "POST",
      body: JSON.stringify(tasks),
    });

    if (response.status !== 200) {
      throw new Error(`${response.status}: ${response.data.error}`);
    }

    return response.data;
  }
}
