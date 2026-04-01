# Code Connect Frontend

Frontend React + Vite + TypeScript para consumir a API do Code Connect.

## Stack

- React 19
- Vite 8
- TypeScript
- React Router
- Axios
- i18next (PT/EN)
- Tailwind CSS v4

## Funcionalidades V1

- Login e cadastro
- Feed de posts com busca
- Detalhe de post por slug
- Comentarios no post
- Criacao de post com upload de imagem (rota protegida)

## Configuracao

1. Copie o arquivo de ambiente:

```bash
cp .env.example .env
```

2. Ajuste a URL da API se necessario:

```env
VITE_API_URL=http://localhost:3000
```

## Rodando local

```bash
npm install
npm run dev
```

Frontend em `http://localhost:5173`

## Build

```bash
npm run build
```

## Deploy no Vercel

1. Importe este repositorio no Vercel.
2. Configure o projeto com Root Directory `frontend`.
3. Defina a variavel de ambiente:

```env
VITE_API_URL=https://seu-backend.up.railway.app
```

4. Execute o deploy.
5. Atualize no backend (`CORS_ORIGIN`) com a URL publica do Vercel.

## Observacoes

- O backend precisa estar rodando em paralelo.
- As rotas protegidas exigem token JWT retornado pelo backend.
- Em producao, o backend deve liberar CORS para a URL publica do Vercel.
