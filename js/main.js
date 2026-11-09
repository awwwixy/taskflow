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

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.addEventListener("change", () => {
            task.done = checkbox.checked;
            renderTasks();
        });

        li.textContent = `${task.title} (пріоритет: ${task.priority})`;
        li.prepend(checkbox);
        if (task.done) li.classList.add("done");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Видалити";
        deleteButton.addEventListener("click", () => {
            queue.remove((t) => t.id === task.id);
            renderTasks();
        });
        li.append(deleteButton);
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