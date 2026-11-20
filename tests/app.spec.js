const { test, expect } = require("@playwright/test");

const storageKey = "task-tracker.tasks";

async function addTask(page, title) {
  await page.getByLabel("Título da tarefa").fill(title);
  await page.getByRole("button", { name: "Adicionar tarefa" }).click();
}

async function storedTasks(page) {
  return page.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

for (const viewport of [
  { name: "tela estreita", width: 375, height: 812 },
  { name: "desktop", width: 1280, height: 800 },
]) {
  test(`permite o fluxo principal por mouse e teclado em ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");
    await expect(page.getByText("Sua lista está vazia.")).toBeVisible();

    await addTask(page, "Comprar leite");
    await addTask(page, "Estudar JavaScript");
    await addTask(page, "Enviar relatório");
    await expect(page.locator(".task-count")).toHaveText("3 tarefas");
    const progress = page.getByRole("progressbar", { name: "Porcentagem de tarefas concluídas" });
    await expect(progress).toHaveAttribute("aria-valuenow", "0");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    await page.locator(".task-checkbox").nth(0).check();
    await page.getByRole("button", { name: "Pendentes" }).click();
    await expect(progress).toHaveAttribute("aria-valuenow", "33");
    await expect(page.locator("#pending-total")).toHaveText("2");
    await expect(page.locator("#completed-total")).toHaveText("1");
    await expect(page.locator(".task-title")).toHaveText([
      "Estudar JavaScript",
      "Enviar relatório",
    ]);

    await page.locator(".task-checkbox").nth(0).focus();
    await page.keyboard.press("Space");
    await expect(page.getByRole("button", { name: "Pendentes" })).toBeFocused();
    await page.locator(".task-checkbox").focus();
    await page.keyboard.press("Space");
    await expect(page.getByText("Nenhuma tarefa pendente.")).toBeVisible();
    await expect(progress).toHaveAttribute("aria-valuenow", "100");

    await page.getByRole("button", { name: "Concluídas" }).click();
    await expect(page.locator(".task-title")).toHaveText([
      "Comprar leite",
      "Estudar JavaScript",
      "Enviar relatório",
    ]);
    await page.locator(".task-checkbox").nth(0).focus();
    await page.keyboard.press("Space");
    await expect(page.getByRole("button", { name: "Concluídas" })).toBeFocused();

    await page.getByRole("button", { name: "Todas" }).focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Pendentes" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: "Pendentes" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await page.getByRole("button", { name: "Todas" }).click();

    const editButton = page.getByRole("button", {
      name: "Editar tarefa 2: Estudar JavaScript",
    });
    await editButton.focus();
    await page.keyboard.press("Enter");
    const editor = page.getByRole("textbox", { name: "Editar título: Estudar JavaScript" });
    await expect(editor).toBeFocused();
    await editor.fill("   Revisar JavaScript   ");
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("button", { name: "Editar tarefa 2: Revisar JavaScript" }),
    ).toBeFocused();

    await page.getByRole("button", { name: "Editar tarefa 3: Enviar relatório" }).click();
    await page.getByRole("textbox", { name: "Editar título: Enviar relatório" }).fill("   ");
    await page.keyboard.press("Enter");
    await expect(page.getByText("Digite um título para salvar.")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Editar tarefa 3: Enviar relatório" })).toBeFocused();

    const deleteButton = page.getByRole("button", {
      name: "Excluir tarefa 2: Revisar JavaScript",
    });
    await deleteButton.click();
    await page.getByRole("button", { name: "Cancelar", exact: true }).click();
    await expect(deleteButton).toBeFocused();
    await page.keyboard.press("Enter");
    const confirmButton = page.getByRole("button", { name: "Excluir", exact: true });
    await expect(page.getByRole("button", { name: "Cancelar", exact: true })).toBeFocused();
    await confirmButton.focus();
    await page.keyboard.press("Enter");

    await expect(page.locator(".task-count")).toHaveText("2 tarefas");
    await expect(page.getByRole("button", { name: "Editar tarefa 2: Enviar relatório" })).toBeFocused();
    await page.reload();
    await expect(page.locator(".task-title")).toHaveText(["Comprar leite", "Enviar relatório"]);
    await expect(page.locator(".task-checkbox").nth(0)).not.toBeChecked();
    await expect(page.locator(".task-checkbox").nth(1)).toBeChecked();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("restaura as tarefas e seus estados depois de recarregar", async ({ page }) => {
  await addTask(page, "Ler documentação");
  await addTask(page, "Preparar apresentação");
  await page.locator(".task-checkbox").nth(1).check();

  await page.reload();

  await expect(page.locator(".task-title")).toHaveText([
    "Ler documentação",
    "Preparar apresentação",
  ]);
  await expect(page.locator(".task-count")).toHaveText("2 tarefas");
  await expect(page.locator(".task-checkbox").nth(0)).not.toBeChecked();
  await expect(page.locator(".task-checkbox").nth(1)).toBeChecked();
});

test("carrega tarefas antigas que contêm apenas title como pendentes", async ({ page }) => {
  await page.evaluate((key) => {
    localStorage.setItem(key, JSON.stringify([{ title: "Tarefa antiga" }]));
  }, storageKey);
  await page.reload();

  await expect(page.locator(".task-title")).toHaveText(["Tarefa antiga"]);
  await expect(page.locator(".task-checkbox")).not.toBeChecked();
  await expect(page.locator(".task-count")).toHaveText("1 tarefa");
});

test("edita e exclui o item correto com títulos repetidos no filtro", async ({ page }) => {
  await page.evaluate((key) => {
    localStorage.setItem(
      key,
      JSON.stringify([
        { title: "Revisão repetida", completed: false },
        { title: "Revisão repetida", completed: true },
        { title: "Revisão repetida", completed: true },
      ]),
    );
  }, storageKey);
  await page.reload();
  await page.getByRole("button", { name: "Concluídas" }).click();
  await expect(page.locator(".task-title")).toHaveCount(2);

  await page.getByRole("button", { name: "Editar tarefa 2: Revisão repetida" }).click();
  const editor = page.getByRole("textbox", { name: "Editar título: Revisão repetida" });
  await expect(editor).toBeFocused();
  await editor.fill("Revisão da tarefa concluída");
  await page.getByRole("button", { name: "Salvar", exact: true }).click();

  let saved = await storedTasks(page);
  expect(saved).toEqual([
    { title: "Revisão repetida", completed: false },
    { title: "Revisão da tarefa concluída", completed: true },
    { title: "Revisão repetida", completed: true },
  ]);

  await page.getByRole("button", { name: "Excluir tarefa 3: Revisão repetida" }).click();
  await page.getByRole("button", { name: "Excluir", exact: true }).click();

  saved = await storedTasks(page);
  expect(saved).toEqual([
    { title: "Revisão repetida", completed: false },
    { title: "Revisão da tarefa concluída", completed: true },
  ]);
  await expect(page.locator(".task-count")).toHaveText("2 tarefas");
  await expect(page.getByRole("button", { name: "Editar tarefa 2: Revisão da tarefa concluída" })).toBeFocused();
});
