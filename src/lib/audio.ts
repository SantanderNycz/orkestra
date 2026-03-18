import type { Chord } from "@/types/music";

// tipos
export type SynthInstance = import("tone").PolySynth | null;

// conversão de notas
// quando o tone.js nao aceitar algum nome, ele passa pra sustenido
const ENHARMONIC: Record<string, string> = {
  Db: "C#",
  Eb: "D#",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
};

export function toToneNote(noteName: string, index: number): string {
  const normalized = ENHARMONIC[noteName] ?? noteName;
  const octave = index === 0 ? 3 : 4;
  return `${normalized}${octave}`;
}

export function chordToToneNotes(notes: string[]): string[] {
  return notes.map((note, i) => toToneNote(note, i));
}

// criação do synth
export async function createSynth(): Promise<SynthInstance> {
  const Tone = await import("tone");
  await Tone.start();

  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: {
      attack: 0.02,
      decay: 0.3,
      sustain: 0.4,
      release: 1.2,
    },
    volume: -8,
  });

  synth.toDestination();
  return synth;
}

// playback

export function playChord(synth: SynthInstance, notes: string[]): void {
  if (!synth) return;
  const toneNotes = chordToToneNotes(notes);
  synth.triggerAttackRelease(toneNotes, "1n");
}
export function playSequence(
  synth: SynthInstance,
  chords: Chord[],
  intervalMs = 900,
  onChord?: (chord: Chord, index: number) => void,
  onEnd?: () => void,
): () => void {
  if (!synth || chords.length === 0) {
    onEnd?.();
    return () => {};
  }

  let index = 0;
  let stopped = false;
  let timeout: ReturnType<typeof setTimeout>;

  const step = (): void => {
    if (stopped || index >= chords.length) {
      if (!stopped) onEnd?.();
      return;
    }

    const chord = chords[index];
    playChord(synth, chord.notes);
    onChord?.(chord, index);
    index++;

    timeout = setTimeout(step, intervalMs);
  };

  step();

  return () => {
    stopped = true;
    clearTimeout(timeout);
    onEnd?.();
  };
}
