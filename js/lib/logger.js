export function withLog(fn, options = {}) {
  const level = options.level ?? "INFO";

  return function (...args) {
    const time = new Date().toISOString();

    if (level !== "ERROR"){
        console.log(`[${time}] [${level}] ${fn.name} викликано з`, args);
    }

    try {
        const result = fn(...args);
        if (level !== "ERROR"){
            console.log(`[${time}] [${level}] ${fn.name} повернула`, result);
        }
        return result;
    } catch (error){
        console.error(`[${time}] [ERROR] ${fn.name} помилка:`, error.message);
        throw error;
    }
  };
}