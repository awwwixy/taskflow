export function createAuthProxy(target, initialStrategy) {
    let strategy = initialStrategy;

    return new Proxy(target, {
        get(obj, prop) {
            if (prop === "setStrategy"){
                return (newStrategy) => {
                    strategy = newStrategy;
                };
            }

            const value = obj[prop];
            if (typeof value !== "function") return value;

            return (endpoint, options = {}) => {
                const headers = { ...options.headers, ...strategy.getHeaders() };
                return value.call(obj, endpoint, { ...options, headers });
            };
        }
    })
}