"use client";

import type { HarmonicField, Chord } from "@/types/music";

// Cores por qualidade de acorde
const QUALITY_STYLES: Record<
  string,
  {
    base: string;
    selected: string;
    roman: string;
    name: string;
    label: string;
  }
> = {
  // Maior / dominante → âmbar
  maj: {
    base: "border-zinc-700 bg-zinc-900",
    selected: "border-amber-500 bg-amber-950",
    roman: "text-amber-400",
    name: "text-amber-300",
    label: "text-amber-600",
  },
  maj7: {
    base: "border-zinc-700 bg-zinc-900",
    selected: "border-amber-500 bg-amber-950",
    roman: "text-amber-400",
    name: "text-amber-300",
    label: "text-amber-600",
  },
  maj9: {
    base: "border-zinc-700 bg-zinc-900",
    selected: "border-amber-500 bg-amber-950",
    roman: "text-amber-400",
    name: "text-amber-300",
    label: "text-amber-600",
  },
  dom7: {
    base: "border-zinc-700 bg-zinc-900",
    selected: "border-amber-500 bg-amber-950",
    roman: "text-amber-400",
    name: "text-amber-300",
    label: "text-amber-600",
  },
  dom9: {
    base: "border-zinc-700 bg-zinc-900",
    selected: "border-amber-500 bg-amber-950",
    roman: "text-amber-400",
    name: "text-amber-300",
    label: "text-amber-600",
  },
  // Menor → azul
  min: {
    base: "border-zinc-700 bg-zinc-900",
    selected: "border-blue-500 bg-blue-950",
    roman: "text-blue-400",
    name: "text-blue-300",
    label: "text-blue-600",
  },
  m7: {
    base: "border-zinc-700 bg-zinc-900",
    selected: "border-blue-500 bg-blue-950",
    roman: "text-blue-400",
    name: "text-blue-300",
    label: "text-blue-600",
  },
  m9: {
    base: "border-zinc-700 bg-zinc-900",
    selected: "border-blue-500 bg-blue-950",
    roman: "text-blue-400",
    name: "text-blue-300",
    label: "text-blue-600",
  },
  mMaj7: {
    base: "border-zinc-700 bg-zinc-900",
    selected: "border-blue-500 bg-blue-950",
    roman: "text-blue-400",
    name: "text-blue-300",
    label: "text-blue-600",
  },
  // Diminuto → vermelho
  dim: {
    base: "border-zinc-700 bg-zinc-900",
    selected: "border-red-500 bg-red-950",
    roman: "text-red-400",
    name: "text-red-300",
    label: "text-red-600",
  },
  hDim: {
    base: "border-zinc-700 bg-zinc-900",
    selected: "border-red-500 bg-red-950",
    roman: "text-red-400",
    name: "text-red-300",
    label: "text-red-600",
  },
  dim7: {
    base: "border-zinc-700 bg-zinc-900",
    selected: "border-red-500 bg-red-950",
    roman: "text-red-400",
    name: "text-red-300",
    label: "text-red-600",
  },
  hDim9: {
    base: "border-zinc-700 bg-zinc-900",
    selected: "border-red-500 bg-red-950",
    roman: "text-red-400",
    name: "text-red-300",
    label: "text-red-600",
  },
  // Aumentado → verde
  aug: {
    base: "border-zinc-700 bg-zinc-900",
    selected: "border-green-500 bg-green-950",
    roman: "text-green-400",
    name: "text-green-300",
    label: "text-green-600",
  },
};

const QUALITY_LABELS: Record<string, string> = {
  maj: "Maior",
  maj7: "Maior 7ª",
  maj9: "Maior 9ª",
  dom7: "Dom. 7ª",
  dom9: "Dom. 9ª",
  min: "Menor",
  m7: "Menor 7ª",
  m9: "Menor 9ª",
  mMaj7: "Men. Maj 7ª",
  dim: "Diminuto",
  hDim: "Semi-dim.",
  dim7: "Dim. 7ª",
  hDim9: "Semi-dim. 9ª",
  aug: "Aumentado",
};

function getStyles(qual: string) {
  return QUALITY_STYLES[qual] ?? QUALITY_STYLES.maj;
}

// ─── Chip individual ──────────────────────────────────────────────────────────

interface ChordChipProps {
  chord: Chord;
  isSelected: boolean;
  isInProg: boolean;
  onClick: (chord: Chord) => void;
}

function ChordChip({ chord, isSelected, isInProg, onClick }: ChordChipProps) {
  const s = getStyles(chord.qual);
  const active = isSelected || isInProg;

  return (
    <button
      onClick={() => onClick(chord)}
      className={`
        flex-1 min-w-18 rounded-lg px-3 py-2.5 text-left
        border transition-all duration-150
        hover:-translate-y-0.5 hover:border-zinc-500
        focus:outline-none focus:ring-1 focus:ring-zinc-500
        ${active ? s.selected : s.base}
      `}
    >
      {/* Numeral romano */}
      <div
        className={`text-[10px] font-medium mb-1 ${active ? s.roman : "text-zinc-500"}`}
      >
        {chord.roman}
      </div>

      {/* Nome do acorde */}
      <div
        className={`text-[15px] font-medium ${active ? s.name : "text-zinc-100"}`}
      >
        {chord.name}
      </div>

      {/* Qualidade */}
      <div
        className={`text-[10px] mt-0.5 ${active ? s.label : "text-zinc-600"}`}
      >
        {QUALITY_LABELS[chord.qual] ?? ""}
      </div>

      {/* Notas */}
      <div className="text-[10px] text-zinc-600 mt-1.5">
        {chord.notes.join(" – ")}
      </div>
    </button>
  );
}

// lista de chips

interface FieldChipsProps {
  field: HarmonicField;
  selectedDegree: number;
  progressionDegrees: Set<number>;
  onSelect: (chord: Chord) => void;
}

export function FieldChips({
  field,
  selectedDegree,
  progressionDegrees,
  onSelect,
}: FieldChipsProps) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {field.map((chord) => (
        <ChordChip
          key={chord.deg}
          chord={chord}
          isSelected={chord.deg === selectedDegree}
          isInProg={progressionDegrees.has(chord.deg)}
          onClick={onSelect}
        />
      ))}
    </div>
  );
}
