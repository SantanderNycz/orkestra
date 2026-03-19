"use client";

import { useState } from "react";
import type { SemiTone, Mode, Extension } from "@/types/music";

// Tipos

interface Preset {
  root: SemiTone;
  mode: Mode;
  extension: Extension;
  mood: string;
  progression: number[];
  description: string;
  tags: string[];
}

interface SoundsLikeProps {
  onApplyPreset: (preset: {
    root: SemiTone;
    mode: Mode;
    extension: Extension;
    progression: number[];
  }) => void;
}

// Sugestões rápidas

const SUGGESTIONS = [
  "Los Hermanos",
  "Radiohead",
  "Rubel",
  "Pink Floyd",
  "Chico Buarque",
  "The Beatles",
  "Elis Regina",
  "Caetano Veloso",
];

const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

// Componente

export function SoundsLike({ onApplyPreset }: SoundsLikeProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [preset, setPreset] = useState<Preset | null>(null);
  const [queryLabel, setQueryLabel] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function analyze(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setPreset(null);
    setQueryLabel(q);

    try {
      const res = await fetch("/api/sounds-like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPreset(data.preset);
    } catch (e) {
      setError("Não foi possível analisar. Tenta novamente.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Descrição */}
      <p className="text-sm text-zinc-400 leading-relaxed">
        Escreve o nome de um artista ou música. O agente analisa o estilo
        harmônico e configura o campo automaticamente.
      </p>

      {/* Input + botão */}
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && analyze(query)}
          placeholder="ex: Los Hermanos, Radiohead, Wish You Were Here..."
          className="flex-1 min-w-50 px-3 py-2 text-sm
                     bg-zinc-900 border border-zinc-700 rounded-lg
                     text-zinc-100 placeholder-zinc-600
                     focus:outline-none focus:border-zinc-500"
        />
        <button
          onClick={() => analyze(query)}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium rounded-lg
                     bg-amber-500 hover:bg-amber-400 text-zinc-950
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
        >
          {loading ? "Analisando..." : "Analisar"}
        </button>
      </div>

      {/* Sugestões rápidas */}
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => {
              setQuery(s);
              analyze(s);
            }}
            className="text-xs px-3 py-1.5 rounded-full border border-zinc-700
                       text-zinc-400 hover:border-zinc-500 hover:text-zinc-200
                       transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 py-4">
          <div
            className="w-4 h-4 rounded-full border-2 border-zinc-700
                          border-t-amber-500 animate-spin"
          />
          <span className="text-sm text-zinc-500">
            Analisando o estilo harmônico...
          </span>
        </div>
      )}

      {/* Erro */}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* Resultado */}
      {preset && !loading && (
        <div className="flex flex-col gap-4 p-4 rounded-xl border border-zinc-700 bg-zinc-900">
          {/* Nome da pesquisa */}
          <div className="text-[11px] text-zinc-500 uppercase tracking-widest">
            {queryLabel}
          </div>

          {/* Descrição */}
          <p className="text-sm text-zinc-300 leading-relaxed">
            {preset.description}
          </p>

          {/* Info do preset */}
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-zinc-500">
              Tom:{" "}
              <span className="text-zinc-200 font-medium">
                {NOTE_NAMES[preset.root]} {preset.mode}
              </span>
            </span>
            <span className="text-zinc-500">
              Extensão:{" "}
              <span className="text-zinc-200 font-medium">
                {preset.extension}
              </span>
            </span>
            <span className="text-zinc-500">
              Humor:{" "}
              <span className="text-zinc-200 font-medium">{preset.mood}</span>
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {preset.tags.map((tag, i) => {
              const colors = [
                "bg-amber-950 text-amber-400 border-amber-800",
                "bg-blue-950 text-blue-400 border-blue-800",
                "bg-green-950 text-green-400 border-green-800",
              ];
              return (
                <span
                  key={tag}
                  className={`text-[11px] px-2.5 py-1 rounded-full border font-medium
                    ${colors[i % colors.length]}`}
                >
                  {tag}
                </span>
              );
            })}
          </div>

          {/* Botão aplicar */}
          <button
            onClick={() =>
              onApplyPreset({
                root: preset.root,
                mode: preset.mode,
                extension: preset.extension,
                progression: preset.progression,
              })
            }
            className="self-start px-4 py-2 text-sm font-medium rounded-lg
                       bg-amber-500 hover:bg-amber-400 text-zinc-950
                       transition-colors"
          >
            Carregar preset no campo
          </button>
        </div>
      )}
    </div>
  );
}
