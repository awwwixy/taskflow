import { filterCallback, filterAsync } from "./lib/async-array.js";

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

filterAsync([1, 2, 3, 4], isEvenAsync)
.then((result) => console.log("Promise then:", result));

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