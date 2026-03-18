```
src/
├── app/
│   ├── layout.tsx              # fonte, metadata, providers
│   ├── page.tsx                # página principal (só monta o app)
│   └── api/
│       ├── sounds-like/
│       │   └── route.ts        # POST → chama Claude, devolve preset JSON
│       └── tutorial/
│           └── route.ts        # POST → chama Claude, devolve explicação
│
├── components/
│   ├── HarmonicField/
│   │   ├── index.tsx           # componente raiz, orquestra tudo
│   │   ├── FieldChips.tsx      # os 7 acordes clicáveis
│   │   ├── Controls.tsx        # selects tom/modo/extensão + setas
│   │   └── ClassicPresets.tsx  # progressões clássicas
│   │
│   ├── Progression/
│   │   ├── Generator.tsx       # opções + botão gerar
│   │   └── Display.tsx         # progressão gerada + numerais
│   │
│   ├── Diagrams/
│   │   ├── PianoDiagram.tsx    # SVG teclado
│   │   ├── GuitarDiagram.tsx   # SVG guitarra + variantes
│   │   └── UkuleleDiagram.tsx  # SVG ukulele
│   │
│   ├── SoundsLike/
│   │   ├── index.tsx           # tab completa
│   │   └── PresetCard.tsx      # resultado do agente
│   │
│   └── Tutorial/
│       └── index.tsx           # tab tutorial
│
├── lib/
│   ├── musicTheory.ts          # buildField, genProg, modos, qualidades
│   ├── voicing.ts              # findVoicings, classifyVoicing
│   └── audio.ts                # hook useAudio com Tone.js
│
├── hooks/
│   ├── useHarmonicField.ts     # estado global do campo
│   └── useAudio.ts             # synth, playChord, playProgression
│
└── types/
    └── music.ts                # Chord, Field, Preset, Voicing, etc.
```
