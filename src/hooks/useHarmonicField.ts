import { useReducer, useCallback, useMemo } from "react";
import type {
  SemiTone,
  Mode,
  Extension,
  Chord,
  HarmonicField,
  Progression,
  ProgressionOptions,
} from "@/types/music";

import {
  buildField,
  generateProgression,
  CLASSIC_PRESETS,
  type ClassicPreset,
} from "@/lib/musicTheory";

// Estado
export interface HarmonicFieldState {
  root: SemiTone;
  mode: Mode;
  extension: Extension;
  field: HarmonicField;
  selectedDegree: number;
  progression: Progression;
  generatorOptions: ProgressionOptions;
  activePreset: number;
}

// Ações

type Action =
  | { type: "SET_ROOT"; payload: SemiTone }
  | { type: "SET_MODE"; payload: Mode }
  | { type: "SET_EXTENSION"; payload: Extension }
  | { type: "TRANSPOSE"; payload: 1 | -1 }
  | { type: "SELECT_DEGREE"; payload: number }
  | { type: "SET_GENERATOR_OPTIONS"; payload: Partial<ProgressionOptions> }
  | { type: "GENERATE_PROGRESSION" }
  | { type: "APPLY_CLASSIC_PRESET"; payload: number }
  | {
      type: "APPLY_AI_PRESET";
      payload: {
        root: SemiTone;
        mode: Mode;
        extension: Extension;
        progression: number[];
      };
    }
  | { type: "CLEAR_PROGRESSION" };

// Reducer

function rebuildField(
  root: SemiTone,
  mode: Mode,
  extension: Extension,
): HarmonicField {
  return buildField(root, mode, extension);
}

function reducer(
  state: HarmonicFieldState,
  action: Action,
): HarmonicFieldState {
  switch (action.type) {
    case "SET_ROOT": {
      const field = rebuildField(action.payload, state.mode, state.extension);
      return {
        ...state,
        root: action.payload,
        field,
        progression: [],
        activePreset: -1,
      };
    }

    case "SET_MODE": {
      const field = rebuildField(state.root, action.payload, state.extension);
      return {
        ...state,
        mode: action.payload,
        field,
        progression: [],
        activePreset: -1,
      };
    }

    case "SET_EXTENSION": {
      const field = rebuildField(state.root, state.mode, action.payload);
      return {
        ...state,
        extension: action.payload,
        field,
        progression: [],
        activePreset: -1,
      };
    }

    case "TRANSPOSE": {
      const newRoot = ((((state.root + action.payload) % 12) + 12) %
        12) as SemiTone;
      const field = rebuildField(newRoot, state.mode, state.extension);
      return {
        ...state,
        root: newRoot,
        field,
        progression: [],
        activePreset: -1,
      };
    }

    case "SELECT_DEGREE": {
      return { ...state, selectedDegree: action.payload };
    }

    case "SET_GENERATOR_OPTIONS": {
      return {
        ...state,
        generatorOptions: { ...state.generatorOptions, ...action.payload },
        activePreset: -1,
      };
    }

    case "GENERATE_PROGRESSION": {
      const progression = generateProgression(
        state.field,
        state.generatorOptions,
      );
      return { ...state, progression, activePreset: -1 };
    }

    case "APPLY_CLASSIC_PRESET": {
      const preset: ClassicPreset = CLASSIC_PRESETS[action.payload];
      if (!preset) return state;
      // Se já estava activo, desactiva
      if (state.activePreset === action.payload) {
        return { ...state, progression: [], activePreset: -1 };
      }
      const progression = preset.degrees.map((deg) => state.field[deg % 7]);
      return { ...state, progression, activePreset: action.payload };
    }

    case "APPLY_AI_PRESET": {
      const { root, mode, extension, progression: degrees } = action.payload;
      const field = rebuildField(root, mode, extension);
      const progression = degrees.map((deg) => field[deg % 7]);
      return {
        ...state,
        root,
        mode,
        extension,
        field,
        progression,
        activePreset: -1,
      };
    }

    case "CLEAR_PROGRESSION": {
      return { ...state, progression: [], activePreset: -1 };
    }

    default:
      return state;
  }
}

// Estado inicial

function createInitialState(): HarmonicFieldState {
  const root: SemiTone = 0; // C
  const mode: Mode = "Maior";
  const extension: Extension = "tríade";

  return {
    root,
    mode,
    extension,
    field: buildField(root, mode, extension),
    selectedDegree: 0,
    progression: [],
    generatorOptions: {
      count: 4,
      direction: "random",
      includeDiminished: true,
      mood: "Neutro",
    },
    activePreset: -1,
  };
}

// Hook

export function useHarmonicField() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  // ações pra não ter re-render nos childs
  const setRoot = useCallback(
    (root: SemiTone) => dispatch({ type: "SET_ROOT", payload: root }),
    [],
  );

  const setMode = useCallback(
    (mode: Mode) => dispatch({ type: "SET_MODE", payload: mode }),
    [],
  );

  const setExtension = useCallback(
    (ext: Extension) => dispatch({ type: "SET_EXTENSION", payload: ext }),
    [],
  );

  const transpose = useCallback(
    (dir: 1 | -1) => dispatch({ type: "TRANSPOSE", payload: dir }),
    [],
  );

  const selectDegree = useCallback(
    (deg: number) => dispatch({ type: "SELECT_DEGREE", payload: deg }),
    [],
  );

  const setGeneratorOptions = useCallback(
    (opts: Partial<ProgressionOptions>) =>
      dispatch({ type: "SET_GENERATOR_OPTIONS", payload: opts }),
    [],
  );

  const generateProg = useCallback(
    () => dispatch({ type: "GENERATE_PROGRESSION" }),
    [],
  );

  const applyClassicPreset = useCallback(
    (index: number) =>
      dispatch({ type: "APPLY_CLASSIC_PRESET", payload: index }),
    [],
  );

  const applyAiPreset = useCallback(
    (payload: {
      root: SemiTone;
      mode: Mode;
      extension: Extension;
      progression: number[];
    }) => dispatch({ type: "APPLY_AI_PRESET", payload }),
    [],
  );

  const clearProgression = useCallback(
    () => dispatch({ type: "CLEAR_PROGRESSION" }),
    [],
  );

  // Acorde atualmente seleccionado
  const selectedChord: Chord | null = useMemo(
    () => state.field[state.selectedDegree] ?? null,
    [state.field, state.selectedDegree],
  );

  // Conjunto de graus na progressão actual
  const progressionDegrees: Set<number> = useMemo(
    () => new Set(state.progression.map((c) => c.deg)),
    [state.progression],
  );

  return {
    // Estado
    ...state,
    selectedChord,
    progressionDegrees,
    // Acções
    setRoot,
    setMode,
    setExtension,
    transpose,
    selectDegree,
    setGeneratorOptions,
    generateProg,
    applyClassicPreset,
    applyAiPreset,
    clearProgression,
  };
}
