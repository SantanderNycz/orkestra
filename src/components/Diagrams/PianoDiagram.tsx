"use client";

import { noteNameToSemi } from "@/lib/musicTheory";

// Constantes do teclado

const WHITE_SEMITONES = [0, 2, 4, 5, 7, 9, 11]; // C D E F G A B
const BLACK_POSITIONS = [
  { whiteIndex: 0, semi: 1 }, // C#
  { whiteIndex: 1, semi: 3 }, // D#
  { whiteIndex: 3, semi: 6 }, // F#
  { whiteIndex: 4, semi: 8 }, // G#
  { whiteIndex: 5, semi: 10 }, // A#
];
const WHITE_NOTE_NAMES = ["C", "D", "E", "F", "G", "A", "B"];
const BLACK_NOTE_NAMES: Record<number, string> = {
  1: "C#",
  3: "D#",
  6: "F#",
  8: "G#",
  10: "A#",
};

// Dimensões (px)
const W_KEY = 22;
const H_KEY = 70;
const H_BLK = 44;
const W_BLK = 13;
const OFFSET_Y = 16; // espaço no topo para labels
const OCTAVES = 2;

// Cores por qualidade

const QUALITY_COLORS: Record<
  string,
  { fill: string; text: string; black: string }
> = {
  maj: { fill: "#451a03", text: "#fbbf24", black: "#92400e" },
  maj7: { fill: "#451a03", text: "#fbbf24", black: "#92400e" },
  maj9: { fill: "#451a03", text: "#fbbf24", black: "#92400e" },
  dom7: { fill: "#451a03", text: "#fbbf24", black: "#92400e" },
  dom9: { fill: "#451a03", text: "#fbbf24", black: "#92400e" },
  min: { fill: "#172554", text: "#60a5fa", black: "#1e3a8a" },
  m7: { fill: "#172554", text: "#60a5fa", black: "#1e3a8a" },
  m9: { fill: "#172554", text: "#60a5fa", black: "#1e3a8a" },
  mMaj7: { fill: "#172554", text: "#60a5fa", black: "#1e3a8a" },
  dim: { fill: "#450a0a", text: "#f87171", black: "#7f1d1d" },
  hDim: { fill: "#450a0a", text: "#f87171", black: "#7f1d1d" },
  dim7: { fill: "#450a0a", text: "#f87171", black: "#7f1d1d" },
  hDim9: { fill: "#450a0a", text: "#f87171", black: "#7f1d1d" },
  aug: { fill: "#052e16", text: "#4ade80", black: "#14532d" },
};

function getColors(qual: string) {
  return QUALITY_COLORS[qual] ?? QUALITY_COLORS.maj;
}

// Componente

interface PianoDiagramProps {
  notes: string[];
  qual: string;
}

export function PianoDiagram({ notes, qual }: PianoDiagramProps) {
  const colors = getColors(qual);
  const activeSemis = new Set(notes.map((n) => noteNameToSemi(n)));
  const totalWidth = OCTAVES * 7 * W_KEY + 2;
  const totalHeight = H_KEY + OFFSET_Y + 8;

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      aria-label={`Teclado mostrando as notas ${notes.join(", ")}`}
    >
      {/* Teclas brancas */}
      {Array.from({ length: OCTAVES }, (_, oct) =>
        WHITE_SEMITONES.map((semi, wi) => {
          const x = (oct * 7 + wi) * W_KEY;
          const isActive = activeSemis.has(semi);

          return (
            <g key={`w-${oct}-${wi}`}>
              <rect
                x={x}
                y={OFFSET_Y}
                width={W_KEY - 1}
                height={H_KEY}
                rx={2}
                fill={isActive ? colors.fill : "#fefce8"}
                stroke="#a8a29e"
                strokeWidth={0.5}
              />
              {isActive && (
                <text
                  x={x + W_KEY / 2}
                  y={OFFSET_Y + H_KEY - 8}
                  textAnchor="middle"
                  fontSize={8}
                  fontFamily="var(--font-geist-sans, sans-serif)"
                  fontWeight={500}
                  fill={colors.text}
                >
                  {WHITE_NOTE_NAMES[wi]}
                </text>
              )}
            </g>
          );
        }),
      )}

      {/* Teclas pretas */}
      {Array.from({ length: OCTAVES }, (_, oct) =>
        BLACK_POSITIONS.map(({ whiteIndex, semi }) => {
          const x = (oct * 7 + whiteIndex) * W_KEY + W_KEY - W_BLK / 2;
          const isActive = activeSemis.has(semi);

          return (
            <g key={`b-${oct}-${semi}`}>
              <rect
                x={x}
                y={OFFSET_Y}
                width={W_BLK}
                height={H_BLK}
                rx={1.5}
                fill={isActive ? colors.black : "#1c1917"}
              />
              {isActive && (
                <text
                  x={x + W_BLK / 2}
                  y={OFFSET_Y + H_BLK - 7}
                  textAnchor="middle"
                  fontSize={7}
                  fontFamily="var(--font-geist-sans, sans-serif)"
                  fontWeight={500}
                  fill="white"
                >
                  {BLACK_NOTE_NAMES[semi]}
                </text>
              )}
            </g>
          );
        }),
      )}
    </svg>
  );
}
