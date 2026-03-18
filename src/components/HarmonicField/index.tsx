"use client";

import { useState } from "react";
import { useHarmonicField } from "@/hooks/useHarmonicField";
import { useAudio } from "@/hooks/useAudio";
import { Controls } from "./Controls";
import { FieldChips } from "./FieldChips";
import { ClassicPresets } from "./ClassicPresets";
import { Generator } from "@/components/Progression/Generator";
import { Display } from "@/components/Progression/Display";
import { PianoDiagram } from "@/components/Diagrams/PianoDiagram";
import { GuitarDiagram } from "@/components/Diagrams/GuitarDiagram";
import { UkuleleDiagram } from "@/components/Diagrams/UkuleleDiagram";
import { ALL_NOTES } from "@/lib/musicTheory";
import { SoundsLike } from "@/components/SoundsLike";
import { Tutorial } from "@/components/Tutorial";

// Labels
const STAB_NOTE: Record<string, string> = {
  dim: "Instável — pede resolução",
  hDim: "Instável — pede resolução",
  dim7: "Instável — pede resolução",
  hDim9: "Instável — pede resolução",
  aug: "Aumentado — tensão suspensa",
  maj: "Estável — tom de repouso",
  maj7: "Estável — tom de repouso",
  maj9: "Estável — tom de repouso",
  min: "Menor — cor mais sombria",
  m7: "Menor — cor mais sombria",
  m9: "Menor — cor mais sombria",
  mMaj7: "Menor — cor mais sombria",
};

const NOTE_ROLE_LABELS = ["Fundamental", "Terça", "Quinta", "Sétima", "Nona"];

const NOTE_COLOR: Record<string, string> = {
  maj: "text-amber-400",
  maj7: "text-amber-400",
  maj9: "text-amber-400",
  dom7: "text-amber-400",
  dom9: "text-amber-400",
  min: "text-blue-400",
  m7: "text-blue-400",
  m9: "text-blue-400",
  mMaj7: "text-blue-400",
  dim: "text-red-400",
  hDim: "text-red-400",
  dim7: "text-red-400",
  hDim9: "text-red-400",
  aug: "text-green-400",
};

// Tabs

type Tab = "campo" | "sounds" | "tutorial";

// Componente principal

