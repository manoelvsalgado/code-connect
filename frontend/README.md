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

## Observacoes

- O backend precisa estar rodando em paralelo.
- As rotas protegidas exigem token JWT retornado pelo backend.
- O backend atual usa CORS para `http://localhost:5173`.
