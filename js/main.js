import { PriorityQueue } from "./lib/priority-queue.js";
import { EventEmitter } from "./lib/event-emitter.js";
 

const form = document.getElementById("task-form");
const input = document.getElementById("task-title");
const prioritySelect = document.getElementById("task-priority");
const list = document.getElementById("task-list");
const sortSelect = document.getElementById("sort-mode");
const statTotal = document.getElementById("stat-total");
const statDone = document.getElementById("stat-done");
const statProgress = document.getElementById("stat-progress");

const queue = new PriorityQueue();
let nextId = 1;
let sortMode = "highest"; 

const events = new EventEmitter();

function renderTasks() {
    list.innerHTML = "";

    for (const task of queue.toArray(sortMode)) {
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

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = input.value.trim();
    const priority = Number(prioritySelect.value);
    if (title === "") return;

    const task = { 
        id: nextId++, 
        title, 
        priority,
        done: false
    
    };
    queue.enqueue(task, priority);
    events.emit("changed");

    input.value = "";
});

sortSelect.addEventListener("change", () => {
    sortMode = sortSelect.value;
    renderTasks();
});

events.on("changed", renderTasks);
events.on("changed", renderStats);


