# Task Tracker

Aplicação simples de lista de tarefas feita com HTML, CSS e JavaScript puro.

## O que funciona

- Exibe uma mensagem quando a lista está vazia.
- Cadastra tarefas pelo botão **Adicionar tarefa** ou pela tecla Enter.
- Permite concluir e reabrir tarefas pelo controle de seleção, que também pode ser usado pelo teclado.
- Filtra a lista por **Todas**, **Pendentes** ou **Concluídas**, com controles acessíveis por teclado.
- Mantém o contador com o total de tarefas, concluídas ou não.
- Remove espaços no começo e no fim do título e informa quando o campo está vazio.
- Mostra o título como texto na lista, limpa o campo e devolve o foco para ele.
- Adapta o formulário para telas estreitas e permite que títulos longos quebrem linha.

As tarefas e seus estados de conclusão ficam guardados no `localStorage` do navegador e são carregados ao abrir ou recarregar a página. A lista abre no filtro **Todas**; os filtros afetam apenas a visualização, e o contador continua mostrando o total. Uma lista vazia e um filtro sem resultados têm mensagens diferentes. Tarefas salvas antes do campo de conclusão são carregadas como pendentes. Se os dados salvos estiverem inválidos, a aplicação inicia com uma lista vazia. Se o navegador bloquear a gravação, a alteração continua visível durante a sessão, mas pode sumir ao recarregar.

## Como abrir

Abra `index.html` no navegador ou inicie um servidor local na pasta do projeto:

```sh
python3 -m http.server 8000
```

Depois acesse <http://localhost:8000>.

## Testes

Este repositório ainda não contém testes automatizados. A verificação manual pode ser feita no navegador: estado vazio, cadastro pelo botão e Enter, título vazio ou com espaços, título longo em uma tela estreita, conclusão e reabertura pelo mouse e teclado, persistência após recarga, carregamento de tarefas antigas e filtros por status.
