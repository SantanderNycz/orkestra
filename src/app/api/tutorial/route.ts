import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { type, chord, field, mode, root } = await req.json();

    if (!type) {
      return NextResponse.json(
        { error: "Campo type obrigatório" },
        { status: 400 },
      );
    }

    let prompt = "";

    if (type === "chord") {
      prompt = `Explica o acorde ${chord.name} (grau ${chord.roman} no campo de ${root} ${mode}).
Notas: ${chord.notes.join(", ")}.
Tipo: ${chord.qual}.
Máximo 150 palavras. Menciona músicas conhecidas que usam esse acorde se possível.`;
    }

    if (type === "field") {
      const chordList = field
        .map((c: { roman: string; name: string }) => `${c.roman} (${c.name})`)
        .join(", ");
      prompt = `Explica o campo harmônico de ${root} ${mode}.
Os acordes são: ${chordList}.
Máximo 200 palavras. Quais são as progressões mais comuns? Que tipo de música usa este modo? Menciona artistas ou músicas conhecidas.`;
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: `Você é um professor de teoria musical amigável e didático. 
Explica acordes e harmonia de forma simples, sem jargão excessivo, em português brasileiro. 
Seja conciso e prático. Use exemplos de músicas conhecidas quando relevante.
Nunca use markdown, listas ou asteriscos — escreva em texto corrido.`,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    return NextResponse.json({ text });
  } catch (error) {
    console.error("[tutorial]", error);
    return NextResponse.json(
      { error: "Erro ao gerar explicação" },
      { status: 500 },
    );
  }
}
