export function memoize(fn, options = {}) {
    const maxSize = options.maxSize ?? Infinity;
    const policy = options.policy ?? "lru";
    const cache = new Map();

    function evict() {
        if (policy === "lru") {
            const oldestKey = cache.keys().next().value;
            cache.delete(oldestKey);
        } else if (policy === "lfu") {
            let minKey = null;
            let minCount = Infinity;

            for (const [key, entry] of cache) {
                if (entry.hits < minCount) {
                    minCount = entry.hits;
                    minKey = key;
                }
            }

            cache.delete(minKey);

        }
    }

    return function(...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            const entry = cache.get(key);
            entry.hits++;
            cache.delete(key);
            cache.set(key, entry);
            return entry.result;
        }

        if (cache.size >= maxSize) {
            evict();
        }

        const result = fn(...args);
        cache.set(key, { result, hits: 1 });
        return result;
    };
}