export function memoize(fn, options = {}) {
    const maxSize = options.maxSize ?? Infinity;
    const policy = options.policy ?? "lru";
    const ttl = options.ttl ?? Infinity;

    function evict() {
        if (policy === "lru") {
            const oldestKey = cache.keys().next().value;
            cache.delete(oldestKey);
        } else if (policy === "lfu") {
            let minKey = null;
            let minHits = Infinity;
            for (const [key, entry] of cache) {
                if (entry.hits < minHits) {
                    minHits = entry.hits;
                    minKey = key;
                }
            }

            cache.delete(minKey);

        } else if (typeof policy === "function") {
            const entries = [...cache.entries()];
            const keyToRemove = policy(entries);
            cache.delete(keyToRemove);
        }
    }

    const cache = new Map();

    return function(...args) {
        const key = JSON.stringify(args);

        const saved = cache.get(key);
        if (saved && Date.now() - saved.createdAt > ttl) {
            cache.delete(key);
        }

        if (cache.has(key)) {
            const entry = cache.get(key);
            entry.hits++;
            cache.delete(key);
            cache.set(key, entry);
            return entry.value;
        }

        if (cache.size >= maxSize) {
            evict();
        }

        const result = fn(...args);
        cache.set(key, { value: result, hits: 1, createdAt: Date.now() });
        return result;
    };
}