// Anthropic API wrapper for Sādhanā.
// All calls go directly from the browser to api.anthropic.com using the user's
// own key, stored in localStorage. We never proxy through any third party.
//
// Model: claude-opus-4-7.

(function (global) {
  'use strict';

  const API_URL = 'https://api.anthropic.com/v1/messages';
  const MODEL = 'claude-opus-4-7';

  async function call({ system, messages, maxTokens = 2048, temperature = 0.7 }) {
    const store = global.SadhanaStorage.read();
    const apiKey = (store.settings && store.settings.apiKey) || '';
    if (!apiKey) throw new Error('No API key. Open Settings and add yours.');

    const body = {
      model: MODEL,
      max_tokens: maxTokens,
      temperature,
      system,
      messages,
    };

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Claude API ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const text = (data.content || [])
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n');

    // Log usage so the user sees what the agent is doing
    global.SadhanaStorage.update(s => {
      s.research.apiLog.push({
        ts: new Date().toISOString(),
        endpoint: 'messages',
        tokensIn: data.usage ? data.usage.input_tokens : null,
        tokensOut: data.usage ? data.usage.output_tokens : null,
        model: MODEL,
      });
      // keep the last 200 entries
      if (s.research.apiLog.length > 200) {
        s.research.apiLog = s.research.apiLog.slice(-200);
      }
    });

    return { text, raw: data };
  }

  // Loads the two ground-context files. They sit on disk next to this app.
  async function loadGroundContext() {
    const out = { philosophy: '', conversation: '' };
    try {
      const r = await fetch('context/philosophy.md');
      if (r.ok) out.philosophy = await r.text();
    } catch (_) {}
    try {
      const r = await fetch('context/conversation.md');
      if (r.ok) out.conversation = await r.text();
    } catch (_) {}
    return out;
  }

  // Build the reflector system prompt. Stage 2.
  function reflectorSystem({ philosophy, conversation }) {
    return [
      'You are the reflective companion for a practice called Sādhanā.',
      'Your role is svādhyāya — the mirror that does not flatter.',
      '',
      'Rules:',
      '• Name patterns honestly, not flatter. Compliments without observation are noise.',
      '• Cross-reference today\'s entry against the trailing 30 days the user provides.',
      '• Flag recurring shadow material — the same trigger appearing repeatedly is the signal.',
      '• Use Gītā, Patañjali, Jung, Nietzsche framing only where it genuinely fits — never decoratively.',
      '• End with exactly one specific question for tomorrow\'s review. Not a summary. Not platitude.',
      '• If the data is thin or contradictory, say so. Do not invent a pattern.',
      '',
      '— Philosophical ground —',
      philosophy || '(no philosophy.md found)',
      '',
      '— Conversation ground —',
      conversation || '(no conversation.md provided)',
    ].join('\n');
  }

  // Stage 3 — tomorrow's draft.
  function plannerSystem({ philosophy }) {
    return [
      'You are the planning companion for Sādhanā.',
      'Given the user\'s last 30 days of completed vs planned tasks, average actual vs estimated minutes,',
      'resistance task completion rate, and weekly boxing template, propose tomorrow:',
      '',
      '  • Three Resistance tasks (max 3, aMCC builders, weighted toward what the user has been avoiding)',
      '  • Four Deep Work block assignments (60–90 min each), matched to the times the user actually performs',
      '  • Schedule adjustments grounded in observed patterns (cite the numbers)',
      '',
      'Return JSON with this exact shape:',
      '{ "resistance": [{"title":"","why":""}, ...3], "deepWork": [{"block":"AM1","task":"","minutes":90}, ...], "adjustments":[""], "rationale":"" }',
      '',
      'No prose outside the JSON. The user reviews, edits, accepts or rejects. Never auto-commit.',
      '',
      '— Philosophical ground —',
      philosophy || '(no philosophy.md found)',
    ].join('\n');
  }

  // Stage 4 — research extraction and synthesis system prompts.
  function themeExtractionSystem() {
    return [
      'You extract the three most-recurring themes from a user\'s 30-day reflective journal.',
      'Return JSON: { "themes": [{"name":"", "evidence":"short quote or pattern"}, ...3] }',
      'No prose outside the JSON. If fewer than three real themes are present, return fewer.',
    ].join('\n');
  }

  function researchSynthesisSystem() {
    return [
      'You summarize a fetched passage for the user\'s commonplace book.',
      'Strict rules:',
      '• If the source text cannot ground a claim, say so. Do not synthesize beyond what the source supports.',
      '• Flag uncertainty in plain language.',
      '• Never fabricate citations. Quote sparingly. Cite the source URL.',
      '• Two short paragraphs maximum.',
    ].join('\n');
  }

  global.SadhanaClaude = {
    MODEL,
    call,
    loadGroundContext,
    reflectorSystem,
    plannerSystem,
    themeExtractionSystem,
    researchSynthesisSystem,
  };
})(typeof window !== 'undefined' ? window : globalThis);
