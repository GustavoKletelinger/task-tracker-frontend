# Task Tracker — Frontend

Aplicação web (SPA) para gestão de tarefas, construída com React, TypeScript e shadcn/ui. Ela consome a API REST do projeto [Task Tracker API](https://github.com/GustavoKletelinger/-task-tracker-api) e implementa o CRUD completo de tarefas.

## Tecnologias

- React 19 e TypeScript (modo estrito), com Vite
- React Router DOM (rotas e layout compartilhado)
- Tailwind CSS 4 e shadcn/ui (Card, Button, Input, Label, Badge, Dialog, Select, Table, Skeleton e Sonner)
- Fetch API para o consumo da API REST

## Funcionalidades

- **Dashboard:** contadores (total, pendentes, em andamento e concluídas) e as tarefas em cards responsivos.
- **Tarefas:** tabela com cadastro, edição e exclusão. O formulário e a confirmação de exclusão abrem em janelas (Dialog).
- **Feedback visual:** estado de carregamento (Skeleton), estado vazio, mensagem de erro com botão para tentar novamente e notificações (toasts) de sucesso ou erro em cada operação.

## Pré-requisitos

- Node.js 20 ou superior
- pnpm
- A API do Task Tracker em execução (a publicada no Render ou uma local)

## Como executar

```bash
pnpm install
cp .env.example .env   # no Windows (cmd): copy .env.example .env
pnpm dev
```

A aplicação abre em `http://localhost:5173`.

### Variáveis de ambiente

| Variável | Descrição |
| --- | --- |
| `VITE_API_URL` | URL base da API REST, sem barra no final |

O `.env.example` aponta para a API local (`http://localhost:3000`). Para usar a API publicada, defina:

```
VITE_API_URL=https://task-tracker-api-w7xl.onrender.com
```

A API publicada roda no plano gratuito do Render, que dorme após alguns minutos sem uso. A primeira requisição pode levar cerca de 1 minuto.

### Usando a API local

Clone o repositório da [Task Tracker API](https://github.com/GustavoKletelinger/-task-tracker-api), siga o README dele para configurar o banco e rode `pnpm dev`. Ela sobe em `http://localhost:3000`.

## Scripts

| Comando | O que faz |
| --- | --- |
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Checagem de tipos e build de produção |
| `pnpm lint` | ESLint |
| `pnpm preview` | Visualiza o build de produção |

## Estrutura

```
src/
  components/        layout, formulário em Dialog e badges
    ui/              componentes do shadcn/ui
  hooks/             useTasks (estado e operações) e contexto de tarefas
  lib/               cliente HTTP, mensagens de erro e rótulos
  pages/             Dashboard e Tarefas
  types/             interfaces TypeScript da API
```

## Endpoints consumidos

| Operação | Método | Rota |
| --- | --- | --- |
| Listar | GET | `/tasks` |
| Criar | POST | `/tasks` |
| Atualizar | PUT | `/tasks/:id` |
| Excluir | DELETE | `/tasks/:id` |