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

            return async (endpoint, options = {}) => {
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