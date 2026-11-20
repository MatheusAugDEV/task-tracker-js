const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const message = document.querySelector("#form-message");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const taskCount = document.querySelector("#task-count");
const filterButtons = document.querySelectorAll("[data-filter]");

const storageKey = "task-tracker.tasks";
const storageWarning =
  "A alteração foi feita, mas não foi possível salvá-la. Ela pode sumir ao recarregar a página.";
const tasks = [];
let activeFilter = "all";
let editingTask = null;

function matchesActiveFilter(task) {
  if (activeFilter === "pending") return !task.completed;
  if (activeFilter === "completed") return task.completed;
  return true;
}

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
  const visibleTasks = tasks.filter(matchesActiveFilter);

  for (const task of visibleTasks) {
    const index = tasks.indexOf(task);
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
      const checkboxHadFocus = document.activeElement === checkbox;
      task.completed = checkbox.checked;
      item.classList.toggle("is-completed", task.completed);
      message.textContent = saveTasks() ? "" : storageWarning;
      renderTasks();

      if (checkboxHadFocus) {
        const focusTarget = matchesActiveFilter(task)
          ? document.querySelector(`#task-${index}`)
          : document.querySelector(`[data-filter="${activeFilter}"]`);
        focusTarget?.focus();
      }
    });

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    label.htmlFor = checkbox.id;
    label.append(checkbox, title);

    const row = document.createElement("div");
    row.className = "task-row";
    row.append(label);

    if (editingTask === task) {
      title.hidden = true;
      checkbox.setAttribute("aria-label", task.title);

      const editor = document.createElement("div");
      editor.className = "task-editor";

      const editorForm = document.createElement("form");
      editorForm.className = "task-editor-form";
      editorForm.noValidate = true;

      const editorInput = document.createElement("input");
      editorInput.className = "task-editor-input";
      editorInput.type = "text";
      editorInput.id = `edit-task-${index}`;
      editorInput.value = task.title;
      editorInput.setAttribute("aria-label", `Editar título: ${task.title}`);

      const error = document.createElement("p");
      error.className = "task-editor-error";
      error.id = `edit-error-${index}`;
      error.setAttribute("aria-live", "polite");
      editorInput.setAttribute("aria-describedby", error.id);

      const saveButton = document.createElement("button");
      saveButton.className = "editor-button editor-button-save";
      saveButton.type = "submit";
      saveButton.textContent = "Salvar";

      const cancelButton = document.createElement("button");
      cancelButton.className = "editor-button editor-button-cancel";
      cancelButton.type = "button";
      cancelButton.textContent = "Cancelar";

      function closeEditor() {
        editingTask = null;
        renderTasks();
        document.querySelector(`#edit-button-${index}`)?.focus();
      }

      editorForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const updatedTitle = editorInput.value.trim();
        if (!updatedTitle) {
          error.textContent = "Digite um título para salvar.";
          editorInput.setAttribute("aria-invalid", "true");
          editorInput.focus();
          return;
        }

        task.title = updatedTitle;
        editingTask = null;
        message.textContent = saveTasks() ? "" : storageWarning;
        renderTasks();
        document.querySelector(`#edit-button-${index}`)?.focus();
      });

      editorForm.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          closeEditor();
        }
      });
      cancelButton.addEventListener("click", closeEditor);

      editorForm.append(editorInput, saveButton, cancelButton);
      editor.append(editorForm, error);
      row.append(editor);
    } else {
      const editButton = document.createElement("button");
      editButton.className = "task-action-button task-edit-button";
      editButton.type = "button";
      editButton.id = `edit-button-${index}`;
      editButton.textContent = "Editar";
      editButton.setAttribute("aria-label", `Editar tarefa ${index + 1}: ${task.title}`);
      editButton.addEventListener("click", () => {
        editingTask = task;
        renderTasks();
        document.querySelector(`#edit-task-${index}`)?.focus();
      });
      row.append(editButton);
    }

    item.append(row);
    taskList.append(item);
  }

  emptyState.hidden = visibleTasks.length > 0;
  if (tasks.length === 0) {
    emptyState.textContent = "Sua lista está vazia. Adicione sua primeira tarefa acima.";
  } else if (activeFilter === "pending") {
    emptyState.textContent = "Nenhuma tarefa pendente.";
  } else if (activeFilter === "completed") {
    emptyState.textContent = "Nenhuma tarefa concluída.";
  }
  taskCount.textContent = tasks.length === 1 ? "1 tarefa" : `${tasks.length} tarefas`;

  for (const button of filterButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.filter === activeFilter));
  }
}

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    renderTasks();
  });
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
