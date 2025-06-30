import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface PDIItem {
  name: string;
  level: number;
}

interface RequestBody {
  softSkills?: PDIItem[];
  hardSkills?: PDIItem[];
  tools?: PDIItem[];
}

const cache = new Map<string, any>();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  const body = (await request.json()) as RequestBody;
  const { softSkills = [], hardSkills = [], tools = [] } = body;

  const cacheKey = JSON.stringify(body);
  // if (cache.has(cacheKey)) {
  //   return NextResponse.json({ ...cache.get(cacheKey), source: "cache" });
  // }

  const prompt = `
  Gere uma lista abrangente de cursos e certificações reais e oficiais, disponibilizados por providers reconhecidos (Microsoft, AWS, Google Cloud, CertiProf, IBM, Oracle, etc.), focados unicamente nos itens fornecidos:
  - Soft Skills: ${softSkills
    .map((s) => `${s.name} (nível ${s.level})`)
    .join(", ")}
  - Hard Skills: ${hardSkills
    .map((h) => `${h.name} (nível ${h.level})`)
    .join(", ")}
  - Ferramentas: ${tools.map((t) => `${t.name} (nível ${t.level})`).join(", ")}

  Requisitos:
  1. Inclua apenas cursos e certificações existentes em sites oficiais.
  2. Retorne somente aqueles cujo nome ou descrição contenha exatamente um dos termos acima.
  3. Use descrições oficiais em Português do Brasil.
  4. Liste o provider exatamente como no site.
  5. Retorne a URL oficial.
  6. Se for gratuito, marque “Gratuito”; caso contrário informe o valor.
  7. Para cada item, retorne de 5 a 10 resultados.
  8. Busque cursos de Soft Skills em sites como SENAI, SENAC, Coursera, edX.
  9. Busque cursos de Ferramentas em sites como Udemy, Cursa, Alura.
  10. Considere o nível indicado para selecionar a dificuldade: níveis 1–2 sugerem cursos básicos; nível 3 intermediários; níveis 4–5 avançados.

  Saída (JSON puro):
  {
    "certifications": [
      {
        "name": string,
        "description": string,
        "languages": string[],
        "price": string,
        "url": string,
        "level": string,
        "provider": string
      },
      …
    ]
  }
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const fullText = (await response.text()).trim();

    const start = fullText.indexOf("{");
    const end = fullText.lastIndexOf("}");
    if (start === -1 || end === -1) {
      throw new Error(
        "Não foi possível localizar objeto JSON na resposta da IA"
      );
    }
    const jsonText = fullText.slice(start, end + 1);

    const data = JSON.parse(jsonText);
    cache.set(cacheKey, data);
    return NextResponse.json({ ...data, source: "IA" });
  } catch (err: any) {
    console.error("Erro na API Gemini:", err.message);
    return NextResponse.json(
      { error: "Erro interno ao processar a solicitação" },
      { status: 500 }
    );
  }
}
