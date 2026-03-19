"use client";

import { CLASSIC_PRESETS } from "@/lib/musicTheory";

interface ClassicPresetsProps {
  activePreset: number; // -1 = nenhum ativo
  onSelect: (index: number) => void;
}

export function ClassicPresets({
  activePreset,
  onSelect,
}: ClassicPresetsProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] text-zinc-600 uppercase tracking-widest">
        Progressões clássicas
      </span>
      <div className="flex flex-wrap gap-1.5">
        {CLASSIC_PRESETS.map((preset, i) => {
          const isActive = activePreset === i;
          return (
            <button
              key={preset.label}
              onClick={() => onSelect(i)}
              className={`
              px-3 py-1.5 rounded-full text-xs border
              transition-all duration-150
              focus:outline-none
              ${
                isActive
                  ? "border-amber-600 bg-amber-950 text-amber-300"
                  : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
              }
            `}
            >
              <span
                className={`${isActive ? "text-amber-500" : "text-zinc-600"} mr-1`}
              >
                {preset.genre}
              </span>
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
