# Task Tracker

Este é um projeto de portfólio que fiz para praticar HTML, CSS e JavaScript no curso de ADS. Com ele, posso cadastrar tarefas, editar e excluir cada item, marcar o que já concluí e filtrar a lista por status. A página funciona em celular e desktop.

## Demo

https://matheusaugdev.github.io/task-tracker-js/

## Como abrir

Posso abrir o arquivo `index.html` direto no navegador. Para usar um servidor local, executo na pasta do projeto:

```sh
python3 -m http.server 8000
```

Depois acesso <http://localhost:8000>.

## Como funciona

No `app.js`, o array `tasks` guarda os objetos da lista enquanto a página está aberta. Cada objeto tem `title` e `completed`. A função `renderTasks()` lê esse array, aplica o filtro ativo e cria os itens da tela; o título entra como texto com `textContent`. Quando a lista muda, `saveTasks()` transforma o array em JSON e grava no `localStorage`. Na próxima abertura, `loadTasks()` lê o JSON, monta os objetos novamente e a primeira renderização mostra as tarefas salvas.

Uma decisão técnica que posso explicar é manter `tasks` como a fonte dos dados e tratar os filtros apenas como uma forma de visualizar essa lista. Assim, o contador continua mostrando o total e concluir um item numa visão filtrada atualiza o mesmo objeto que será salvo.

## Testes

Instalo as dependências e o Chromium usado pelo Playwright e rodo os testes de navegador:

```sh
npm install
npx playwright install chromium
npm test
```

A suíte cobre cadastro, edição, exclusão, filtros, conclusão, navegação pelo teclado, recarga, dados antigos com apenas `title` e títulos repetidos numa lista filtrada. Também roda o fluxo principal em uma janela estreita e em desktop.
