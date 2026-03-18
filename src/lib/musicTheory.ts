import type {
  SemiTone,
  Degree,
  Mode,
  Extension,
  Mood,
  ChordQuality,
  Chord,
  HarmonicField,
  Progression,
  ProgressionOptions,
} from "@/types/music";

// Notas

// Sustenidos
const SHARP_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

// Bemol
const FLAT_NAMES = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
] as const;

// bemol por convenção
const FLAT_ROOTS = new Set<number>([1, 3, 5, 6, 8, 10]);

export function noteName(semi: number, rootIndex: number): string {
  const idx = ((semi % 12) + 12) % 12;
  const names = FLAT_ROOTS.has(rootIndex) ? FLAT_NAMES : SHARP_NAMES;
  return names[idx] ?? "C";
}

// Modos

//Intervalos cromáticos (a partir da tonica pra cada modo)
export const MODE_INTERVALS: Record<Mode, number[]> = {
  Maior: [0, 2, 4, 5, 7, 9, 11],
  Dórico: [0, 2, 3, 5, 7, 9, 10],
  Frígio: [0, 1, 3, 5, 7, 8, 10],
  Lídio: [0, 2, 4, 6, 7, 9, 11],
  Mixolídio: [0, 2, 4, 5, 7, 9, 10],
  Menor: [0, 2, 3, 5, 7, 8, 10],
  Lócrio: [0, 1, 3, 5, 6, 8, 10],
};

// Moods

//Peso de cada grau, pra cada mood
export const MOOD_WEIGHTS: Record<Mood, number[]> = {
  Alegre: [3, 1, 2, 2, 2, 1, 1],
  Relaxado: [3, 1, 1, 2, 1, 2, 1],
  Neutro: [1, 1, 1, 1, 1, 1, 1],
  Melancólico: [1, 2, 1, 1, 1, 3, 1],
  Saudade: [1, 2, 1, 2, 1, 3, 2],
  Tenso: [1, 2, 1, 1, 3, 1, 3],
  Épico: [3, 1, 2, 2, 3, 2, 2],
  Místico: [1, 1, 2, 1, 1, 2, 3],
  Enérgico: [3, 1, 1, 1, 3, 1, 1],
  Romântico: [2, 2, 1, 2, 1, 2, 1],
};

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII"] as const;

function buildRoman(deg: number, qual: ChordQuality): string {
  const base = ROMAN_NUMERALS[deg];
  const isMinor = [
    "min",
    "m7",
    "m9",
    "mMaj7",
    "dim",
    "dim7",
    "hDim",
    "hDim9",
    "aug",
  ].includes(qual);
  const isDim = ["dim", "dim7", "hDim", "hDim9"].includes(qual);

  return (isMinor ? base.toLowerCase() : base) + (isDim ? "°" : "");
}

// Qualidade do acorde
// a partir dos intervalos de terça, quinta e sétima
function deriveChord(
  rootNote: string,
  third: number, // intervalo da terça em semitons (ex: 3 = menor, 4 = maior)
  fifth: number, // intervalo da quinta (ex: 6 = dim, 7 = justa, 8 = aug)
  seventh: number, // intervalo da sétima
  extension: Extension,
): { name: string; qual: ChordQuality; triad: string } {
  // Tríade base
  let triad: string;
  if (third === 4 && fifth === 7) triad = "maj";
  else if (third === 3 && fifth === 7) triad = "min";
  else if (third === 3 && fifth === 6) triad = "dim";
  else if (third === 4 && fifth === 8) triad = "aug";
  else triad = "maj"; // fallback

  let name: string;
  let qual: ChordQuality;

  if (extension === "tríade") {
    switch (triad) {
      case "maj":
        name = rootNote;
        qual = "maj";
        break;
      case "min":
        name = `${rootNote}m`;
        qual = "min";
        break;
      case "dim":
        name = `${rootNote}°`;
        qual = "dim";
        break;
      case "aug":
        name = `${rootNote}+`;
        qual = "aug";
        break;
      default:
        name = rootNote;
        qual = "maj";
    }
  } else if (extension === "7ª") {
    if (triad === "maj" && seventh === 11) {
      name = `${rootNote}maj7`;
      qual = "maj7";
    } else if (triad === "maj" && seventh === 10) {
      name = `${rootNote}7`;
      qual = "dom7";
    } else if (triad === "min" && seventh === 10) {
      name = `${rootNote}m7`;
      qual = "m7";
    } else if (triad === "min" && seventh === 11) {
      name = `${rootNote}mMaj7`;
      qual = "mMaj7";
    } else if (triad === "dim" && seventh === 10) {
      name = `${rootNote}ø7`;
      qual = "hDim";
    } else if (triad === "dim" && seventh === 9) {
      name = `${rootNote}°7`;
      qual = "dim7";
    } else if (triad === "aug") {
      name = `${rootNote}+7`;
      qual = "aug";
    } else {
      name = `${rootNote}maj7`;
      qual = "maj7";
    }
  } else {
    // 9ª
    if (triad === "maj" && seventh === 11) {
      name = `${rootNote}maj9`;
      qual = "maj9";
    } else if (triad === "maj" && seventh === 10) {
      name = `${rootNote}9`;
      qual = "dom9";
    } else if (triad === "min" && seventh === 10) {
      name = `${rootNote}m9`;
      qual = "m9";
    } else if (triad === "dim" && seventh === 10) {
      name = `${rootNote}ø9`;
      qual = "hDim9";
    } else {
      name = `${rootNote}9`;
      qual = "dom9";
    }
  }

  return { name, qual, triad };
}

