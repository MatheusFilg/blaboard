<p align="center">
  <img src="assets/blaboard.png" alt="Blaboard - Kanban Board Open Source" width="600" />
</p>

<h1 align="center">Blaboard</h1>

<p align="center">
  <strong>Um Kanban Board open source feito pela comunidade, para a comunidade.</strong>
</p>

<p align="center">
  <a href="https://github.com/BeroLab/blaboard/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License MIT" />
  </a>
  <a href="https://berolab.app">
    <img src="https://img.shields.io/badge/comunidade-BeroLab-purple.svg" alt="BeroLab" />
  </a>
</p>

---

## Sobre o Projeto

O **Blaboard** é um quadro Kanban open source desenvolvido pela comunidade da [BeroLab](https://berolab.app). Este projeto foi criado com o objetivo de ajudar desenvolvedores iniciantes a terem sua primeira experiência com contribuição em projetos open source, enquanto construímos juntos uma ferramenta útil para gerenciamento de tarefas.

**Qualquer pessoa pode contribuir!** Seja você um desenvolvedor experiente ou alguém que está começando agora, você é bem-vindo(a) para participar.

## Tecnologias Utilizadas

Este projeto utiliza tecnologias modernas do ecossistema JavaScript/TypeScript:

| Categoria | Tecnologia |
|-----------|------------|
| **Runtime** | [Bun](https://bun.sh) |
| **Frontend** | [Next.js 16](https://nextjs.org) + [React 19](https://react.dev) |
| **Estilização** | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| **Backend** | [ElysiaJS](https://elysiajs.com) |
| **Banco de Dados** | [MongoDB](https://www.mongodb.com) + [Prisma ORM](https://www.prisma.io) |
| **Autenticação** | [Better Auth](https://www.better-auth.com) (Google e GitHub) |
| **Monorepo** | [Turborepo](https://turbo.build) |
| **Qualidade de Código** | [Biome](https://biomejs.dev) + [Husky](https://typicode.github.io/husky) |

## Estrutura do Projeto

```
blaboard/
├── apps/
│   ├── web/           # Aplicação frontend (Next.js)
│   └── server/        # API backend (ElysiaJS)
├── packages/
│   ├── auth/          # Configuração de autenticação
│   ├── db/            # Schema e configuração do banco de dados
│   ├── env/           # Variáveis de ambiente tipadas
│   └── config/        # Configurações compartilhadas
```

## Como Começar

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Bun](https://bun.sh) (versão 1.3.2 ou superior)
- [Docker](https://www.docker.com) (para rodar o MongoDB localmente)
- [Git](https://git-scm.com)

### Passo a Passo

#### 1. Faça um fork do repositório

Clique no botão "Fork" no canto superior direito desta página para criar uma cópia do repositório na sua conta.

#### 2. Clone o repositório

```bash
git clone https://github.com/SEU-USUARIO/blaboard.git
cd blaboard
```

#### 3. Instale as dependências

```bash
bun install
```

#### 4. Configure as variáveis de ambiente

Copie os arquivos de exemplo:

```bash
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
```

Edite os arquivos `.env` com suas configurações. Para autenticação social (Google/GitHub), você precisará criar aplicativos OAuth em:
- [Google Cloud Console](https://console.cloud.google.com)
- [GitHub Developer Settings](https://github.com/settings/developers)

#### 5. Inicie o banco de dados

```bash
bun run db:start     # Inicia o MongoDB no Docker
bun run db:generate  # Gera o cliente Prisma
bun run db:push      # Aplica o schema no banco
```

#### 6. Execute o projeto

```bash
bun run dev
```

Pronto! Acesse:
- **Frontend:** [http://localhost:3001](http://localhost:3001)
- **Backend:** [http://localhost:3000](http://localhost:3000)

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `bun run dev` | Inicia todas as aplicações em modo desenvolvimento |
| `bun run dev:web` | Inicia apenas o frontend |
| `bun run dev:server` | Inicia apenas o backend |
| `bun run build` | Compila todas as aplicações |
| `bun run check-types` | Verifica tipos TypeScript |
| `bun run check` | Formata e faz lint do código |
| `bun run db:start` | Inicia o container do MongoDB |
| `bun run db:push` | Aplica o schema no banco de dados |
| `bun run db:generate` | Gera o cliente Prisma |
| `bun run db:studio` | Abre a interface do Prisma Studio |
| `bun run db:stop` | Para o container do MongoDB |

## Como Contribuir

Estamos sempre procurando colaboradores! Veja como você pode participar:

### 1. Encontre uma issue

Acesse a aba [Issues](https://github.com/BeroLab/blaboard/issues) do repositório. Procure por issues com as labels:

- `good first issue` - Ideal para quem está começando
- `help wanted` - Precisamos de ajuda com essas

### 2. Comente na issue

Deixe um comentário dizendo que você quer trabalhar naquela issue. Isso evita que duas pessoas trabalhem na mesma coisa.

### 3. Crie sua branch

```bash
git checkout -b feat/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
```

### 4. Faça suas alterações

Desenvolva sua solução seguindo os padrões do projeto. Antes de commitar:

```bash
bun run check  # Formata e verifica o código
```

### 5. Envie um Pull Request

```bash
git add .
git commit -m "feat: descrição da sua alteração"
git push origin feat/nome-da-feature
```

Depois, abra um Pull Request no GitHub descrevendo suas alterações.

## Participe da Comunidade

### Reuniões Semanais

Fazemos reuniões **todas as quartas-feiras às 18h (horário de Brasília)** na nossa comunidade do Discord. Nessas reuniões discutimos:

- Progresso do projeto
- Novas features
- Dúvidas dos contribuidores
- Planejamento das próximas sprints

### Como entrar na comunidade

1. Acesse [berolab.app](https://berolab.app) e faça seu cadastro gratuito
2. Entre no nosso servidor do Discord
3. Apresente-se no canal de boas-vindas

Para mais informações, entre em contato pelo nosso servidor da BeroLab no Discord.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  Feito com carinho pela comunidade <a href="https://berolab.app">BeroLab</a>
</p>
