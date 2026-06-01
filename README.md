# CRUD de Produtos — DSW 2026/1

Implementação completa do CRUD de produtos com **Bun + Express** no backend e **HTML, CSS e JavaScript puro** no frontend.

Avaliação da disciplina **Desenvolvimento de Software para Web (DSW)** — Curso de Sistemas de Informação, UNEMAT — Prof. Ivan Luiz Pedroso Pires.

## Integrantes

- Adrian (UNEMAT — Sistemas de Informação)

## Estrutura do projeto

```
.
├── backend/      # API REST em Bun + Express
└── frontend/     # Interface HTML/CSS/JS
```

## Como executar

### Backend

```bash
cd backend
bun install
bun run dev
```

O servidor sobe em `http://localhost:3000`.

### Frontend

Basta abrir o arquivo `frontend/index.html` direto no navegador (duplo clique) ou servir com qualquer servidor estático (ex.: extensão Live Server do VS Code).

> O frontend faz requisições para `http://localhost:3000`, então o backend precisa estar rodando.

## Rotas implementadas

| Método | Rota             | Descrição                                                                          |
| ------ | ---------------- | ---------------------------------------------------------------------------------- |
| GET    | `/produtos`      | Lista produtos. Aceita filtros `busca` (nome), `tipo`, `status` e `descricao`.     |
| GET    | `/produtos/:id`  | Retorna o produto pelo `id`. `404` se não existir.                                 |
| POST   | `/produtos`      | Cria um novo produto. `id` é gerado pelo backend. Responde com `201`.              |
| PUT    | `/produtos/:id`  | Atualiza um produto existente. `404` se não existir.                               |
| DELETE | `/produtos/:id`  | Remove o produto. Responde com `204`. `404` se não existir.                        |

### Validações

- `nome` e `tipo` são obrigatórios na criação/atualização — falha com `400`.
- `status` aceita apenas `disponivel`, `emprestado` ou `manutencao`.
- O `id` é gerado pelo servidor (`Math.max(0, ...ids) + 1`).

## Funcionalidades do frontend

- Tabela com os produtos vindos da API e filtros por nome/tipo/status/descrição.
- Formulário único que cria (POST) e edita (PUT) produtos.
- Botão **Editar** em cada linha — preenche o formulário com os dados do produto.
- Botão **Excluir** em cada linha — pede confirmação via `confirm()` antes do DELETE.
- Mensagens de sucesso/erro após cada operação.
- A tabela é recarregada automaticamente após qualquer alteração.
