const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const message = document.querySelector("#form-message");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const taskCount = document.querySelector("#task-count");

const storageKey = "task-tracker.tasks";
const storageWarning =
  "A alteração foi feita, mas não foi possível salvá-la. Ela pode sumir ao recarregar a página.";
const tasks = [];

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(storageKey);
    if (!savedTasks) return;

    const parsedTasks = JSON.parse(savedTasks);
    if (Array.isArray(parsedTasks)) {
      const validTasks = parsedTasks.every(
        (task) => task && typeof task.title === "string",
      );
      if (!validTasks) return;

      tasks.push(
        ...parsedTasks.map((task) => ({
          title: task.title,
          completed: task.completed === true,
        })),
      );
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

  for (const [index, task] of tasks.entries()) {
    const item = document.createElement("li");
    item.className = task.completed ? "task-item is-completed" : "task-item";

    const label = document.createElement("label");
    label.className = "task-label";

    const checkbox = document.createElement("input");
    checkbox.className = "task-checkbox";
    checkbox.type = "checkbox";
    checkbox.id = `task-${index}`;
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      item.classList.toggle("is-completed", task.completed);
      message.textContent = saveTasks() ? "" : storageWarning;
    });

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    label.htmlFor = checkbox.id;
    label.append(checkbox, title);
    item.append(label);
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

  tasks.push({ title, completed: false });
  message.textContent = "";
  titleInput.removeAttribute("aria-invalid");
  form.reset();
  renderTasks();
  if (!saveTasks()) {
    message.textContent = storageWarning;
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
