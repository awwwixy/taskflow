import { filterCallback, filterAsync } from "./lib/async-array.js";
import { readArchive } from "./lib/archive.js";
import { EventEmitter } from "./lib/event-emitter.js";

function isEvenSlow(n, done) {
  setTimeout(() => done(null, n % 2 === 0), 300);
}

function isEvenAsync(n) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(n % 2 === 0), 300);
  });
}

filterCallback([1, 2, 3, 4, 5, 6], isEvenSlow, (error, result) => {
  console.log("CallBack", result);
});

filterAsync([1, 2, 3, 4], isEvenAsync).then((result) =>
  console.log("Promise then:", result),
);

async function demoAwait() {
  const result = await filterAsync([5, 6, 7, 8], isEvenAsync);
  console.log("Promise await:", result);
}
demoAwait();

const controller = new AbortController();

filterAsync([1, 2, 3, 4, 5, 6], isEvenAsync, { signal: controller.signal })
  .then((result) => console.log("Результат:", result))
  .catch((error) => console.log("Помилка:", error.message));

setTimeout(() => {
  console.log("Натискаю «Скасувати»");
  controller.abort();
}, 700);

async function demoArchive() {
  let total = 0;
  let done = 0;

  for await (const batch of readArchive(1200)) {
    total += batch.length;
    done += batch.filter((task) => task.done).length;
    console.log(`Оброблено ${total}, виконаних ${done}`);
  }
}
demoArchive();

const emitter = new EventEmitter();
emitter.on("ping", () => {
  throw new Error("Слухач 1 зламався");
});
emitter.on("ping", () => console.log("Слухач 2 працює"));
emitter.on("error", (error) => console.log("Канал error:", error.message));
emitter.emit("ping");

const cbController = new AbortController();
filterCallback([1, 2, 3, 4, 5, 6], isEvenSlow, (error, result) => {
  if (error) {
    console.log("Callback abort:", error.name, error.message);
    return;
  }
  console.log("Callback abort:", result);
}, { signal: cbController.signal });
setTimeout(() => cbController.abort(), 700);