# Dashboard de Busca de Certificações com IA

Este projeto permite buscar informações sobre certificações de tecnologia a partir de um termo (por exemplo: Azure, AWS, Python). Os dados são obtidos via API baseada em IA (Google Gemini) e exibidos de forma estruturada.

## Tecnologias

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- ESLint
- Google Gemini API
- Cache em memória (Map)

## Funcionalidades

- Campo de busca com botão
- Rota API (`/api/search`) que consulta o modelo Gemini
- Filtros por nível de certificação e idioma
- Cards responsivos para exibir:
  - Nome da certificação
  - Descrição em português
  - Idiomas disponíveis
  - Nível (Iniciante, Intermediário, Avançado)
  - Preço estimado
  - Link oficial
  - Provedor (Microsoft, Google, AWS, etc.)

## Como Funciona

1. O usuário faz uma busca.
2. O servidor verifica o cache (Map).
3. Se não estiver em cache, consulta a IA e salva o resultado.
4. Retorna os dados com indicação da origem (cache ou IA).

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/LucassNicolini/certificacoes.git
   cd certificacoes
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env.local` com a chave da API:
   ```env
   GEMINI_API_KEY=SEU_TOKEN_AQUI
   ```
4. Rode em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse `http://localhost:3000` no navegador.
