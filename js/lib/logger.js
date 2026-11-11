export function withLog(fn, options = {}) {
  const level = options.level ?? "INFO";

  return function (...args) {
    const time = new Date().toISOString();
    console.log(`[${time}] [${level}] ${fn.name} викликано з`, args);

    const result = fn(...args);

    console.log(`[${time}] [${level}] ${fn.name} повернула`, result);
    return result;
  };
}
