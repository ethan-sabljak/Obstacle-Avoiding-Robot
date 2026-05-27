# Sādhanā

A four-stage daily practice and reflection system.

> *Abhyāsa-vairāgyābhyāṃ tan-nirodhaḥ.*
> — Yoga Sūtra 1.12

---

## The 14-day rule (read this first)

**This project is built in four stages. Stages 2–4 are the agentic layers.
They are LOCKED by default. You will run Stage 1 — the planner — for 14 days
before turning them on. This is not a technical limitation. It is the
practice. The agent has nothing honest to say about a life it has not yet
watched you live.**

After 14 days of real entries, open Settings, toggle "Enable agent," and the
reflector activates. Stage 4 (research) requires a second, separate opt-in.

The gate is enforced two ways:

1. `config.json` — the flag `agent_enabled` is `false` until you flip it.
2. The agent UI also checks that you have at least 14 days of svādhyāya
   entries actually written. Setting the flag without the entries does
   nothing.

---

## The four stages

| Stage | File | What it is | Status |
|------:|------|------------|--------|
| 1 | `index.html` | The planner — wake, breathwork, boxing, tasks, schedule, svādhyāya | Live |
| 2 | `agent.html` | The nightly reflector — Claude reads your last 30 days | Gated |
| 3 | `agent.html` | Tomorrow's draft — proposed plan grounded in your patterns | Gated |
| 4 | `agent.html` + `lib/research.js` | Supplementary research — whitelisted sources, capped | Gated + separate opt-in |

---

## Setup

### 1. Run it

This is a static site. Two ways:

```bash
# from inside sadhana/
python3 -m http.server 8000
# then visit http://localhost:8000/
```

Or any static host (Netlify, Vercel, GitHub Pages, S3). Open `index.html` in
the browser. The planner works offline; only Stages 2–4 need network.

> Opening `index.html` directly via `file://` mostly works, but the agent
> can't read `context/philosophy.md` from the disk over `file://` in some
> browsers. Run a local server.

### 2. Paste the conversation (optional, recommended)

Open `context/conversation.md`. Replace the placeholder block with the verbatim
conversation that produced this practice. The agent reads this file as ground
context. It will work without it, but it will know less of you.

### 3. Use it for 14 days

Wake. Log the time. Breathwork. Run. Boxing on the right day. Three resistance
tasks. Four deep work blocks. Nightly review. Do not touch the agent.

### 4. After 14 days

- Open Settings inside the app and confirm the unlock countdown reads zero.
- Edit `config.json`:

```json
{ "agent_enabled": true, "agent_unlock_date": "YYYY-MM-DD" }
```

- Add your Anthropic API key in Settings. The key is stored in `localStorage`
  on your machine only. It is transmitted only to `api.anthropic.com`.
- Open `agent.html`. The reflector and planner-draft buttons are now live.

### 5. Stage 4 (optional)

In Settings, toggle "Enable supplementary research." Default off. This layer
fetches passages from a whitelist (PubMed, sacred-texts, wisdomlib, SEP),
capped at five queries per week. The agent is instructed to flag uncertainty
and never fabricate citations. Review everything before saving to the
commonplace book.

---

## Files

```
sadhana/
├── index.html              Stage 1 — the planner
├── agent.html              Stages 2–4 — the agentic layer
├── config.json             { agent_enabled, agent_unlock_date }
├── context/
│   ├── philosophy.md       The working hypothesis the agent reads as ground
│   └── conversation.md     Placeholder — paste your conversation here
├── lib/
│   ├── storage.js          localStorage wrapper, schema
│   ├── claude.js           Anthropic API wrapper, system prompts
│   └── research.js         Stage 4 — themes, sources, weekly job
└── README.md
```

All state lives under `localStorage` key `sadhana_v1`. Export/import JSON
from Settings. Back it up.

---

## What the planner tracks

- **Tapas · Morning anchor** — wake time, coffee, breathwork (Wim Hof
  default, breath-hold PBs), 3km run with resistance score.
- **Yuddha · Boxing** — session type, round timer with Web Audio bell that
  survives backgrounded tabs, partner, what got exposed, what to drill next.
- **Three task tiers** — Resistance (max 3, aMCC builders), Deep Work
  (90-min default, lock-other-tasks-while-active), Maintenance.
- **Schedule** — time-blocked, editable, weekday / Saturday / Sunday
  templates, save your own.
- **Svādhyāya** — four-question evening review, soft-prompted at 19:30,
  including the recurrence test.
- **Metrics** — streaks, 30-day charts, monthly compound view, sparring
  "what got exposed" timeline.

## Ground

The planner also includes two reference views the user reads, not writes:

- **Śabda · Lexicon** — every Sanskrit (and other) term used in the
  practice, with etymology, primary-source citation, and the working
  definition. Hover any italic term anywhere in the app to see the
  one-line version; click through for the full entry. Tap on mobile.
- **Manana · Contemplation** — twenty passages held for sustained
  reflection. Each one comes with the surrounding context, why it earned
  a place in the practice, and a small number of specific prompts to take
  into the day. The home-page rotating quote is drawn from this set;
  click it to jump to its card.

The agent reads `context/philosophy.md` as its ground; the user reads it
through these two views.

---

## What the agent does (when unlocked)

- **Stage 2 — Reflect with depth.** After a review is submitted, the agent
  pulls the last 30 days of entries, the philosophy ground, the conversation
  ground, and writes one honest reflection. It ends with one specific
  question for tomorrow.
- **Stage 3 — Draft tomorrow.** It proposes three resistance tasks, four
  deep work blocks, and schedule adjustments grounded in observed completion
  patterns. You accept, edit, or reject. It never auto-commits.
- **Stage 4 — Supplementary research.** Weekly, on Sunday or on demand, the
  agent extracts your three most-recurring themes and pulls supplementary
  passages from a whitelist. Capped at five queries per week. Everything
  lands in a "Supplementary, unverified by you" bucket until you mark it
  Reviewed.

---

## Privacy

- All state is local. No server. No analytics.
- The Anthropic API key never leaves your machine except to
  `api.anthropic.com` directly.
- API calls are logged locally with timestamp and token usage so you can
  see exactly what the agent is doing.

---

## Why

> *He who has a why to live can bear almost any how.* — Nietzsche

The practice is the point. The tooling is a vessel. If the app ever feels
more interesting than the day, close it.
