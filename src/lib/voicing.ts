import type { Voicing } from "@/types/music";
import { noteNameToSemi } from "@/lib/musicTheory";

// afinaçoes
// semitom de cada corda em afinação padrão
export const GUITAR_TUNING = [4, 9, 2, 7, 11, 4] as const;
export const UKULELE_TUNING = [7, 0, 4, 9] as const; // G C E A

export const GUITAR_STRING_NAMES = ["E", "A", "D", "G", "B", "e"] as const;
export const UKULELE_STRING_NAMES = ["G", "C", "E", "A"] as const;

/*Pontua um voicing. Devolve -999 se for inválido (não cobre todas as notas do acorde ou tem menos de 3 cordas tocadas)*/
function scoreVoicing(
  voicing: number[],
  tuning: readonly number[],
  chordSemis: Set<number>,
): number {
  const played = voicing.filter((f) => f >= 0);
  if (played.length < 3) return -999;

  // Notas cobertas por este voicing
  const covered = new Set<number>();
  voicing.forEach((fret, stringIndex) => {
    if (fret >= 0) covered.add((tuning[stringIndex] + fret) % 12);
  });

  // Tem de cobrir todas as notas do acorde
  for (const semi of chordSemis) {
    if (!covered.has(semi)) return -999;
  }

  const frettedOnly = voicing.filter((f) => f > 0);
  const span = frettedOnly.length
    ? Math.max(...frettedOnly) - Math.min(...frettedOnly)
    : 0;
  const openBonus = voicing.filter((f) => f === 0).length * 0.5;
  const mutedPen = voicing.filter((f) => f === -1).length * 0.5;

  return (
    played.length * 2 + covered.size * 5 - span * 1.5 + openBonus - mutedPen
  );
}

export function findVoicings(
  tuning: readonly number[],
  chordNotes: string[],
  maxCount = 4,
): Voicing[] {
  const semis = chordNotes.map((n) => noteNameToSemi(n));
  const chordSemis = new Set(semis.map((s) => ((s % 12) + 12) % 12));
  const nStrings = tuning.length;
  const allCandidates: { voicing: number[]; score: number }[] = [];

  for (let windowStart = 0; windowStart <= 12; windowStart++) {
    // Opções por corda nesta janela
    const optionsPerString: number[][] = tuning.map((openSemi) => {
      const opts: number[] = [-1]; // sempre pode mutar

      // Corda solta
      if (chordSemis.has(openSemi % 12)) opts.push(0);

      // Trastes dentro da janela
      const lo = windowStart === 0 ? 1 : windowStart;
      const hi = windowStart === 0 ? 4 : windowStart + 3;
      for (let fret = lo; fret <= hi; fret++) {
        if (chordSemis.has((openSemi + fret) % 12)) opts.push(fret);
      }

      return opts;
    });

    // Poda: máximo 2 opções fretadas por corda para manter performance
    const pruned = optionsPerString.map((opts) => {
      if (opts.length <= 3) return opts;
      return [-1, ...opts.filter((f) => f >= 0).slice(0, 2)];
    });

    // Enumerar combinações recursivamente
    const recurse = (stringIdx: number, current: number[]): void => {
      if (stringIdx === nStrings) {
        const score = scoreVoicing(current, tuning, chordSemis);
        if (score > -999) {
          allCandidates.push({ voicing: [...current], score });
        }
        return;
      }
      for (const fret of pruned[stringIdx]) {
        current.push(fret);
        recurse(stringIdx + 1, current);
        current.pop();
      }
    };
    recurse(0, []);
  }

  // Ordenar por pontuação
  allCandidates.sort((a, b) => b.score - a.score);

  // De-duplicar: dois voicings são iguais se diferirem em ≤1 corda
  const selected: number[][] = [];
  for (const candidate of allCandidates) {
    if (selected.length >= maxCount) break;
    const isDuplicate = selected.some((existing) => {
      const differences = existing.filter(
        (fret, i) => fret !== candidate.voicing[i],
      ).length;
      return differences <= 1;
    });
    if (!isDuplicate) selected.push(candidate.voicing);
  }

  // Fallback: se não encontrou nada, devolve cordas mudas
  if (selected.length === 0) {
    if (allCandidates.length > 0) selected.push(allCandidates[0].voicing);
    else selected.push(tuning.map(() => -1));
  }

  return selected;
}

export function findVoicing(
  tuning: readonly number[],
  chordNotes: string[],
): Voicing {
  return findVoicings(tuning, chordNotes, 1)[0] ?? tuning.map(() => -1);
}

// Classificação de voicings

export type VoicingType =
  | "Aberta"
  | "Barre"
  | "Posição alta"
  | "Principal"
  | "Alternativa";

export function classifyVoicing(voicing: Voicing, index: number): VoicingType {
  const frettedNotes = voicing.filter((f) => f > 0);
  const minFret = frettedNotes.length ? Math.min(...frettedNotes) : 0;

  // Contar quantas cordas partilham o mesmo traste (para detectar barre)
  const fretCounts: Record<number, number> = {};
  frettedNotes.forEach((f) => {
    fretCounts[f] = (fretCounts[f] ?? 0) + 1;
  });
  const hasBarre = Object.values(fretCounts).some((count) => count >= 4);

  const openStrings = voicing.filter((f) => f === 0).length;

  if (openStrings >= 2 && minFret <= 4) return "Aberta";
  if (hasBarre && minFret <= 5) return "Barre";
  if (minFret >= 7) return "Posição alta";
  return index === 0 ? "Principal" : "Alternativa";
}

export const VOICING_DESCRIPTIONS: Record<VoicingType, string> = {
  Aberta: "Usa cordas soltas. Soante e fácil de tocar.",
  Barre: "Indicador barra todas as cordas. Mais versátil.",
  "Posição alta": "No agudo do braço. Timbre mais brilhante.",
  Principal: "Voicing mais equilibrado para esta posição.",
  Alternativa: "Voicing diferente, mesmo acorde.",
};