// função principal
/* devolve uma array de 7 acordes, um por grau da escala */
export function buildField(
  rootIndex: SemiTone,
  mode: Mode,
  extension: Extension,
): HarmonicField {
  const intervals = MODE_INTERVALS[mode];

  // as 7 notas em semitom
  const scale = intervals.map((i) => (rootIndex + i) % 12);

  return scale.map((root, deg) => {
    // tríade
    const third = scale[(deg + 2) % 7];
    const fifth = scale[(deg + 4) % 7];
    const seventh = scale[(deg + 6) % 7];

    const i3 = (third - root + 12) % 12;
    const i5 = (fifth - root + 12) % 12;
    const i7 = (seventh - root + 12) % 12;

    const rootNote = noteName(root, rootIndex);
    const { name, qual } = deriveChord(rootNote, i3, i5, i7, extension);

    const notes: string[] = [
      rootNote,
      noteName(third, rootIndex),
      noteName(fifth, rootIndex),
    ];
    if (extension !== "tríade") {
      notes.push(noteName(seventh, rootIndex));
    }

    return {
      deg: deg as Degree,
      root: root as SemiTone,
      name,
      qual,
      notes,
      roman: buildRoman(deg, qual),
    };
  });
}

// progressões clássicas

export interface ClassicPreset {
  label: string;
  genre: string;
  degrees: Degree[];
}

export const CLASSIC_PRESETS: ClassicPreset[] = [
  { label: "I–V–vi–IV", genre: "Pop", degrees: [0, 4, 5, 3] },
  { label: "I–IV–V", genre: "Blues", degrees: [0, 3, 4] },
  { label: "ii–V–I", genre: "Jazz", degrees: [1, 4, 0] },
  { label: "I–vi–IV–V", genre: "Anos 50", degrees: [0, 5, 3, 4] },
  { label: "vi–IV–I–V", genre: "Pop mod.", degrees: [5, 3, 0, 4] },
  { label: "I–iii–IV–V", genre: "Clássico", degrees: [0, 2, 3, 4] },
  { label: "i–VII–VI–VII", genre: "Modal", degrees: [0, 6, 5, 6] },
  { label: "I–IV–I–V", genre: "Country", degrees: [0, 3, 0, 4] },
];

// gerador de progressões

export function generateProgression(
  field: HarmonicField,
  options: ProgressionOptions,
): Progression {
  const { count, direction, includeDiminished, mood } = options;

  // filtrar diminutos
  const DIM_QUALS: ChordQuality[] = ["dim", "hDim", "dim7"];
  let pool: HarmonicField = includeDiminished
    ? field
    : field.filter((c: Chord) => !DIM_QUALS.includes(c.qual));

  if (pool.length === 0) pool = field; // fallback: nunca fica vazio

  if (direction === "asc") {
    const sorted = [...pool].sort((a: Chord, b: Chord) => a.deg - b.deg);
    return Array.from({ length: count }, (_, i) => sorted[i % sorted.length]);
  }
  if (direction === "desc") {
    const sorted = [...pool].sort((a: Chord, b: Chord) => b.deg - a.deg);
    return Array.from({ length: count }, (_, i) => sorted[i % sorted.length]);
  }

  // aleatorio com pesos por humor
  const weights = MOOD_WEIGHTS[mood];
  const weighted: Chord[] = pool.flatMap((chord: Chord) =>
    Array(Math.max(1, weights[chord.deg] ?? 1)).fill(chord),
  );

  const result: Progression = [];
  let last: Chord | null = null;

  for (let i = 0; i < count; i++) {
    // Evitar repetir o acorde imediatamente anterior
    const available: Chord[] = last
      ? weighted.filter((c: Chord) => c.deg !== last!.deg)
      : weighted;
    const pool2: Chord[] = available.length ? available : weighted;
    const pick: Chord = pool2[Math.floor(Math.random() * pool2.length)];
    result.push(pick);
    last = pick;
  }

  return result;
}

// utilitarios

/** Converte o nome de uma nota para semitom (ex: "Bb" → 10) */
export function noteNameToSemi(name: string): number {
  const MAP: Record<string, number> = {
    C: 0,
    "C#": 1,
    Db: 1,
    D: 2,
    "D#": 3,
    Eb: 3,
    E: 4,
    F: 5,
    "F#": 6,
    Gb: 6,
    G: 7,
    "G#": 8,
    Ab: 8,
    A: 9,
    "A#": 10,
    Bb: 10,
    B: 11,
  };
  return MAP[name] ?? 0;
}

/** Lista de todas as notas para popular selects */
export const ALL_NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

export const ALL_MODES: Mode[] = [
  "Maior",
  "Dórico",
  "Frígio",
  "Lídio",
  "Mixolídio",
  "Menor",
  "Lócrio",
];

export const ALL_EXTENSIONS: Extension[] = ["tríade", "7ª", "9ª"];

export const ALL_MOODS: Mood[] = [
  "Alegre",
  "Relaxado",
  "Neutro",
  "Melancólico",
  "Saudade",
  "Tenso",
  "Épico",
  "Místico",
  "Enérgico",
  "Romântico",
];
