export function filterCallback(array, predicate, callback, options = {}) {
  const result = [];
  let index = 0;
  const signal = options.signal;

  function next() {
    if (signal?.aborted) {
      callback(new DOMException("Операцію скасовано", "AbortError"));
      return;
    }

    if (index >= array.length) {
      callback(null, result);
      return;
    }

    const item = array[index];
    index++;

    predicate(item, (error, keep) => {
      if (error) {
        callback(error);
        return;
      }
      if (keep) result.push(item);
      next();
    });
  }

  next();
}

export async function filterAsync(array, predicate, options = {}) {
  const result = [];
  const signal = options.signal;

  for (const item of array) {
    if (signal?.aborted) {
      throw new DOMException("Операцію скасовано", "AbortError");
    }
    if (await predicate(item)) {
      result.push(item);
    }
  }

  return result;
}
