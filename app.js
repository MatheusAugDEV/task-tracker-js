const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const message = document.querySelector("#form-message");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const taskCount = document.querySelector("#task-count");

const tasks = [];

function renderTasks() {
  taskList.replaceChildren();

  for (const task of tasks) {
    const item = document.createElement("li");
    item.className = "task-item";
    item.textContent = task.title;
    taskList.append(item);
  }

  emptyState.hidden = tasks.length > 0;
  taskCount.textContent = tasks.length === 1 ? "1 tarefa" : `${tasks.length} tarefas`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  if (!title) {
    message.textContent = "Digite um título para adicionar a tarefa.";
    titleInput.setAttribute("aria-invalid", "true");
    titleInput.focus();
    return;
  }

  tasks.push({ title });
  message.textContent = "";
  titleInput.removeAttribute("aria-invalid");
  form.reset();
  renderTasks();
  titleInput.focus();
});

titleInput.addEventListener("input", () => {
  if (message.textContent) {
    message.textContent = "";
    titleInput.removeAttribute("aria-invalid");
  }
});

renderTasks();
