import { useRef, useState, useCallback } from "react";
import type { Chord } from "@/types/music";
import {
  createSynth,
  playChord,
  playSequence,
  type SynthInstance,
} from "@/lib/audio";

// Tipos

export type AudioStatus = "idle" | "playing-chord" | "playing-sequence";

// Hook
export function useAudio() {
  const synthRef = useRef<SynthInstance>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState<AudioStatus>("idle");
  const [activeChord, setActiveChord] = useState<Chord | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Inicialização lazy do sintetizador
  const ensureSynth = useCallback(async (): Promise<SynthInstance> => {
    if (!synthRef.current) {
      synthRef.current = await createSynth();
    }
    return synthRef.current;
  }, []);

  const triggerChord = useCallback(
    async (chord: Chord) => {
      // Se tinha algo tocando, pára primeiro
      stopRef.current?.();
      stopRef.current = null;

      const synth = await ensureSynth();
      setStatus("playing-chord");
      setActiveChord(chord);
      setActiveIndex(null);
      playChord(synth, chord.notes);

      setTimeout(() => {
        setStatus("idle");
        setActiveChord(null);
      }, 1800);
    },
    [ensureSynth],
  );

  // Tocar sequência de acordes
  const triggerSequence = useCallback(
    async (chords: Chord[]) => {
      // Se tinha algo tocando, pára primeiro
      if (status === "playing-sequence") {
        stopRef.current?.();
        stopRef.current = null;
        setStatus("idle");
        setActiveChord(null);
        return;
      }

      const synth = await ensureSynth();
      setStatus("playing-sequence");

      const stop = playSequence(
        synth,
        chords,
        900,
        // onChord — chamado a cada acorde da sequência
        (chord, index) => {
          setActiveChord(chord);
          setActiveIndex(index);
        },
        // onEnd — chamado quando termina ou é parada
        () => {
          setStatus("idle");
          setActiveChord(null);
          setActiveIndex(null);
          stopRef.current = null;
        },
      );

      stopRef.current = stop;
    },
    [ensureSynth, status],
  );

  // Parar tudo
  const stopAll = useCallback(() => {
    stopRef.current?.();
    stopRef.current = null;
    setStatus("idle");
    setActiveChord(null);
    setActiveIndex(null);
  }, []);

  return {
    status,
    activeChord,
    activeIndex,
    isIdle: status === "idle",
    isPlayingSequence: status === "playing-sequence",
    triggerChord,
    triggerSequence,
    stopAll,
  };
}
