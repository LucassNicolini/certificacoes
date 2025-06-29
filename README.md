# 🔍 Dashboard de Busca de Certificações com IA

Este projeto é um sistema web simples e funcional para buscar informações sobre certificações de tecnologia. Ao digitar um termo (ex: "Azure", "AWS", "Python"), o sistema utiliza uma API baseada em IA (Google Gemini) para buscar dados em fontes confiáveis e exibir os resultados de forma estruturada.

---

## 🚀 Tecnologias Utilizadas

- **Framework:** [Next.js](https://nextjs.org/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes de UI:** [shadcn/ui](https://ui.shadcn.com/)
- **Linting e Qualidade:** [ESLint](https://eslint.org/)
- **IA Generativa:** [Google Gemini API](https://ai.google.dev/)
- **Cache em memória:** Utilização de `Map` para armazenar os dados retornados pela IA e evitar chamadas repetidas.

---

## ✅ Funcionalidades

- Campo de busca com botão de acionamento.
- Integração com API própria (`/api/search`) que consulta o modelo Gemini.
- Filtro por **nível de certificação** e **idioma disponível**.
- Exibição dos resultados em **cards responsivos**, contendo:
  - Nome da certificação
  - Descrição (traduzida para português)
  - Idiomas disponíveis
  - Nível (Iniciante, Intermediário, Avançado)
  - Preço estimado
  - Link oficial
  - Provedor da certificação (Microsoft, Google, AWS...)

---

## ⚙️ Estrutura e Lógica

### Backend (API Route)

- Localizado em `/api/search`
- Consulta o modelo `gemini-1.5-flash`
- Utiliza um `prompt` estruturado solicitando resposta **em JSON puro**
- Implementa **cache com `Map<string, any>`** para economizar chamadas à API e melhorar performance
- Identifica se os dados vieram da IA ou do cache e adiciona a propriedade `source: "IA" | "cache"` à resposta

## 🔄 Cache

A camada de cache evita requisições desnecessárias à API da IA. A lógica é simples:

1. Verifica se o termo pesquisado já está armazenado no `Map`.
2. Se sim, retorna os dados do cache com `source: "cache"`.
3. Se não, realiza a requisição à IA, armazena no cache e retorna com `source: "IA"`.

---

## ▶️ Como Rodar Localmente

### 1. Pré-requisitos

- Node.js 18+
- Conta no Google Cloud com acesso à [Gemini API](https://ai.google.dev/)
- Chave da API (`GEMINI_API_KEY`) definida no `.env.local`

### 2. Instalação

```bash
git clone https://github.com/LucassNicolini/certificacoes.git
cd seu-repo
npm install
```
