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
        startDate: null,        // ISO date when the 9-movement arc began
        monthDays: 40,          // 40-day discipline (Kundalini / Sikh tradition)
        qualities: defaultQualities(),
      },
      sits: [],                 // [{id, date, durationSec, breath, completed, mantraId}]
      mantras: [],              // [{id, created, core, affirmationIds:[], breath, archived}]
      activeMantraId: null,
      japaSessions: [],         // [{id, date, mantraId, count, durationSec}]
      whyChains: [],            // [{id, date, root, chain:[{q,a}]}]
      wrongThoughts: [],        // [{id, date, belief, counter}]
    },
  });

  function defaultQualities() {
    return [
      { order: 1, key: 'bhaya', en: 'Embracing Fear', skt: 'Bhaya → Abhaya', deva: 'भय → अभय',
        gloss: 'The first movement is not the elimination of fear — it is the embrace of fear. You walk toward what you fear, not away. Patañjali names abhiniveśa, the clinging to life, as the deepest of the kleśas; the Gītā opens its catalogue of divine qualities (16.1) with abhayam, fearlessness. Abhaya is what is left when bhaya has been turned to face. The embrace dissolves the grip.',
        affirmations: [
          'I walk toward what I fear, not away from it.',
          'The cave I fear to enter holds the treasure I seek.',
          'I am the witness of fear, not its property.',
          'Abhayam — fearlessness is what is left when fear has been turned to face.',
        ],
        regimen: {
          daily: 'Name one specific fear in the morning log. Take one concrete action toward it before noon. Daily cold exposure ≥ 2 min (Hof). Mantra-japa 108x post-breathwork.',
          breath: 'Wim Hof — 30 deep, exhale hold, recovery breath. The fear-organ (limbic) yields to autonomic mastery.',
          commitment: 'For 40 days, do not flee a single named fear. Walk toward each one. Cold shower or ice bath every day.',
          landed: 'You notice fear arising and your body does not contract. The action begins before the fear-thought finishes.',
          anchors: 'Gītā 16.1 (abhayam first); Patañjali 2.9 (abhiniveśa); Goggins (40% rule); Hof (cold + breath).',
        } },
      { order: 2, key: 'jijnasa', en: 'Curiosity', skt: 'Jijñāsā', deva: 'जिज्ञासा',
        gloss: 'The desire to know. The Brahma Sūtras open with athāto brahma-jijñāsā — "now therefore, the inquiry into brahman." Once fear loosens, the natural orientation is toward what one does not yet understand. Curiosity is what fills the space fear vacates.',
        affirmations: [],
        regimen: {
          daily: 'Three questions a day, captured. One must be a question you do not already have an answer to. 20 min reading outside your domain.',
          breath: 'Box breath (4-4-4-4). Symmetry opens the mind that asks symmetrical questions.',
          commitment: 'No closing a question with "I already know." 40 days of the open question.',
          landed: 'You catch yourself opening rather than concluding. The reflex of the answer-having is replaced by the reflex of the question-asking.',
          anchors: 'Brahma Sūtra 1.1.1; Socratic paradox (Apology 21d); Huberman on neuroplasticity through novelty.',
        } },
      { order: 3, key: 'smriti', en: 'Memory', skt: 'Smṛti', deva: 'स्मृति',
        gloss: 'Memory not as recall of facts but as continuity of awareness — the thread held through time. Patañjali 1.20 names smṛti as the third of the five aids to samādhi. The capacity to remember why you started while in the middle of what you are doing.',
        affirmations: [],
        regimen: {
          daily: 'Evening recall: reconstruct the day backward, hour by hour, without consulting notes. Method-of-loci on one new memory palace per week. Re-read one past svādhyāya entry.',
          breath: 'Nāḍī shodhana (alternate nostril). Balances the hemispheres that hold the thread.',
          commitment: 'Daily backward day-review. No phone for the first 30 minutes after waking.',
          landed: 'You can re-narrate the past week in detail. The why you started no longer drifts away during the doing.',
          anchors: 'Yoga Sūtra 1.20; Dispenza on memory as identity substrate; classical mnemonic tradition.',
        } },
      { order: 4, key: 'ekagrata', en: 'Attention', skt: 'Ekāgratā', deva: 'एकाग्रता',
        gloss: 'Single-pointed attention. The capacity to hold one object before the mind without scattering. Months 3 and 4 are paired because memory and attention are the same capacity at different time-scales — attention is memory in the present moment.',
        affirmations: [],
        regimen: {
          daily: 'Two 90-minute deep-work blocks. No phone in the room. One sit per day with a single point of attention (breath or candle flame).',
          breath: 'Free, slow nasal. The breath is itself the object.',
          commitment: 'No multi-tasking for 40 days. One thing at a time, or the task is paused.',
          landed: 'You finish a long block without checking the time. Distraction registers without taking you.',
          anchors: 'Yoga Sūtra 3.1–3.2 (dhāraṇā, dhyāna); Cal Newport on deep work; Huberman on the 90-min ultradian cycle.',
        } },
      { order: 5, key: 'dhrti', en: 'Determination', skt: 'Dhṛti', deva: 'धृति',
        gloss: 'The holding-firm. Gītā 18.33–35 distinguishes three modes of dhṛti by guṇa — the sāttvic form is sustained will toward what is true. This is the month of resolve, the 40-day discipline made literal: one commitment held without exception.',
        affirmations: [],
        regimen: {
          daily: 'One commitment, held without exception. Same time, same act, every day. Logged with a single tick. Goggins-style accountability mirror in the morning.',
          breath: 'Bhastrikā — bellows breath. The body trained to hold under load.',
          commitment: 'Choose the hardest single commitment and hold it 40 days. If broken, the count restarts. Public stake optional.',
          landed: 'The commitment is no longer effortful. It is the floor, not the ceiling.',
          anchors: 'Gītā 18.33 (sāttvic dhṛti); Kundalini 40-day discipline (Yogi Bhajan); Goggins (accountability mirror); Hill (auto-suggestion).',
        } },
      { order: 6, key: 'pratibha', en: 'Art / Imagination', skt: 'Pratibhā', deva: 'प्रतिभा',
        gloss: 'Creative insight; the intuitive flash. In Patañjali 3.33, pratibhā arises when discrimination matures — knowledge that is not deduced but seen. The artistic capacity is its earthly form; the same word names both poetic inspiration and yogic intuition.',
        affirmations: [],
        regimen: {
          daily: 'Make before consume. The first creative hour is output, not input. Ship something tiny — a sentence, a sketch, a riff — every day. Morning pages 3 longhand sheets.',
          breath: 'Free, alternating between deep belly and slow exhale. The breath of the maker.',
          commitment: 'No consumption (social, news, video) before the daily make-block. 40 days.',
          landed: 'The work begins before the inspiration arrives. The flash comes from the practice, not before it.',
          anchors: 'Yoga Sūtra 3.33; Abhinavagupta on rasa; Tool as the example of pratibhā disciplined; Rick Rubin on the artist as conduit.',
        } },
      { order: 7, key: 'virya', en: 'Courage / Will', skt: 'Vīrya', deva: 'वीर्य',
        gloss: 'Energy, courage, virile force. The second of the five aids to samādhi in Patañjali 1.20 — after śraddhā (faith) and before smṛti, samādhi, prajñā. Distinct from raw strength: vīrya is the courage that keeps moving when strength has failed.',
        affirmations: [],
        regimen: {
          daily: 'One act of moral courage per day, however small. The unspoken sentence spoken. The hard conversation initiated. Sparring round taken seriously — eye contact, no flinch.',
          breath: 'Kapālabhātī — skull-shining breath. The fire of will, generated.',
          commitment: 'No avoidance of the hard conversation for 40 days. The thing you would rather not say, said.',
          landed: 'You begin to look forward to the thing that used to require courage. The courage has become character.',
          anchors: 'Yoga Sūtra 1.20; Gītā 2.3 (klaibyaṃ mā sma); Goggins (cookie jar of past hardships); Tyson (the mouth).',
        } },
      { order: 8, key: 'sakti', en: 'Power / Strength', skt: 'Śakti', deva: 'शक्ति',
        gloss: 'Power, capacity, the active principle. Where vīrya is the willingness to act, śakti is the capacity to act. The eighth month is where the inward cultivation becomes outwardly visible — the body trained, the work shipped, the position taken.',
        affirmations: [],
        regimen: {
          daily: 'Heavy training block — strength PRs tracked weekly. One piece of public work shipped per week. Body and word both become heavier and more accurate.',
          breath: 'Ujjāyī under load. The breath holds the weight.',
          commitment: 'Every week of the 40 days, one PR (physical or shipped work). Visible to others.',
          landed: 'Others notice before you announce. The capacity has become legible without explanation.',
          anchors: 'Tantric Śākta sources; Devī Māhātmya; Goggins (uncommon among the uncommon); strength-training fundamentals (5x5, progressive overload).',
        } },
      { order: 9, key: 'sattva', en: 'Bravery / Spirit', skt: 'Sattva · Prajñā', deva: 'सत्त्व · प्रज्ञा',
        gloss: 'Sattva — luminosity, being; prajñā — wisdom, the fifth and final aid to samādhi (Patañjali 1.20). The ninth movement is not a quality added but the harmonic sounding of all eight before it. The orchestra at full volume — the integrated being who is no longer the sum of qualities cultivated, but their resolution.',
        affirmations: [],
        regimen: {
          daily: 'Long sit (30+ min) in the morning. Reduced inputs. The day held in awareness without grasping. Integration journal in the evening — what is the harmonic of today\'s eight notes?',
          breath: 'Natural breath, observed without modification. The breath returns to what it is.',
          commitment: 'One day per week of silence (no speech, no screens). The 40 days end in a 3-day retreat if possible.',
          landed: 'You meet yourself in the mirror and the witness and the witnessed are the same. The work has produced not a better person but a more transparent one.',
          anchors: 'Yoga Sūtra 1.20, 1.49, 4.34 (kaivalya); Gītā 14.6 (sattva); Dispenza on becoming the field; the cumulative sounding of all prior movements.',
        } },
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
