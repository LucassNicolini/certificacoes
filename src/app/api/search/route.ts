import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const cache = new Map<string, any>();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query")?.toLowerCase().trim();

  if (!query) {
    return NextResponse.json(
      { error: "Parâmetro de busca é obrigatório" },
      { status: 400 }
    );
  }

  if (cache.has(query)) {
    console.log(`SERVINDO DO CACHE: ${query}`);
    const cachedData = cache.get(query);
    return NextResponse.json({ ...cachedData, source: "cache" });
  }

  console.log(`BUSCANDO DA IA: ${query}`);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Você é um assistente especialista em certificações de tecnologia.
      Sua tarefa é buscar informações sobre certificações relacionadas ao termo "${query}".
      Busque em fontes oficiais como Microsoft Learn, AWS Training and Certification, Google Cloud Skills Boost, etc.
      Retorne uma lista de certificações em formato JSON.
      O JSON deve ter uma chave principal "certifications" que contém um array de objetos.
      Cada objeto deve ter as seguintes chaves:
      - "name": O nome oficial da certificação (string).
      - "description": Uma breve descrição do que a certificação abrange. A descrição DEVE ser uma tradução para o Português do Brasil (string).
      - "languages": Um array de strings com os idiomas disponíveis para o exame (ex: ["Inglês", "Espanhol", "Português"]).
      - "price": O custo do exame de certificação. Se variar ou for gratuito, indique (string, ex: "USD 165", "Varia por região", "Gratuito").
      - "url": O link direto para a página oficial da certificação (string).
      - "level": O nível de dificuldade da certificação (ex: "Iniciante", "Intermediário", "Avançado") (string).
      - "provider": A empresa que oferece a certificação (ex: "Microsoft", "Amazon", "Google") (string).

      Se não encontrar nenhuma certificação, retorne um array vazio dentro da chave "certifications".
      Não inclua nenhuma explicação ou texto adicional fora do objeto JSON. A resposta DEVE ser apenas o JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const data = JSON.parse(jsonText);

    cache.set(query, data);

    return NextResponse.json({ ...data, source: "IA" });
  } catch (error) {
    console.error("Erro ao chamar a API da IA:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar a solicitação" },
      { status: 500 }
    );
  }
}
