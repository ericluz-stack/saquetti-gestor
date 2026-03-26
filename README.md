# Saquetti Gestor

Sistema de gestão de ponto eletrônico e RH da **Saquetti Enterprises LTD**, desenvolvido com Nuxt 4, Vue 3 e Tailwind CSS.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Nuxt 4 + Vue 3 |
| Estilização | Tailwind CSS (sem biblioteca de UI externa) |
| Banco de dados | SQLite via Drizzle ORM + better-sqlite3 |
| Autenticação | Sessões com cookie httpOnly |
| Hashing de senha | bcryptjs (12 rounds) |
| Linguagem | TypeScript (full-stack) |

---

## Pré-requisitos

- Node.js 20+
- npm

---

## Instalação

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env
```

### Variáveis de ambiente (`.env`)

```env
DATABASE_URL=./data/saquetti.db
NUXT_SESSION_SECRET=troque-por-uma-string-segura-em-producao
```

> Em produção, gere um valor aleatório para `NUXT_SESSION_SECRET` com `openssl rand -base64 32`.

---

## Executar em desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### Credenciais de desenvolvimento

| E-mail | Senha | Papel |
|--------|-------|-------|
| admin@saquetti.com.br | Admin@123 | admin |
| gerente@saquetti.com.br | Gerente@123 | gerente |

---

## Build para produção

```bash
npm run build
npm run preview
```

---

## Estrutura do projeto

```
├── app/
│   ├── assets/css/        # Tokens de design (CSS variables)
│   ├── composables/       # useAuth, useAppColorMode
│   ├── layouts/           # auth.vue, default.vue (sidebar + topbar)
│   ├── middleware/        # auth.ts, guest.ts
│   ├── pages/             # login, recuperar-senha, dashboard
│   └── utils/             # apiErroUsuario.ts
├── server/
│   ├── api/auth/          # login, logout, me, esqueci-senha
│   ├── db/                # schema Drizzle + inicialização SQLite
│   ├── plugins/           # db.ts (usuários padrão)
│   └── utils/             # sessao.ts (gerenciamento de sessões)
├── public/                # Assets estáticos
├── .env.example           # Template de variáveis de ambiente
├── drizzle.config.ts      # Configuração do Drizzle ORM
└── nuxt.config.ts         # Configuração do Nuxt
```

---

## Funcionalidades implementadas

- [x] Autenticação com e-mail e senha
- [x] Sessões persistidas no banco de dados (cookie httpOnly)
- [x] "Lembrar de mim" (sessão de 30 dias vs 8 horas)
- [x] Middleware de proteção de rotas (auth + guest)
- [x] Recuperação de senha (geração de token — envio de e-mail pendente)
- [x] Layout principal com sidebar colapsável + topbar
- [x] Modo escuro (dark mode) com persistência em localStorage
- [x] Dashboard com métricas, gráficos CSS/SVG e tabela paginada
- [x] Transições de página suaves

## Roadmap

- [ ] Integração com serviço de e-mail (Resend) para recuperação de senha
- [ ] Módulo de funcionários (cadastro, edição, listagem)
- [ ] Registro de ponto eletrônico
- [ ] Relatórios de frequência
- [ ] Gestão de escalas e turnos
- [ ] Módulo financeiro
- [ ] Exportação de relatórios (PDF, Excel)

---

## Notas de produção

- Habilitar `secure: true` no cookie de sessão (requer HTTPS)
- Substituir `NUXT_SESSION_SECRET` por valor seguro
- Remover ou alterar credenciais padrão em `server/plugins/db.ts`
- Configurar rate limiting nas rotas de autenticação
- Agendar limpeza de sessões expiradas (`limparSessoesExpiradas`)
