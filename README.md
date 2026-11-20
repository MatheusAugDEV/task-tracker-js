# Task Tracker

Aplicação simples de lista de tarefas feita com HTML, CSS e JavaScript puro.

## O que funciona

- Exibe uma mensagem quando a lista está vazia.
- Cadastra tarefas pelo botão **Adicionar tarefa** ou pela tecla Enter.
- Remove espaços no começo e no fim do título e informa quando o campo está vazio.
- Mostra o título como texto na lista, limpa o campo e devolve o foco para ele.
- Adapta o formulário para telas estreitas e permite que títulos longos quebrem linha.

As tarefas ficam guardadas no `localStorage` do navegador e são carregadas ao abrir ou recarregar a página. Se os dados salvos estiverem inválidos, a aplicação inicia com uma lista vazia. Se o navegador bloquear a gravação, a tarefa continua visível durante a sessão, mas pode sumir ao recarregar.

## Como abrir

Abra `index.html` no navegador ou inicie um servidor local na pasta do projeto:

```sh
python3 -m http.server 8000
```

Depois acesse <http://localhost:8000>.

## Testes

Este repositório ainda não contém testes automatizados. A verificação manual pode ser feita no navegador: estado vazio, cadastro pelo botão e Enter, título vazio ou com espaços, e um título longo em uma tela estreita.
