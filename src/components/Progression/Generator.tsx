"use client";

import type { ProgressionOptions, Mood, Direction } from "@/types/music";
import { ALL_MOODS } from "@/lib/musicTheory";

interface GeneratorProps {
  options: ProgressionOptions;
  onChange: (opts: Partial<ProgressionOptions>) => void;
  onGenerate: () => void;
}

export function Generator({ options, onChange, onGenerate }: GeneratorProps) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border border-zinc-700 bg-zinc-900">
      <span className="text-[11px] text-zinc-500 uppercase tracking-widest">
        Gerador
      </span>

      {/* Quantidade de acordes */}
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm text-zinc-400">Acordes</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={2}
            max={8}
            value={options.count}
            onChange={(e) => onChange({ count: Number(e.target.value) })}
            className="w-24 accent-amber-500"
          />
          <span className="text-sm font-medium text-zinc-200 w-3 text-right">
            {options.count}
          </span>
        </div>
      </div>

      {/* Direção */}
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm text-zinc-400">Direção</label>
        <select
          value={options.direction}
          onChange={(e) => onChange({ direction: e.target.value as Direction })}
          className="text-sm bg-zinc-800 border border-zinc-700 rounded-md
                     px-2 py-1 focus:outline-none focus:border-zinc-500"
        >
          <option value="random">Aleatório</option>
          <option value="asc">Crescente</option>
          <option value="desc">Decrescente</option>
        </select>
      </div>

      {/* Humor */}
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm text-zinc-400">Humor</label>
        <select
          value={options.mood}
          onChange={(e) => onChange({ mood: e.target.value as Mood })}
          className="text-sm bg-zinc-800 border border-zinc-700 rounded-md
                     px-2 py-1 focus:outline-none focus:border-zinc-500"
        >
          {ALL_MOODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Toggle diminutos */}
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm text-zinc-400">Diminutos</label>
        <button
          role="switch"
          aria-checked={options.includeDiminished}
          onClick={() =>
            onChange({ includeDiminished: !options.includeDiminished })
          }
          className={`
            relative w-8 h-4.5 rounded-full transition-colors duration-200
            focus:outline-none focus:ring-1 focus:ring-zinc-500
            ${options.includeDiminished ? "bg-amber-500" : "bg-zinc-600"}
          `}
        >
          <span
            className={`
              absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full
              transition-all duration-200
              ${options.includeDiminished ? "left-4.5" : "left-0.5"}
            `}
          />
        </button>
      </div>

      {/* Botão gerar */}
      <button
        onClick={onGenerate}
        className="w-full py-2 rounded-lg text-sm font-medium
                   bg-amber-500 hover:bg-amber-400 text-zinc-950
                   transition-colors duration-150
                   focus:outline-none focus:ring-1 focus:ring-amber-400"
      >
        Gerar progressão ↗
      </button>
    </div>
  );
}
