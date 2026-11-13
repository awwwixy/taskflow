export function* roundRobin(items) {
  let index = 0;

  while (true) {
    yield items[index];
    index = (index + 1) % items.length;
  }
}

export async function consumeWithTimeout(
  iterator,
  seconds,
  process,
  delayMs = 500,
) {
  const endTime = Date.now() + seconds * 1000;

  while (Date.now() < endTime) {
    const { value, done } = iterator.next();
    if (done) break;

    process(value);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}
