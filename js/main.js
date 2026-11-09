const form = document.getElementById("task-form");
const input = document.getElementById("task-title");
const prioritySelect = document.getElementById("task-priority");
const list = document.getElementById("task-list");

const tasks = [];
let nextId = 1;

function renderTasks() {
    list.innerHTML = "";

    for (const task of tasks) {
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
    tasks.push(task);
    renderTasks();

    input.value = "";
});