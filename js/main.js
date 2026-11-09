import { PriorityQueue } from "./lib/priority-queue.js";

const form = document.getElementById("task-form");
const input = document.getElementById("task-title");
const prioritySelect = document.getElementById("task-priority");
const list = document.getElementById("task-list");
const sortSelect = document.getElementById("sort-mode");

const queue = new PriorityQueue();
let nextId = 1;
let sortMode = "highest"; 
function renderTasks() {
    list.innerHTML = "";

    for (const task of queue.toArray(sortMode)) {
        const li = document.createElement("li");
        li.textContent = `${task.title} (пріоритет: ${task.priority})`;
        list.append(li);
    }
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
    renderTasks();

    input.value = "";
});

sortSelect.addEventListener("change", () => {
    sortMode = sortSelect.value;
    renderTasks();
});