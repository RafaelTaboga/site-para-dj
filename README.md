# 🎵 Site para DJ — SaaS Multi-tenant

Plataforma completa para DJs criarem sites profissionais, receberem propostas e gerenciarem tudo com IA.

## Stack
- **Next.js 14** (App Router, SSR/ISR)
- **Prisma + PostgreSQL** (multi-tenant via userId)
- **NextAuth v5** (JWT, Credentials)
- **Stripe** (checkout + webhooks)
- **Resend** (e-mail transacional)
- **OpenAI GPT-4o** (secretária IA)
- **Uploadthing** (upload de mídia)
- **Tailwind CSS** (dark mode + CSS variables)

## Setup

```bash
# 1. Clone e instale dependências
npm install

# 2. Configure variáveis de ambiente
cp .env.example .env.local
# Preencha todas as chaves no .env.local

# 3. Suba o banco de dados (usando Neon, Supabase ou local)
npx prisma migrate dev --name init

# 4. Rode o seed (cria usuário demo)
npm run db:seed

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

## Credenciais Demo (após seed)
- **E-mail:** djkauan@demo.com
- **Senha:** demo1234
- **Site público:** http://localhost:3000/dj-kauan

## Webhook Stripe (desenvolvimento)
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Estrutura Multi-tenant
- Cada DJ = 1 `User` com `slug` único
- Site público: `/{slug}`
- Toda query inclui `userId` como filtro obrigatório
- Isolamento total entre tenants no nível do banco

## Arquitetura de Arquivos
```
src/
├── app/
│   ├── (auth)/           # Login, Register
│   ├── (dashboard)/      # Painel do DJ (protegido)
│   ├── [slug]/           # Site público do DJ (ISR)
│   └── api/              # API Routes
├── components/
│   ├── dashboard/        # Componentes do painel
│   ├── public/           # Componentes do site público
│   └── ui/               # Componentes de UI base
└── lib/                  # Prisma, Auth, Stripe, OpenAI, Resend
```

## Variáveis de Ambiente Necessárias
Veja `.env.example` para a lista completa.

## Deploy
1. Suba o código no GitHub
2. Importe no Vercel
3. Configure as variáveis de ambiente no painel da Vercel
4. Configure o webhook do Stripe apontando para `https://seudominio.com/api/stripe/webhook`
5. Execute `npx prisma migrate deploy` na primeira deploy
