const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const message = document.querySelector("#form-message");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const taskCount = document.querySelector("#task-count");

const storageKey = "task-tracker.tasks";
const tasks = [];

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(storageKey);
    if (!savedTasks) return;

    const parsedTasks = JSON.parse(savedTasks);
    if (
      Array.isArray(parsedTasks) &&
      parsedTasks.every((task) => task && typeof task.title === "string")
    ) {
      tasks.push(...parsedTasks);
    }
  } catch {
    // Dados ausentes, inválidos ou armazenamento indisponível não impedem o uso.
  }
}

function saveTasks() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
    return true;
  } catch {
    return false;
  }
}

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
  if (!saveTasks()) {
    message.textContent =
      "Tarefa adicionada, mas não foi possível salvá-la. Ela pode sumir ao recarregar a página.";
  }
  titleInput.focus();
});

titleInput.addEventListener("input", () => {
  if (message.textContent) {
    message.textContent = "";
    titleInput.removeAttribute("aria-invalid");
  }
});

loadTasks();
renderTasks();
