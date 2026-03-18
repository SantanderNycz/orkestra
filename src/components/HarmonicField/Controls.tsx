"use client";

import type { SemiTone, Mode, Extension } from "@/types/music";
import { ALL_NOTES, ALL_MODES, ALL_EXTENSIONS } from "@/lib/musicTheory";

interface ControlsProps {
  root: SemiTone;
  mode: Mode;
  extension: Extension;
  onRootChange: (root: SemiTone) => void;
  onModeChange: (mode: Mode) => void;
  onExtensionChange: (ext: Extension) => void;
  onTranspose: (dir: 1 | -1) => void;
}

export function Controls({
  root,
  mode,
  extension,
  onRootChange,
  onModeChange,
  onExtensionChange,
  onTranspose,
}: ControlsProps) {
  return (
    <div className="flex flex-wrap gap-4 items-end">
      {/* Tom */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] text-zinc-500 uppercase tracking-widest">
          Tom
        </label>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onTranspose(-1)}
            className="px-3 py-1.5 text-sm border border-zinc-700 rounded-md
                       hover:bg-zinc-800 transition-colors"
          >
            ←
          </button>
          <select
            value={root}
            onChange={(e) => onRootChange(Number(e.target.value) as SemiTone)}
            className="px-3 py-1.5 text-sm bg-zinc-900 border border-zinc-700
                       rounded-md focus:outline-none focus:border-zinc-500"
          >
            {ALL_NOTES.map((note, i) => (
              <option key={note} value={i}>
                {note}
              </option>
            ))}
          </select>
          <button
            onClick={() => onTranspose(1)}
            className="px-3 py-1.5 text-sm border border-zinc-700 rounded-md
                       hover:bg-zinc-800 transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* Modo */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] text-zinc-500 uppercase tracking-widest">
          Modo
        </label>
        <select
          value={mode}
          onChange={(e) => onModeChange(e.target.value as Mode)}
          className="px-3 py-1.5 text-sm bg-zinc-900 border border-zinc-700
                     rounded-md focus:outline-none focus:border-zinc-500"
        >
          {ALL_MODES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Extensão */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] text-zinc-500 uppercase tracking-widest">
          Extensão
        </label>
        <select
          value={extension}
          onChange={(e) => onExtensionChange(e.target.value as Extension)}
          className="px-3 py-1.5 text-sm bg-zinc-900 border border-zinc-700
                     rounded-md focus:outline-none focus:border-zinc-500"
        >
          {ALL_EXTENSIONS.map((ext) => (
            <option key={ext} value={ext}>
              {ext}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
