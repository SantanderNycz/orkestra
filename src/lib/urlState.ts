import type { SemiTone, Mode, Extension } from "@/types/music";
import { ALL_MODES, ALL_EXTENSIONS } from "@/lib/musicTheory";

export interface UrlState {
  root: SemiTone;
  mode: Mode;
  extension: Extension;
  progression: number[];
}

export function serializeState(state: UrlState): string {
  const params = new URLSearchParams();
  params.set("root", String(state.root));
  params.set("mode", state.mode);
  params.set("ext", state.extension);
  if (state.progression.length > 0) {
    params.set("prog", state.progression.join(","));
  }
  return params.toString();
}

export function deserializeState(search: string): Partial<UrlState> {
  const params = new URLSearchParams(search);
  const result: Partial<UrlState> = {};

  const root = Number(params.get("root"));
  if (!isNaN(root) && root >= 0 && root <= 11) {
    result.root = root as SemiTone;
  }

  const mode = params.get("mode");
  if (mode && ALL_MODES.includes(mode as Mode)) {
    result.mode = mode as Mode;
  }

  const ext = params.get("ext");
  if (ext && ALL_EXTENSIONS.includes(ext as Extension)) {
    result.extension = ext as Extension;
  }

  const prog = params.get("prog");
  if (prog) {
    const degrees = prog
      .split(",")
      .map(Number)
      .filter((n) => !isNaN(n) && n >= 0 && n <= 6);
    if (degrees.length > 0) result.progression = degrees;
  }

  return result;
}
