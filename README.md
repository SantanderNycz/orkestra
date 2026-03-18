# Orkestra

A ferramenta interativa para músicos explorarem campos harmónicos, gerar progressões de acordes e visualizar posições em guitarra, ukulele e teclado — com um agente de IA integrado.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)
![Tone.js](https://img.shields.io/badge/Tone.js-14-orange?style=flat-square)

---

## O que é

Orkestra ajuda músicos — de iniciantes a avançados — a explorar teoria musical de forma visual e sonora. O utilizador escolhe um tom e modo, e o app gera automaticamente o campo harmónico completo com diagramas de acordes, playback, e sugestões inteligentes via IA.

---

## Funcionalidades

### Campo Harmónico

- Selecção de tom (todas as 12 notas) com transposição por semitom
- 7 modos: Maior, Menor, Dórico, Frígio, Lídio, Mixolídio, Lócrio
- Extensões de acorde: tríade, 7ª, 9ª
- Visualização dos 7 graus com numerais romanos (I, ii, iii°...)

### Geração de Progressões

- Geração aleatória com pesos por humor
- 10 humores: Alegre, Relaxado, Neutro, Melancólico, Saudade, Tenso, Épico, Místico, Enérgico, Romântico
- Direcção: aleatório, crescente, decrescente
- Toggle de acordes diminutos
- 8 progressões clássicas como ponto de partida (I–V–vi–IV, ii–V–I, etc.)

### Diagramas de Instrumentos

- **Guitarra** — voicings gerados algoritmicamente, com detecção automática de barre, até 4 variantes por acorde (aberta, barre, posição alta, alternativa)
- **Ukulele** — diagrama GCEA gerado dinamicamente
- **Teclado** — 2 oitavas com teclas destacadas

### Playback

- Ouvir acorde individual (Tone.js, sintetizador polifónico)
- Tocar campo completo em sequência com destaque visual

### Sounds Like...

- Pesquisa por artista ou música
- Agente de IA (Claude) analisa o estilo harmónico e gera um preset completo (tom, modo, humor, extensão, progressão típica)
- Aplicar preset directamente no campo com um clique

### Tutorial IA

- Explicar acorde seleccionado em linguagem simples
- Explicar o campo harmónico completo com referências a artistas e músicas

### Partilha

- Serialização do estado completo na URL (`?root=0&mode=Maior&ext=7ª&prog=0,4,5,3`)
- Qualquer link partilhado abre a progressão exacta

---

## Stack técnica

| Camada    | Tecnologia                              |
| --------- | --------------------------------------- |
| Framework | Next.js 15 (App Router)                 |
| Linguagem | TypeScript 5                            |
| Estilo    | Tailwind CSS                            |
| Animações | Framer Motion                           |
| Áudio     | Tone.js 14                              |
| IA        | Anthropic Claude API (claude-sonnet)    |
| ORM / DB  | — (localStorage para favoritos, fase 1) |
| Deploy    | Vercel                                  |

---

## Arquitectura

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/
│       ├── sounds-like/route.ts   # POST → Claude → preset JSON
│       └── tutorial/route.ts      # POST → Claude → explicação
│
├── components/
│   ├── HarmonicField/             # Campo principal + chips
│   ├── Progression/               # Gerador + display
│   ├── Diagrams/                  # Piano, Guitarra, Ukulele (SVG)
│   ├── SoundsLike/                # Tab agente preset
│   └── Tutorial/                  # Tab tutorial IA
│
├── lib/
│   ├── musicTheory.ts             # Motor de teoria musical (puro TS)
│   ├── voicing.ts                 # Algoritmo de voicings
│   └── audio.ts                   # Wrappers Tone.js
│
├── hooks/
│   ├── useHarmonicField.ts        # Estado global (useReducer)
│   └── useAudio.ts                # Sintetizador + playback
│
└── types/
    └── music.ts                   # Tipos partilhados
```

### Princípio de design

A lógica de teoria musical (`lib/musicTheory.ts`, `lib/voicing.ts`) é **puro TypeScript sem dependências** — não importa React, não sabe nada de UI. Isto torna-a testável isoladamente e reutilizável. Os componentes apenas consomem os resultados via hooks.

As chamadas à API do Claude correm **exclusivamente no servidor** (route handlers), nunca no browser — a API key nunca é exposta ao cliente.

---

## Instalação

```bash
# Clonar o repositório
git clone https://github.com/SantanaderNycz/harmonic-field.git
cd harmonic-field

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com as tuas chaves

# Iniciar em desenvolvimento
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Variáveis de ambiente

Cria um ficheiro `.env.local` na raiz:

```env
# Obrigatório — Anthropic API (Sounds Like + Tutorial)
ANTHROPIC_API_KEY=sk-ant-...

# Opcional — Spotify (fase 2, para dados reais de áudio features)
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
```

Nunca commites o `.env.local`. Está no `.gitignore` por defeito.

---

## Roadmap

- [x] Motor de teoria musical (campos, modos, qualidades, numerais)
- [x] Geração de progressões com pesos por humor
- [x] Progressões clássicas
- [x] Diagramas SVG gerados algoritmicamente (guitarra, ukulele, teclado)
- [x] Voicings automáticos com variantes
- [x] Playback com Tone.js
- [x] Transposição com um clique
- [x] Partilha por URL
- [x] Sounds Like... (agente IA por artista/música)
- [x] Tutorial IA
- [ ] Integração Spotify (audio features reais)
- [ ] Favoritos com localStorage
- [ ] Modo escuro / claro
- [ ] i18n PT / EN

---

## Teoria musical no código

O motor em `lib/musicTheory.ts` não usa nenhuma biblioteca externa de teoria musical — toda a lógica é implementada de raiz em TypeScript. Isto inclui:

- Construção de escalas por intervalos cromáticos
- Derivação de tríades e extensões por grau
- Classificação automática de qualidade (maior, menor, diminuto, aumentado, dominante 7ª, etc.)
- Geração de numerais romanos com capitalização correcta (I vs i vs vii°)
- Nomes enarmónicos (C# vs Db dependendo do tom)

O algoritmo de voicing em `lib/voicing.ts` varre o braço do instrumento em janelas de 4 trastes, pontua cada combinação de cordas por cobertura de notas, span e cordas soltas, e de-duplica os resultados para devolver posições genuinamente distintas.

---

## Licença

MIT — livre para usar, modificar e distribuir.

---

Feito por [Leo Nycz](https://portfolio-leo-nycz.vercel.app) · 42 Porto
