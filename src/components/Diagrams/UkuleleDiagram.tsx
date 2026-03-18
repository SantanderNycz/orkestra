"use client";

import type { Voicing } from "@/types/music";
import {
  findVoicing,
  UKULELE_TUNING,
  UKULELE_STRING_NAMES,
} from "@/lib/voicing";

// Constantes

const STRING_SPACING = 19;
const FRET_SPACING = 22;
const FRETS = 4;
const MARGIN_X = 18;
const MARGIN_Y = 30;
const MARGIN_RIGHT = 24;

const QUALITY_DOT_COLOR: Record<string, string> = {
  maj: "#b45309",
  maj7: "#b45309",
  maj9: "#b45309",
  dom7: "#b45309",
  dom9: "#b45309",
  min: "#1d4ed8",
  m7: "#1d4ed8",
  m9: "#1d4ed8",
  mMaj7: "#1d4ed8",
  dim: "#b91c1c",
  hDim: "#b91c1c",
  dim7: "#b91c1c",
  hDim9: "#b91c1c",
  aug: "#15803d",
};

function getDotColor(qual: string) {
  return QUALITY_DOT_COLOR[qual] ?? QUALITY_DOT_COLOR.maj;
}

// SVG

interface UkuleleSVGProps {
  voicing: Voicing;
  qual: string;
}

function UkuleleSVG({ voicing, qual }: UkuleleSVGProps) {
  const nStrings = voicing.length;
  const frettedNotes = voicing.filter((f) => f > 0);
  const maxFret = frettedNotes.length ? Math.max(...frettedNotes) : 4;
  const minFret = frettedNotes.length ? Math.min(...frettedNotes) : 1;
  const startFret = maxFret <= 4 ? 1 : minFret;
  const showNut = startFret === 1;
  const dotColor = getDotColor(qual);

  const svgW = MARGIN_X + (nStrings - 1) * STRING_SPACING + MARGIN_RIGHT;
  const svgH = MARGIN_Y + FRETS * FRET_SPACING + 16;

  const fretCounts: Record<number, number[]> = {};
  voicing.forEach((fret, si) => {
    if (fret > 0) {
      if (!fretCounts[fret]) fretCounts[fret] = [];
      fretCounts[fret].push(si);
    }
  });
  const barreMap: Record<number, number[]> = Object.fromEntries(
    Object.entries(fretCounts).filter(([, strings]) => strings.length >= 3),
  );

  return (
    <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
      {/* Trastes */}
      {Array.from({ length: FRETS + 1 }, (_, f) => {
        const y = MARGIN_Y + f * FRET_SPACING;
        const sw = f === 0 && showNut ? 3.5 : 0.5;
        return (
          <line
            key={`fret-${f}`}
            x1={MARGIN_X}
            y1={y}
            x2={MARGIN_X + (nStrings - 1) * STRING_SPACING}
            y2={y}
            stroke="#71717a"
            strokeWidth={sw}
          />
        );
      })}

      {/* Cordas + marcadores */}
      {voicing.map((fret, si) => {
        const x = MARGIN_X + si * STRING_SPACING;
        return (
          <g key={`string-${si}`}>
            <line
              x1={x}
              y1={MARGIN_Y}
              x2={x}
              y2={MARGIN_Y + FRETS * FRET_SPACING}
              stroke="#71717a"
              strokeWidth={0.5}
            />
            <text
              x={x}
              y={MARGIN_Y + FRETS * FRET_SPACING + 12}
              textAnchor="middle"
              fontSize={9}
              fill="#52525b"
              fontFamily="var(--font-geist-sans, sans-serif)"
            >
              {UKULELE_STRING_NAMES[si]}
            </text>

            {fret === -1 && (
              <text
                x={x}
                y={MARGIN_Y - 12}
                textAnchor="middle"
                fontSize={11}
                fill="#ef4444"
                fontFamily="var(--font-geist-sans, sans-serif)"
              >
                ✕
              </text>
            )}

            {fret === 0 && (
              <circle
                cx={x}
                cy={MARGIN_Y - 12}
                r={5}
                fill="none"
                stroke="#71717a"
                strokeWidth={1.2}
              />
            )}

            {fret > 0 &&
              !barreMap[fret] &&
              (() => {
                const df = fret - startFret + 1;
                if (df < 1 || df > FRETS) return null;
                const fy = MARGIN_Y + (df - 0.5) * FRET_SPACING;
                return <circle cx={x} cy={fy} r={7} fill={dotColor} />;
              })()}
          </g>
        );
      })}

      {/* Barres */}
      {Object.entries(barreMap).map(([fretStr, strings]) => {
        const fret = Number(fretStr);
        const df = fret - startFret + 1;
        if (df < 1 || df > FRETS) return null;
        const fy = MARGIN_Y + (df - 0.5) * FRET_SPACING;
        const x1 = MARGIN_X + strings[0] * STRING_SPACING;
        const x2 = MARGIN_X + strings[strings.length - 1] * STRING_SPACING;
        return (
          <rect
            key={`barre-${fret}`}
            x={x1 - 7}
            y={fy - 7}
            width={x2 - x1 + 14}
            height={14}
            rx={7}
            fill={dotColor}
          />
        );
      })}

      {!showNut && frettedNotes.length > 0 && (
        <text
          x={MARGIN_X + (nStrings - 1) * STRING_SPACING + 7}
          y={MARGIN_Y + 8}
          fontSize={10}
          fill="#71717a"
          fontFamily="var(--font-geist-sans, sans-serif)"
        >
          {startFret}fr
        </text>
      )}
    </svg>
  );
}

// Componente principal

interface UkuleleDiagramProps {
  notes: string[];
  qual: string;
}

export function UkuleleDiagram({ notes, qual }: UkuleleDiagramProps) {
  const voicing = findVoicing(UKULELE_TUNING, notes);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] text-zinc-500 uppercase tracking-widest">
        Ukulele — GCEA
      </span>
      <UkuleleSVG voicing={voicing} qual={qual} />
    </div>
  );
}
