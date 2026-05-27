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
    sankalpa: {        // The 9-month orchestra and the daily practice
      orchestra: {
        startDate: null,        // ISO date when the 9-month arc began
        monthDays: 30,          // days per movement
        qualities: defaultQualities(),
      },
      mantras: [],              // [{id, created, core, affirmationIds:[], breath, archived}]
      activeMantraId: null,
      japaSessions: [],         // [{id, date, mantraId, count, durationSec}]
      whyChains: [],            // [{id, date, root, chain:[{q,a}]}]
      wrongThoughts: [],        // [{id, date, belief, counter}]
    },
  });

  function defaultQualities() {
    return [
      { order: 1, key: 'bhaya',     en: 'Embracing Fear',          skt: 'Bhaya → Abhaya',  deva: 'भय → अभय',
        gloss: 'The first movement is not the elimination of fear — it is the embrace of fear. You walk toward what you fear, not away. Patañjali names abhiniveśa, the clinging to life, as the deepest of the kleśas; the Gītā opens its catalogue of divine qualities (16.1) with abhayam, fearlessness. Abhaya is what is left when bhaya has been turned to face. The embrace dissolves the grip.',
        affirmations: [] },
      { order: 2, key: 'jijnasa',   en: 'Curiosity',               skt: 'Jijñāsā',         deva: 'जिज्ञासा',
        gloss: 'The desire to know. The Brahma Sūtras open with athāto brahma-jijñāsā — "now therefore, the inquiry into brahman." Once fear loosens, the natural orientation is toward what one does not yet understand.',
        affirmations: [] },
      { order: 3, key: 'smriti',    en: 'Memory',                  skt: 'Smṛti',           deva: 'स्मृति',
        gloss: 'Memory not as recall of facts but as continuity of awareness — the thread held through time. Patañjali 1.20 names smṛti as the third of the five aids to samādhi.',
        affirmations: [] },
      { order: 4, key: 'ekagrata',  en: 'Attention',               skt: 'Ekāgratā',        deva: 'एकाग्रता',
        gloss: 'Single-pointed attention. The capacity to hold one object before the mind without scattering. Months 3 and 4 are paired because memory and attention are the same capacity at different time-scales.',
        affirmations: [] },
      { order: 5, key: 'dhrti',     en: 'Determination',           skt: 'Dhṛti',           deva: 'धृति',
        gloss: 'The holding-firm. Gītā 18.33–35 distinguishes three modes of dhṛti by guṇa — the sāttvic form is sustained will toward what is true. This is the month of resolve.',
        affirmations: [] },
      { order: 6, key: 'pratibha',  en: 'Art / Imagination',       skt: 'Pratibhā',        deva: 'प्रतिभा',
        gloss: 'Creative insight; the intuitive flash. In Patañjali 3.33, pratibhā arises when discrimination matures — knowledge that is not deduced but seen. The artistic capacity is its earthly form.',
        affirmations: [] },
      { order: 7, key: 'virya',     en: 'Courage / Will',          skt: 'Vīrya',           deva: 'वीर्य',
        gloss: 'Energy, courage, virile force. The second of the five aids to samādhi in Patañjali 1.20. Distinct from raw strength: vīrya is courage that keeps moving when strength fails.',
        affirmations: [] },
      { order: 8, key: 'sakti',     en: 'Power / Strength',        skt: 'Śakti',           deva: 'शक्ति',
        gloss: 'Power, capacity, the active principle. Where vīrya is the willingness to act, śakti is the capacity to act. The eighth month is where the inner cultivation becomes outwardly visible.',
        affirmations: [] },
      { order: 9, key: 'sattva',    en: 'Bravery / Spirit',        skt: 'Sattva · Prajñā', deva: 'सत्त्व · प्रज्ञा',
        gloss: 'Sattva — luminosity, being; prajñā — wisdom, the fifth and final aid to samādhi (Patañjali 1.20). The ninth month is the integration: not a quality added but the harmonic sounding of all eight before it. The orchestra at full volume.',
        affirmations: [] },
    ];
  }

  function read() {
    try {
      const raw = localStorage.getItem(ROOT_KEY);
      if (!raw) return defaultRoot();
      const parsed = JSON.parse(raw);
      // Defensive merge in case schema grew
      const base = defaultRoot();
      const sankalpaParsed = parsed.sankalpa || {};
      const merged = Object.assign(base, parsed, {
        settings: Object.assign(base.settings, parsed.settings || {}),
        research: Object.assign(base.research, parsed.research || {}),
        sankalpa: Object.assign(base.sankalpa, sankalpaParsed, {
          orchestra: Object.assign(base.sankalpa.orchestra, sankalpaParsed.orchestra || {}),
        }),
      });
      // If existing user has no qualities array, seed it; if they have one, keep it.
      if (!Array.isArray(merged.sankalpa.orchestra.qualities) || !merged.sankalpa.orchestra.qualities.length) {
        merged.sankalpa.orchestra.qualities = defaultQualities();
      }
      return merged;
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
