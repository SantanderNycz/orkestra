// semitons (0 = C, 1 = C# e tralalá)
export type SemiTone = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

// Graus da escala
export type Degree = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// qualidades possíveis de um acorde
export type ChordQuality =
  | "maj"
  | "maj7"
  | "maj9"
  | "min"
  | "m7"
  | "m9"
  | "mMaj7"
  | "dom7"
  | "dom9"
  | "dim"
  | "dim7"
  | "hDim"
  | "hDim9"
  | "aug";

// modos disponiveis
export type Mode =
  | "Maior"
  | "Menor"
  | "Dórico"
  | "Frígio"
  | "Lídio"
  | "Mixolídio"
  | "Lócrio";

// Extensões disponíveis
export type Extension = "tríade" | "7ª" | "9ª";

// moods disponíveis
export type Mood =
  | "Alegre"
  | "Relaxado"
  | "Neutro"
  | "Melancólico"
  | "Saudade"
  | "Tenso"
  | "Épico"
  | "Místico"
  | "Enérgico"
  | "Romântico";

// direção da progressão
export type Direction = "random" | "asc" | "desc";

// encaixe do acorde no campo
export interface Chord {
  deg: Degree; // grau na escala (0–6)
  root: SemiTone; // nota raiz em semitom
  name: string; // ex: "Am7", "Gmaj7", "F#°"
  qual: ChordQuality;
  notes: string[]; // ex: ["A", "C", "E", "G"]
  roman: string; // ex: "ii", "IV", "vii°"
}

// campo harmonico
export type HarmonicField = Chord[];

// progressão gerada
export type Progression = Chord[];

// Um voicing para um instrumento
// -1 = corda mutada, 0 = corda solta, 1–N = traste
export type Voicing = number[];

// preset gerado pelo Sounds Like
export interface Preset {
  root: SemiTone;
  mode: Mode;
  mood: Mood;
  extension: Extension;
  progression: Degree[];
  description: string;
  tags: string[];
}

// opcoes de progressao
export interface ProgressionOptions {
  count: number;
  direction: Direction;
  includeDiminished: boolean;
  mood: Mood;
}
