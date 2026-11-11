export function createAuthProxy(target, initialStrategy, proxyOptions = {}) {
    let strategy = initialStrategy;
    const limit = proxyOptions.maxPerSecond ?? Infinity;
    let calls = [];

    return new Proxy(target, {
        get(obj, prop) {
            if (prop === "setStrategy"){
                return (newStrategy) => {
                    strategy = newStrategy;
                };
            }

            const value = obj[prop];
            if (typeof value !== "function") return value;

            return async (endpoint, options = {}) => {
                const now = Date.now();
                calls = calls.filter((time) => now - time < 1000);
                if (calls.length >= limit) {
                    throw new Error("429: забагато запитів");
                }
                calls.push(now);

                const send = () => value.call(obj, endpoint, {
                    ...options,
                    headers: { ...options.headers, ...strategy.getHeaders()}
                });

                 try {
                    return await send();
                 } catch (error) {
                    if (error.message.startsWith("401") && strategy.refresh){
                        await strategy.refresh();
                        return send();
                    }
                    throw error;
                 }
            };
        }
    });
}