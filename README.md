# Dashboard de Busca de Certificações com IA

Este projeto permite buscar informações sobre cursos e certificações de tecnologia a partir das habilidades adicionadas pelo usuário (Soft Skills, Hard Skills e Ferramentas). Os dados são obtidos via API baseada em IA (Google Gemini) e exibidos de forma estruturada.

## Tecnologias

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- ESLint
- Google Gemini API
- Cache em memória (Map)

## Funcionalidades

- Seções de entrada para Soft Skills, Hard Skills e Ferramentas
  - Campo de texto para nome
  - Select de nível (1–5)
  - Botão “Adicionar”
  - Lista de itens adicionados com botão “Remover”
- Botão “Buscar” para enviar apenas as habilidades de nível mais baixo
- Rota API (`/api/search`) que gera prompt agregando apenas as skills fracas
- Cards responsivos para exibir:
  - Nome do curso ou certificação
  - Descrição em português
  - Idiomas disponíveis
  - Nível de dificuldade (básico/intermediário/avançado)
  - Preço estimado ou “Gratuito”
  - Link oficial
  - Provedor real (Microsoft, AWS, Google Cloud, etc.)

## Como Funciona

1. O usuário adiciona Soft Skills, Hard Skills e Ferramentas, definindo nível de 1 a 5.
2. Ao clicar em **Buscar**, o front calcula as habilidades de nível mais baixo em cada categoria.
3. A API verifica o cache (Map) usando o payload JSON das skills fracas.
4. Se não estiver em cache, gera prompt customizado e consulta o modelo Gemini.
5. Retorna lista abrangente de 5–10 cursos/certificações reais por habilidade.
6. Exibe resultados em cards, sem fonte de origem exibida no front.

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