export function HarmonicFieldApp() {
  const hf = useHarmonicField();
  const audio = useAudio();
  const [tab, setTab] = useState<Tab>("campo");

  const selectedChord = hf.selectedChord;
  const noteColor = selectedChord
    ? (NOTE_COLOR[selectedChord.qual] ?? "text-amber-400")
    : "text-amber-400";
  const stabNote = selectedChord ? (STAB_NOTE[selectedChord.qual] ?? "") : "";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-medium text-zinc-100 tracking-tight">
          Harmonic Field
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Explore campos harmônicos, gere progressões e visualize acordes
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-zinc-800">
        {(["campo", "sounds", "tutorial"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`
              px-4 py-2 text-sm border-b-2 transition-all duration-150
              focus:outline-none
              ${
                tab === t
                  ? "border-amber-500 text-zinc-100 font-medium"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }
            `}
          >
            {t === "campo"
              ? "Campo Harmônico"
              : t === "sounds"
                ? "Sounds like..."
                : "Tutorial"}
          </button>
        ))}
      </div>

      {/* TAB: CAMPO */}
      {tab === "campo" && (
        <div className="flex flex-col gap-8">
          {/* Controles */}
          <Controls
            root={hf.root}
            mode={hf.mode}
            extension={hf.extension}
            onRootChange={hf.setRoot}
            onModeChange={hf.setMode}
            onExtensionChange={hf.setExtension}
            onTranspose={hf.transpose}
          />

          {/* Label do campo */}
          <div className="text-[11px] text-zinc-500 uppercase tracking-widest -mb-4">
            Campo harmônico — {ALL_NOTES[hf.root]} {hf.mode}
          </div>

          {/* Chips dos 7 acordes */}
          <FieldChips
            field={hf.field}
            selectedDegree={hf.selectedDegree}
            progressionDegrees={hf.progressionDegrees}
            onSelect={(chord) => hf.selectDegree(chord.deg)}
          />

          {/* Progressões clássicas */}
          <ClassicPresets
            activePreset={hf.activePreset}
            onSelect={hf.applyClassicPreset}
          />

          {/* Gerador + Display lado a lado em telas grandes */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-64 shrink-0">
              <Generator
                options={hf.generatorOptions}
                onChange={hf.setGeneratorOptions}
                onGenerate={hf.generateProg}
              />
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 uppercase tracking-widest">
                  Progressão gerada
                </span>
                {hf.progression.length > 0 && (
                  <button
                    onClick={() => audio.triggerSequence(hf.progression)}
                    className={`
                      flex items-center gap-2 text-xs px-3 py-1.5 rounded-md
                      border transition-colors
                      ${
                        audio.isPlayingSequence
                          ? "border-amber-500 bg-amber-950 text-amber-300"
                          : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                      }
                    `}
                  >
                    {audio.isPlayingSequence ? "⏹ Parar" : "▶ Tocar"}
                  </button>
                )}
              </div>
              <Display
                progression={hf.progression}
                activeIndex={audio.activeIndex}
              />
            </div>
          </div>

          {/* Diagramas do acorde selecionado */}
          {selectedChord && (
            <div className="flex flex-col gap-6 pt-4 border-t border-zinc-800">
              {/* Título + botão ouvir */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <span className="text-[11px] text-zinc-500 uppercase tracking-widest">
                  {selectedChord.name} — diagramas
                </span>
                <button
                  onClick={() => audio.triggerChord(selectedChord)}
                  className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-md
                             border border-zinc-700 text-zinc-400
                             hover:border-zinc-500 hover:text-zinc-200
                             transition-colors"
                >
                  ▶ Ouvir acorde
                </button>
              </div>

              {/* Diagrama de teclado */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] text-zinc-500 uppercase tracking-widest">
                  Teclado
                </span>
                <PianoDiagram
                  notes={selectedChord.notes}
                  qual={selectedChord.qual}
                />
              </div>

              {/* Guitarra + Ukulele + Notas */}
              <div className="flex flex-wrap gap-8 items-start">
                <GuitarDiagram
                  notes={selectedChord.notes}
                  qual={selectedChord.qual}
                />
                <UkuleleDiagram
                  notes={selectedChord.notes}
                  qual={selectedChord.qual}
                />

                {/* Painel de notas */}
                <div className="flex flex-col gap-0 rounded-xl border border-zinc-800 overflow-hidden min-w-40">
                  <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
                    <span className="text-[11px] text-zinc-500 uppercase tracking-widest">
                      Notas — {selectedChord.name}
                    </span>
                  </div>
                  {selectedChord.notes.map((note, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center px-4 py-2
                                 border-b border-zinc-800 last:border-0"
                    >
                      <span className="text-sm text-zinc-400">
                        {NOTE_ROLE_LABELS[i] ?? "Extensão"}
                      </span>
                      <span className={`text-sm font-medium ${noteColor}`}>
                        {note}
                      </span>
                    </div>
                  ))}
                  {stabNote && (
                    <div className="px-4 py-2.5 bg-zinc-900">
                      <span className="text-[11px] text-zinc-500">
                        {stabNote}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: SOUNDS LIKE */}
      {tab === "sounds" && (
        <SoundsLike
          onApplyPreset={(p) => {
            hf.applyAiPreset(p);
            setTab("campo");
          }}
        />
      )}

      {/* TAB: TUTORIAL */}
      {tab === "tutorial" && (
        <Tutorial
          selectedChord={hf.selectedChord}
          field={hf.field}
          root={hf.root}
          mode={hf.mode}
        />
      )}
    </div>
  );
}
