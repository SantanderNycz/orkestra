"use client";

import { useState } from "react";
import type { Chord, HarmonicField } from "@/types/music";
import { ALL_NOTES } from "@/lib/musicTheory";
import type { SemiTone, Mode } from "@/types/music";

interface TutorialProps {
  selectedChord: Chord | null;
  field: HarmonicField;
  root: SemiTone;
  mode: Mode;
}

export function Tutorial({ selectedChord, field, root, mode }: TutorialProps) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function explain(type: "chord" | "field") {
    setLoading(true);
    setError(null);
    setText(null);

    try {
      const res = await fetch("/api/tutorial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          chord: selectedChord,
          field,
          root: ALL_NOTES[root],
          mode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setText(data.text);
    } catch (e) {
      setError("Erro ao conectar ao agente. Tenta novamente.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Descrição */}
      <p className="text-sm text-zinc-400 leading-relaxed">
        O agente explica o acorde selecionado ou o campo harmônico completo em
        linguagem simples, com referências a músicas e artistas.
      </p>

      {/* Botões */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => explain("chord")}
          disabled={loading || !selectedChord}
          className="px-4 py-2 text-sm font-medium rounded-lg border
                     border-zinc-700 text-zinc-300
                     hover:border-zinc-500 hover:text-zinc-100
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors"
        >
          Explicar acorde selecionado
        </button>
        <button
          onClick={() => explain("field")}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium rounded-lg border
                     border-zinc-700 text-zinc-300
                     hover:border-zinc-500 hover:text-zinc-100
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors"
        >
          Explicar campo completo
        </button>
      </div>

      {/* Acorde atual */}
      {selectedChord && (
        <p className="text-xs text-zinc-600">
          Acorde selecionado:{" "}
          <span className="text-zinc-400 font-medium">
            {selectedChord.name} ({selectedChord.roman})
          </span>
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 py-4">
          <div
            className="w-4 h-4 rounded-full border-2 border-zinc-700
                          border-t-amber-500 animate-spin"
          />
          <span className="text-sm text-zinc-500">
            Preparando explicação...
          </span>
        </div>
      )}

      {/* Erro */}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* Resposta */}
      {text && !loading && (
        <div className="p-4 rounded-xl border border-zinc-700 bg-zinc-900">
          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {text}
          </p>
        </div>
      )}
    </div>
  );
}
