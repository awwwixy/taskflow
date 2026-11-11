function defaultFormat(entry) {
    return `[${entry.time}] [${entry.level}] ${entry.name} ${entry.message}: ${JSON.stringify(entry.data)}`;
}

export function withLog(fn, options = {}) {
  const level = options.level ?? "INFO";
  const format = options.format ?? defaultFormat;
  const output = options.output ?? console.log;

  function write(lvl, message, data){
    const entry = {
        time: new Date().toISOString(),
        level: lvl,
        name: fn.name,
        message,
        data
    };
    output(format(entry));
  }

  return function (...args) {
    const start = performance.now();
    const ms = () => Math.round(performance.now() - start);

    if (level !== "ERROR") write(level, "викликано з", args);

    try {
      const result = fn(...args);

      if (result instanceof Promise) {
        return result
        .then((value) => {
          if (level !== "ERROR") write(level, `повернула за ${ms()} мс`, value);
          return value;
        })
        .catch((error) => {
          write("ERROR", "помилка", error.message);
          throw error;
        })
      }
      if (level !== "ERROR") write(level, `повернула за ${ms()} мс`, result);
      return result;
  } catch (error) {
    write("ERROR", "помилка", error.message);
    throw error;
  }
};
}