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
      <span className="text-[11px] text-zinc-500 uppercase tracking-widest">
        Progressões clássicas
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {CLASSIC_PRESETS.map((preset, i) => {
          const isActive = activePreset === i;
          return (
            <button
              key={preset.label}
              onClick={() => onSelect(i)}
              className={`
                text-left px-3 py-2 rounded-lg border text-sm
                transition-all duration-150
                hover:border-zinc-500
                focus:outline-none focus:ring-1 focus:ring-zinc-500
                ${
                  isActive
                    ? "border-amber-500 bg-amber-950"
                    : "border-zinc-700 bg-zinc-900"
                }
              `}
            >
              <div
                className={`text-[10px] mb-0.5 ${isActive ? "text-amber-500" : "text-zinc-500"}`}
              >
                {preset.genre}
              </div>
              <div
                className={`font-medium ${isActive ? "text-amber-300" : "text-zinc-100"}`}
              >
                {preset.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
