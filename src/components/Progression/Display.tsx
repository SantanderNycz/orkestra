"use client";

import type { Progression, Chord } from "@/types/music";

const QUALITY_STYLES: Record<
  string,
  { card: string; roman: string; name: string; notes: string }
> = {
  maj: {
    card: "border-amber-500 bg-amber-950",
    roman: "text-amber-500",
    name: "text-amber-300",
    notes: "text-amber-700",
  },
  maj7: {
    card: "border-amber-500 bg-amber-950",
    roman: "text-amber-500",
    name: "text-amber-300",
    notes: "text-amber-700",
  },
  maj9: {
    card: "border-amber-500 bg-amber-950",
    roman: "text-amber-500",
    name: "text-amber-300",
    notes: "text-amber-700",
  },
  dom7: {
    card: "border-amber-500 bg-amber-950",
    roman: "text-amber-500",
    name: "text-amber-300",
    notes: "text-amber-700",
  },
  dom9: {
    card: "border-amber-500 bg-amber-950",
    roman: "text-amber-500",
    name: "text-amber-300",
    notes: "text-amber-700",
  },
  min: {
    card: "border-blue-500 bg-blue-950",
    roman: "text-blue-500",
    name: "text-blue-300",
    notes: "text-blue-700",
  },
  m7: {
    card: "border-blue-500 bg-blue-950",
    roman: "text-blue-500",
    name: "text-blue-300",
    notes: "text-blue-700",
  },
  m9: {
    card: "border-blue-500 bg-blue-950",
    roman: "text-blue-500",
    name: "text-blue-300",
    notes: "text-blue-700",
  },
  mMaj7: {
    card: "border-blue-500 bg-blue-950",
    roman: "text-blue-500",
    name: "text-blue-300",
    notes: "text-blue-700",
  },
  dim: {
    card: "border-red-500 bg-red-950",
    roman: "text-red-500",
    name: "text-red-300",
    notes: "text-red-700",
  },
  hDim: {
    card: "border-red-500 bg-red-950",
    roman: "text-red-500",
    name: "text-red-300",
    notes: "text-red-700",
  },
  dim7: {
    card: "border-red-500 bg-red-950",
    roman: "text-red-500",
    name: "text-red-300",
    notes: "text-red-700",
  },
  hDim9: {
    card: "border-red-500 bg-red-950",
    roman: "text-red-500",
    name: "text-red-300",
    notes: "text-red-700",
  },
  aug: {
    card: "border-green-500 bg-green-950",
    roman: "text-green-500",
    name: "text-green-300",
    notes: "text-green-700",
  },
};

function getStyles(qual: string) {
  return QUALITY_STYLES[qual] ?? QUALITY_STYLES.maj;
}

interface ProgressionCardProps {
  chord: Chord;
  isActive: boolean; // sendo tocado agora
}

function ProgressionCard({ chord, isActive }: ProgressionCardProps) {
  const s = getStyles(chord.qual);
  return (
    <div
      className={`
        rounded-lg border px-4 py-3 text-center w-full
        transition-all duration-150
        ${s.card}
        ${isActive ? "scale-105 shadow-lg shadow-amber-900/30" : ""}
      `}
    >
      <div className={`text-[10px] font-medium mb-1 ${s.roman}`}>
        {chord.roman}
      </div>
      <div className={`text-lg font-medium ${s.name}`}>{chord.name}</div>
      <div className={`text-[10px] mt-1 ${s.notes}`}>
        {chord.notes.join(" – ")}
      </div>
    </div>
  );
}

interface DisplayProps {
  progression: Progression;
  activeIndex: number | null;
}

export function Display({ progression, activeIndex }: DisplayProps) {
  if (progression.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-20
                      rounded-xl border border-zinc-800 border-dashed"
      >
        <span className="text-sm text-zinc-600">
          Configure as opções e clique em Gerar ↗
        </span>
      </div>
    );
  }

  const romanSequence = progression.map((c) => c.roman).join(" → ");

  return (
    <div className="flex flex-col gap-3 w-full">
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${progression.length}, minmax(0, 1fr))`,
        }}
      >
        {progression.map((chord, i) => (
          <ProgressionCard key={i} chord={chord} isActive={activeIndex === i} />
        ))}
      </div>
      <div className="text-xs text-zinc-600 tracking-wide">{romanSequence}</div>
    </div>
  );
}
