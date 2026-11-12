import { PriorityQueue } from "./lib/priority-queue.js";
import { EventEmitter } from "./lib/event-emitter.js";
import { memoize } from "./lib/memoize.js";
import { roundRobin, consumeWithTimeout } from "./lib/generators.js";
import { withLog } from "./lib/logger.js";
import { api } from "./lib/fake-api.js";
import { createAuthProxy } from "./lib/auth-proxy.js";
import { jwtStrategy } from "./lib/auth-strategies.js";

const form = document.getElementById("task-form");
const input = document.getElementById("task-title");
const prioritySelect = document.getElementById("task-priority");
const list = document.getElementById("task-list");
const sortSelect = document.getElementById("sort-mode");
const searchInput = document.getElementById("search");
const statTotal = document.getElementById("stat-total");
const statDone = document.getElementById("stat-done");
const statProgress = document.getElementById("stat-progress");
const challengeBtn = document.getElementById("challenge-btn");
const motivationBtn = document.getElementById("motivation-btn");
const motivationText = document.getElementById("motivation");
const loginBtn = document.getElementById("login-btn");
const userName = document.getElementById("user-name");
const syncBtn = document.getElementById("sync-btn");
const syncStatus = document.getElementById("sync-status");

const queue = new PriorityQueue();
const events = new EventEmitter();
let nextId = 1;
let sortMode = "highest";
let version = 0;

const challenges = roundRobin([
  "Випити дві склянки води",
  "Прочитати 10 сторінок",
  "Зробити 20 присідань",
  "Прогулятися 15 хвилин",
  "Прибрати робочий стіл",
]);

const quotes = roundRobin([
  "Ти впораєшся!",
  "Крок за кроком",
  "Маленький прогрес - теж прогрес",
  "Почни з найважливішого",
]);

function findTasks(query, mode, ver) {
  console.log("Шукаю:", query);
  return queue
    .toArray(mode)
    .filter((task) => task.title.toLowerCase().includes(query.toLowerCase()));
}

const findTasksCache = memoize(findTasks, { maxSize: 20 });

function renderTasks() {
  list.innerHTML = "";

  const query = searchInput.value.trim();
  for (const task of findTasksCache(query, sortMode, version)) {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      events.emit("changed");
    });

    li.textContent = `${task.title} (пріоритет: ${task.priority})`;
    li.prepend(checkbox);
    if (task.done) li.classList.add("done");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Видалити";
    deleteButton.addEventListener("click", () => {
      queue.remove((t) => t.id === task.id);
      events.emit("changed");
    });
    li.append(deleteButton);
    list.append(li);
  }
}

function renderStats() {
  const tasks = queue.toArray();
  const total = tasks.length;
  const done = tasks.filter((task) => task.done).length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  statTotal.textContent = total;
  statDone.textContent = done;
  statProgress.textContent = progress;
}

function addTask(title, priority) {
  const task = {
    id: nextId++,
    title,
    priority,
    done: false,
  };
  queue.enqueue(task, priority);
  events.emit("changed");
}
const addTaskLogged = withLog(addTask, { level: "INFO" });

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = input.value.trim();
  const priority = Number(prioritySelect.value);
  if (title === "") return;

  addTaskLogged(title, priority);
  input.value = "";
});

sortSelect.addEventListener("change", () => {
  sortMode = sortSelect.value;
  renderTasks();
});

searchInput.addEventListener("input", renderTasks);

events.on("changed", () => version++);
events.on("changed", renderTasks);
events.on("changed", renderStats);

challengeBtn.addEventListener("click", () => {
  const title = challenges.next().value;
  addTaskLogged(title, 3);
});

motivationBtn.addEventListener("click", async () => {
  motivationBtn.disabled = true;

  await consumeWithTimeout(
    quotes,
    5,
    (text) => {
      motivationText.textContent = text;
    },
    1000,
  );

  motivationText.textContent = "";
  motivationBtn.disabled = false;
});

const guestStrategy = { name: "Guest", getHeaders: () => ({}) };
const secureApi = createAuthProxy(api, guestStrategy, { maxPerSecond: 2 });
let loggedIn = false;

loginBtn.addEventListener("click", () => {
  loggedIn = !loggedIn;

  if (loggedIn) {
    secureApi.setStrategy(jwtStrategy("token-viktoriia"));
    userName.textContent = "Вікторія";
    loginBtn.textContent = "Вийти";
  } else {
    secureApi.setStrategy(guestStrategy);
    userName.textContent = "Гість";
    loginBtn.textContent = "Увійти";
  }
});

syncBtn.addEventListener("click", async () => {
  try {
    await secureApi.request("/sync");
    syncStatus.textContent = "Збережено✅";
  } catch (error) {
    syncStatus.textContent = error.message;
  }
});

