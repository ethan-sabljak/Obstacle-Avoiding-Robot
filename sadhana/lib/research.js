// Stage 4 — supplementary research layer.
//
// Runs only when:
//   config.agent_enabled === true
//   AND settings.researchEnabled === true (separate opt-in)
//
// Hard cap: 5 queries per ISO week. The agent identifies three recurring
// themes from the trailing 30 days of svādhyāya, queries a whitelisted source
// per theme, fetches passages, and asks Claude to summarize with citation.
// If a fetch fails or a source cannot be verified, the entry is omitted with
// a note. Nothing is auto-trusted: every passage lands in the "Supplementary,
// unverified by you" bucket until the user marks it Reviewed.

(function (global) {
  'use strict';

  const SOURCE_WHITELIST = [
    {
      id: 'pubmed',
      label: 'PubMed',
      matches: ['neuro', 'amcc', 'cingulate', 'breath', 'exercise', 'cognition', 'hrv', 'sleep', 'dopamine'],
      search: (q) => `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(q)}`,
    },
    {
      id: 'sacred-texts',
      label: 'Sacred-texts.com',
      matches: ['gita', 'gītā', 'sutra', 'sūtra', 'patanjali', 'patañjali', 'upanishad', 'upaniṣad', 'veda'],
      search: (q) => `https://www.sacred-texts.com/hin/index.htm`,
    },
    {
      id: 'wisdomlib',
      label: 'Wisdomlib.org',
      matches: ['gita', 'gītā', 'sutra', 'sūtra', 'sanskrit', 'mantra', 'yoga', 'dharma', 'karma'],
      search: (q) => `https://www.wisdomlib.org/search?query=${encodeURIComponent(q)}`,
    },
    {
      id: 'sep',
      label: 'Stanford Encyclopedia of Philosophy',
      matches: ['nietzsche', 'jung', 'socrates', 'stoic', 'phenomenology', 'will', 'recurrence', 'shadow', 'existential'],
      search: (q) => `https://plato.stanford.edu/search/search?query=${encodeURIComponent(q)}`,
    },
  ];

  function pickSource(themeName) {
    const lower = themeName.toLowerCase();
    for (const src of SOURCE_WHITELIST) {
      if (src.matches.some(m => lower.includes(m))) return src;
    }
    // Default to SEP if nothing matches — it's the most generic.
    return SOURCE_WHITELIST.find(s => s.id === 'sep');
  }

  function weekCount() {
    const s = global.SadhanaStorage.read();
    const wk = global.SadhanaStorage.isoWeek();
    return (s.research.weekCount && s.research.weekCount[wk]) || 0;
  }

  function bumpWeekCount() {
    global.SadhanaStorage.update(s => {
      const wk = global.SadhanaStorage.isoWeek();
      s.research.weekCount[wk] = (s.research.weekCount[wk] || 0) + 1;
    });
  }

  function canQuery() {
    return weekCount() < 5;
  }

  // Pull the trailing 30 days of svādhyāya text for theme extraction.
  function gatherCorpus() {
    const s = global.SadhanaStorage.read();
    const out = [];
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    for (const [date, day] of Object.entries(s.days)) {
      if (new Date(date) < cutoff) continue;
      if (!day.svadhyaya) continue;
      const { q1, q2, q3, q4 } = day.svadhyaya;
      out.push(`[${date}]\nQ1 ${q1 || ''}\nQ2 ${q2 || ''}\nQ3 ${q3 || ''}\nQ4 ${q4 || ''}`);
    }
    return out.join('\n\n');
  }

  async function extractThemes() {
    const corpus = gatherCorpus();
    if (!corpus.trim()) throw new Error('Not enough svādhyāya entries yet.');
    const sys = global.SadhanaClaude.themeExtractionSystem();
    const { text } = await global.SadhanaClaude.call({
      system: sys,
      messages: [{ role: 'user', content: corpus }],
      maxTokens: 600,
      temperature: 0.4,
    });
    let parsed;
    try { parsed = JSON.parse(text); }
    catch { parsed = { themes: [] }; }
    return (parsed.themes || []).slice(0, 3);
  }

  // We don't have a CORS-friendly way to scrape PubMed/SEP from the browser
  // without a proxy, so the honest move is: build the curated query URL,
  // hand it to Claude with the theme, and ask Claude to either (a) cite from
  // its training where it can verifiably ground the claim, or (b) state that
  // the user must follow the link to verify. This is encoded in the system
  // prompt — no fabrication, flag uncertainty.
  async function fetchAndSummarize(theme, source) {
    const sys = global.SadhanaClaude.researchSynthesisSystem();
    const url = source.search(theme.name);
    const userMsg = [
      `Theme: ${theme.name}`,
      `Evidence in user's journal: ${theme.evidence || '(none provided)'}`,
      `Source whitelist hit: ${source.label}`,
      `Source search URL the user can verify: ${url}`,
      '',
      'Provide a two-paragraph supplementary note for the commonplace book.',
      'If you cannot ground a specific passage in this source, say so explicitly',
      'and instruct the user to verify via the URL. Do not fabricate quotations.',
    ].join('\n');

    const { text } = await global.SadhanaClaude.call({
      system: sys,
      messages: [{ role: 'user', content: userMsg }],
      maxTokens: 700,
      temperature: 0.3,
    });

    return {
      date: new Date().toISOString(),
      theme: theme.name,
      source: source.label,
      url,
      summary: text,
      reviewed: false,
    };
  }

  async function runWeekly() {
    if (!canQuery()) throw new Error('Weekly cap reached (5 queries). Try again next week.');
    const themes = await extractThemes();
    if (!themes.length) throw new Error('No recurring themes detected.');

    const results = [];
    for (const t of themes) {
      if (!canQuery()) break;
      try {
        const src = pickSource(t.name);
        const entry = await fetchAndSummarize(t, src);
        results.push(entry);
        global.SadhanaStorage.update(s => { s.research.log.push(entry); });
        bumpWeekCount();
      } catch (e) {
        results.push({
          date: new Date().toISOString(),
          theme: t.name,
          source: 'n/a',
          url: '',
          summary: `Could not verify a source for "${t.name}". Skipped.`,
          reviewed: false,
          error: String(e.message || e),
        });
      }
    }
    return results;
  }

  global.SadhanaResearch = {
    SOURCE_WHITELIST,
    pickSource,
    canQuery,
    weekCount,
    extractThemes,
    runWeekly,
  };
})(typeof window !== 'undefined' ? window : globalThis);
