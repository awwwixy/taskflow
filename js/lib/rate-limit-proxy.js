export class RateLimitProxy {
    constructor(client, maxPerSecond) {
        this.client = client;
        this.maxPerSecond = maxPerSecond;
        this.calls = [];
    }

    async request(req) {
        const now = Date.now();
        this.calls = this.calls.filter((time) => now - time < 1000);

        if (this.calls.length >= this.maxPerSecond) {
            return { status: 429, data: { error: "забагато запитів" } };
        }

        this.calls.push(now);
        return this.client.request(req);
    }
}