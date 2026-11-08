const form = document.getElementById("task-form");
const input = document.getElementById("task-title");
const prioritySelect = document.getElementById("task-priority");
const list = document.getElementById("task-list");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = input.value.trim();
    const priority = Number(prioritySelect.value);
    if (title === "") return;

    const li = document.createElement('li');
    li.textContent = `${title} (пріоритет: ${priority})`;
    list.append(li);

    input.value = "";
});