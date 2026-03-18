import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Campo query obrigatório" },
        { status: 400 },
      );
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: `Você é um especialista em teoria musical. Quando receber o nome de um artista ou música, analise o estilo harmônico e responda APENAS com JSON válido, sem markdown, sem texto antes ou depois.

O JSON deve ter exatamente este formato:
{
  "root": <número 0-11, onde 0=C, 1=C#, 2=D, 3=D#, 4=E, 5=F, 6=F#, 7=G, 8=G#, 9=A, 10=A#, 11=B>,
  "mode": <"Maior" | "Menor" | "Dórico" | "Frígio" | "Lídio" | "Mixolídio" | "Lócrio">,
  "mood": <"Alegre" | "Relaxado" | "Neutro" | "Melancólico" | "Saudade" | "Tenso" | "Épico" | "Místico" | "Enérgico" | "Romântico">,
  "extension": <"tríade" | "7ª" | "9ª">,
  "progression": <array de 3-5 números 0-6 representando graus da escala>,
  "description": <string em português brasileiro, 2-3 frases sobre o estilo harmônico>,
  "tags": <array de 3-5 strings curtas descrevendo o estilo, ex: ["Bossa Nova", "Modo menor", "7ths suaves"]>
}`,
      messages: [
        {
          role: "user",
          content: `Analisa o estilo harmônico de: ${query}`,
        },
      ],
    });

    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    const clean = text.replace(/```json|```/g, "").trim();
    const preset = JSON.parse(clean);

    return NextResponse.json({ preset });
  } catch (error) {
    console.error("[sounds-like]", error);
    return NextResponse.json(
      { error: "Erro ao analisar o estilo" },
      { status: 500 },
    );
  }
}
