# Agentic-Planner Synthesis

A scan of the contemporary planner / agentic-tooling landscape, with a
matrix of best-in-class features and a record of what the Sādhanā
planner incorporates, what it deliberately omits, and why. The agent
reads this so its reflections can reference the project's design choices
as deliberate rather than incidental.

## The landscape

Three families.

### A. Time-aware execution planners

- **Motion** — AI re-plans the day continuously around meetings;
  drag-to-resched; deadline-aware.
- **Reclaim.ai** — calendar-aware auto-blocking; habits, buffers,
  energy management.
- **Sunsama** — daily intentional planning with one-sentence-per-task
  intent; evening shutdown ritual; "honest commitment" cap.
- **Akiflow** — unified inbox + time-blocking; keyboard-first.
- **Amie** — calendar with tasks as first-class.
- **Routine** — daily console pulling tasks, notes, calendar into one
  view.

### B. Knowledge & reflection systems

- **Tana** — supertags + AI; structured knowledge that the AI can
  query.
- **Roam Research** — bidirectional links; daily notes as substrate.
- **Mem.ai** — memory-first AI: capture everything, ask the corpus
  later.
- **Obsidian** — local-first markdown graph; plugin ecosystem.
- **Heyday** — auto-organized memory across web and apps.
- **Day One** — journaling with prompts, weather, location.
- **Reflectly** — AI-prompted daily journaling.
- **Stoic** — Stoic frame for journaling with curated quotes.

### C. State / habit / coaching

- **Habitica** — gamified habits with RPG mechanics.
- **Streaks** — minimalist habit tracker, six-habit cap, streak focus.
- **Daylio** — micro-mood + activity correlation.
- **Insight Timer / Waking Up / Calm / Headspace** — meditation,
  curated teacher content.
- **Pi / Rocky.ai** — AI conversation as coach.
- **Beeminder** — goal accountability with monetary stakes.

## The matrix — what was incorporated, what was not, why

| Pattern | Best-in-class | In Sādhanā | Decision |
|---|---|---|---|
| **Goal → task decomposition** | Sunsama, Motion | Vision → Orchestra → Mantra → Today's tasks (Saṅkalpa view) | Incorporated as a manifestation cascade rather than a GTD cascade. |
| **Daily intentional planning** | Sunsama | Today (Smṛti) + Morning (Prātaḥ) + Tasks (Tapas) | Native. |
| **Honest commitment / capacity cap** | Sunsama | 3-task Resistance cap; deep-work single-lock | Native. |
| **Evening shutdown reflection** | Sunsama, Day One, Daylio | Svādhyāya — four questions, recurrence test | Native; sharper than the comparables. |
| **Mantra / affirmation cards** | Calm, Stoic, Reflectly | Saṅkalpa view with orchestra-generated affirmations | Deeper — built into a 9-month curriculum, not a daily card. |
| **Visualization / future-self journaling** | Reflectly, Stoic, Dispenza apps | Vision (5-year + this-year) panel in Saṅkalpa | Incorporated. |
| **Quotes / contemplation** | Stoic, Insight Timer | Manana view, 27 entries with context & prompts | Native; sourced and unflattering. |
| **Streaks** | Streaks app, Habitica | Wake, breathwork, boxing, 3-resistance streaks | Native. |
| **Pattern detection over time** | Mem, Roam, journaling apps | Agent stages 1–4 read trailing 30-day data | Native; partisan rather than neutral. |
| **Coach-mode dialogue** | Pi, Rocky | Agent reflector (Darpaṇa) gated to 14 days + 5 entries | Incorporated with deliberate gating. |
| **Pattern surfacing in reflection** | Sunsama weekly, Mem search | Agent Stage 2 + Stage 4 research | Native. |
| **Lexicon / definitional ground** | none of the planners | Śabda view, 41 entries with primary-source citations | **Unique to Sādhanā.** No comparable planner grounds its vocabulary. |
| **Lineage / teacher attribution** | Insight Timer (separated by teacher) | Lineage card grid in Saṅkalpa: Patañjali, Gītā, Proctor, Dispenza, Hof, Abrams, Goggins, Huberman | **Unique to Sādhanā.** |
| **Calendar import** | Motion, Reclaim, Amie | Local schedule, manual blocking | **Deliberately omitted.** Out of scope for a local-first practice; revisit if the user requests. |
| **Voice capture** | Superhuman, Granola | none | Deliberately omitted — adds backend. |
| **Gamification (XP, level-up)** | Habitica | none | Deliberately omitted — sycophantic. The streak is enough. |
| **Monetary stakes** | Beeminder | none | Deliberately omitted — extrinsic motivator, would corrupt vairāgya. |
| **Email-as-task** | Superhuman | none | Out of scope. |
| **Local-first storage** | Obsidian, Day One | localStorage; export / import JSON | Native. |
| **Privacy / no telemetry** | Standard Notes | none, by construction | Native. |

## The synthesis principle

Every planner in the landscape solves *part* of the problem: time, or
knowledge, or habit, or reflection, or coaching. None of them holds the
full arc — vision to substrate to today's choice — in a single coherent
frame. None of them is *partisan* for the owner's becoming rather than
neutral about the owner's productivity.

Sādhanā's bet is that the integration matters more than any of the
parts. The orchestra is the integrating structure: the nine-month
curriculum tells the planner what is being cultivated this month, the
mantra makes that cultivation actionable today, the tasks make today
concrete, the metrics make the month visible, the reflection makes the
day examined, the agent makes the trailing thirty days legible. None of
this is novel in its parts. The integration is the novel thing.

## Owner-centric — the agent's stance

The user's directive: the agent "builds itself around promoting the
owner" and "completes the entirety of the understanding of the boss in
its workflows." This is not a feature. It is the agent's orientation.

What it means in practice:

- The agent's questions are oriented toward what completes the owner's
  understanding of the owner.
- The agent does not flatter, but it also does not perform detachment.
  It is partisan for the becoming.
- The agent uses the owner's vocabulary (the lexicon) — names patterns
  in terms the owner has already accepted.
- The agent reads the orchestra so its prompts arrive in the field the
  owner is currently cultivating.
- The agent surfaces contradictions between the owner's stated vision
  and the owner's logged actions — gently, specifically, with the
  evidence.

This is what no other planner does. The other planners are tools the
owner uses. Sādhanā is a tool that, by design, is on the owner's side.

## Visual / interaction language

The interface itself is part of the teaching. The design notes:

- **Liquid ambient field** — a warm radial gradient anchors the dark
  background, giving the cave its depth and a center of light.
- **Cormorant Garamond italics for every Sanskrit term** — the
  vocabulary is held in a serif that is older than the practice.
- **Inter for the structural typography** — modern, neutral, gets out
  of the way.
- **Single luminous accent (amber)** — never two colors competing.
  The accent glows on hover where the user is meant to look.
- **Breath-like animation on the active orchestra month** — a 5.5s
  pulse, matching the cadence of a long deliberate exhale. The
  interface itself breathes with the practice it points to.
- **View transitions as fade-rise** — not horizontal slides, not
  zooms. Up and forward, brief blur to clear focus. The mind crossing
  a threshold.
- **No emojis. No gradients on text. No glassmorphism.** Minimalism
  that is restrained, not sterile.
- **The mantra display is rendered with a radial glow at its center**
  — the saṅkalpa is the place where light enters the dark.

Tool's aesthetic, applied at the screen level: dense, dark, has depth,
rewards attention, will not flatter.
