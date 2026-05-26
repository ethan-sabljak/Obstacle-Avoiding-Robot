// Shared localStorage wrapper for Sādhanā.
// Key shape: 'sadhana_v1' is the root object; everything lives inside it.

(function (global) {
  'use strict';

  const ROOT_KEY = 'sadhana_v1';

  const defaultRoot = () => ({
    version: 1,
    created: new Date().toISOString(),
    settings: {
      apiKey: '',
      researchEnabled: false,
      lightMode: false,
      weeklyTemplate: null,
      breathwork: { rounds: 3, breaths: 30 },
      boxing: { rounds: 6, roundSec: 180, restSec: 60 },
    },
    days: {},          // keyed by ISO date 'YYYY-MM-DD'
    tasks: {},         // keyed by date -> [{id,title,tier,estMin,actMin,done,note,order}]
    schedules: {},     // custom saved schedules { name: [...blocks] }
    reflections: {},   // date -> { reflection, model, tokens, savedAt }
    drafts: {},        // date -> proposed tomorrow plan
    research: {        // Stage 4
      log: [],         // [{date, theme, source, url, summary, reviewed}]
      apiLog: [],      // [{ts, endpoint, tokensIn, tokensOut, cost?}]
      commonplace: [], // user-saved excerpts
      weekCount: {},   // ISO-week -> count, for the 5/wk cap
    },
    breathwork: [],    // [{date, rounds, breaths, holds:[sec,...], best}]
    boxing: [],        // [{date, type, rounds, exertion, focus, resistance, partner?, exposed?, drill?}]
    runs: [],          // [{date, distanceKm, timeSec, resistance}]
    wake: [],          // [{date, isoTime, coffee}]
  });

  function read() {
    try {
      const raw = localStorage.getItem(ROOT_KEY);
      if (!raw) return defaultRoot();
      const parsed = JSON.parse(raw);
      // Defensive merge in case schema grew
      const base = defaultRoot();
      return Object.assign(base, parsed, {
        settings: Object.assign(base.settings, parsed.settings || {}),
        research: Object.assign(base.research, parsed.research || {}),
      });
    } catch (e) {
      console.error('storage read failed', e);
      return defaultRoot();
    }
  }

  function write(state) {
    localStorage.setItem(ROOT_KEY, JSON.stringify(state));
  }

  function update(mutator) {
    const s = read();
    mutator(s);
    write(s);
    return s;
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function isoWeek(d = new Date()) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
  }

  function daysSinceFirstEntry() {
    const s = read();
    const dates = Object.keys(s.days).sort();
    if (!dates.length) return 0;
    const first = new Date(dates[0]);
    const now = new Date();
    return Math.floor((now - first) / 86400000);
  }

  function reflectionEntryCount() {
    const s = read();
    return Object.values(s.days).filter(d => d.svadhyaya && (
      (d.svadhyaya.q1 || '').trim() ||
      (d.svadhyaya.q2 || '').trim() ||
      (d.svadhyaya.q3 || '').trim() ||
      (d.svadhyaya.q4 || '').trim()
    )).length;
  }

  function exportJson() {
    return JSON.stringify(read(), null, 2);
  }

  function importJson(text) {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object') throw new Error('bad payload');
    write(parsed);
    return parsed;
  }

  global.SadhanaStorage = {
    ROOT_KEY,
    read, write, update,
    today, isoWeek,
    daysSinceFirstEntry,
    reflectionEntryCount,
    exportJson, importJson,
  };
})(typeof window !== 'undefined' ? window : globalThis);
