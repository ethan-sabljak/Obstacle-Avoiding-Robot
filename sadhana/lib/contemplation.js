// Contemplation — manana, the sustained turning-over of a teaching until
// it ceases to be other than oneself.
//
// Each entry is a passage held for contemplation, with the surrounding
// context the quote was lifted from, the reason it earned a place in this
// practice, and two or three prompts for the witness to take into the day.
//
// Schema:
//   text:    the quoted passage
//   attr:    citation
//   tradition: the lineage it belongs to (for grouping)
//   context: 1–2 sentences on the surrounding text
//   why:     1–2 sentences on its place in this practice
//   prompts: 2–3 specific reflection prompts

(function (global) {
  'use strict';

  const CONTEMPLATIONS = [
    {
      text: 'You have a right to action alone, never to its fruits.',
      attr: 'Bhagavad Gītā 2.47',
      tradition: 'Gītā',
      context: 'Spoken by Krishna to Arjuna after his battlefield collapse. Arjuna has thrown down his bow; Krishna is teaching karma-yoga as the way out of paralysis — action performed without grasping its result.',
      why: 'The cure for outcome-anxiety. It does not say do not care; it says you cannot own the result. Releasing the grip is what permits the action that the grip was blocking.',
      prompts: [
        'What action am I avoiding because I cannot control its outcome?',
        'Where am I performing the action but secretly holding the fruit?',
      ],
    },
    {
      text: 'Klaibyaṃ mā sma gamaḥ pārtha — yield not to unmanliness. Stand up.',
      attr: 'Bhagavad Gītā 2.3',
      tradition: 'Gītā',
      context: 'Krishna\'s first command to Arjuna. Not consolation. Not validation. A direct refusal of the collapse and a demand for the standing-up that precedes the teaching.',
      why: 'The Gītā is the only honest self-help book because its first move is to refuse comfort. Most paralysis ends here, if it ends at all — with someone refusing to flatter the collapse.',
      prompts: [
        'Where is something inside me collapsing, asking to be consoled?',
        'What does standing up look like, concretely, today?',
      ],
    },
    {
      text: 'Yogaś citta-vṛtti-nirodhaḥ.',
      attr: 'Yoga Sūtra 1.2',
      tradition: 'Patañjali',
      context: 'The second sūtra. Patañjali defines yoga in four words: the stilling of the modifications of the mind. Everything else in the text is method.',
      why: 'The entire practice compressed to a definition. Useful as a corrective when the practice begins to feel like accumulation — of streaks, hours, knowledge. The aim is stilling, not accumulating.',
      prompts: [
        'Which modification of mind dominated today?',
        'Did the practice still it, or feed it?',
      ],
    },
    {
      text: 'Abhyāsa-vairāgyābhyāṃ tan-nirodhaḥ.',
      attr: 'Yoga Sūtra 1.12',
      tradition: 'Patañjali',
      context: 'Patañjali names the two instruments of stilling: abhyāsa (sustained practice) and vairāgya (non-attachment). The next two sūtras define each. Neither works without the other.',
      why: 'The structural test for whether a practice is still alive. If abhyāsa without vairāgya, the practice has become compulsion. If vairāgya without abhyāsa, the practice has become drift.',
      prompts: [
        'Which of the two is undernourished this week?',
        'Where am I gripping the fruit of a practice I am doing well?',
      ],
    },
    {
      text: 'He who has a why to live can bear almost any how.',
      attr: 'Nietzsche, Twilight of the Idols I.12',
      tradition: 'Nietzsche',
      context: 'Nietzsche\'s aphorism on the structural primacy of meaning over circumstance. Later quoted by Viktor Frankl as the central insight of his survival in the camps.',
      why: 'The schedule\'s severity is bearable only if the why is clear. Without it, the morning anchor becomes punishment. With it, the morning anchor becomes obvious.',
      prompts: [
        'Can I state today\'s why in one sentence, without flinching?',
        'Where did I confuse the how for the why?',
      ],
    },
    {
      text: 'One does not become enlightened by imagining figures of light, but by making the darkness conscious.',
      attr: 'C.G. Jung, Alchemical Studies, CW 13 §335',
      tradition: 'Jung',
      context: 'Jung\'s late formulation of individuation. Against spiritual bypass — the imagination of perfection — and toward integration of what has been refused.',
      why: 'The single sentence that distinguishes svādhyāya from self-improvement. The work is making the dark conscious, not imagining oneself already light.',
      prompts: [
        'What darkness am I imagining as light?',
        'What in me have I refused to host this week?',
      ],
    },
    {
      text: 'Everybody has a plan until they get punched in the mouth.',
      attr: 'Mike Tyson',
      tradition: 'Boxing',
      context: 'Tyson, before a 1987 fight, asked about an opponent\'s strategy. The pre-fight quote that became the most accurate piece of phenomenology ever spoken by a heavyweight.',
      why: 'The mouth is the precise point where the constructed self meets reality. Training is the construction of an underneath worth giving way to.',
      prompts: [
        'Where today did the plan meet the mouth?',
        'What was underneath when the plan dissolved?',
      ],
    },
    {
      text: 'The cave you fear to enter holds the treasure you seek.',
      attr: 'Joseph Campbell',
      tradition: 'Campbell',
      context: 'Campbell\'s synthesis of the hero\'s journey across cultures. The cave is what the practitioner has refused to look at; the treasure is the energy held by the refusal.',
      why: 'The recurring theme in the trailing 30 days of svādhyāya is the cave. The agent\'s job is to point at the entrance.',
      prompts: [
        'What cave have I been circling without entering?',
        'What would entering it cost me today?',
      ],
    },
    {
      text: 'The unexamined life is not worth living.',
      attr: 'Plato, Apology 38a',
      tradition: 'Socratic',
      context: 'Socrates\' defense at his trial, after being condemned. He refuses to stop philosophizing in exchange for his life. The examined life is the only life worth the breath spent on it.',
      why: 'The svādhyāya practice in one sentence. The fourth question — would I live this day again — is its operational form.',
      prompts: [
        'Did I examine today, or did I just live it?',
        'What did I leave unexamined because examining it was costly?',
      ],
    },
    {
      text: 'I know that I know nothing.',
      attr: 'Socrates (paraphrased), Apology 21d',
      tradition: 'Socratic',
      context: 'Socrates\' interpretation of the oracle at Delphi: he is wiser than other men only in that he does not pretend to know what he does not know.',
      why: 'The agent inherits this posture by instruction. The honest "I do not know" is more useful than the confident wrong. The same applies to the user.',
      prompts: [
        'What am I currently pretending to know?',
        'Where would saying "I do not know" be the more useful move?',
      ],
    },
    {
      text: 'You could leave life right now. Let that determine what you do and say and think.',
      attr: 'Marcus Aurelius, Meditations 2.11',
      tradition: 'Stoic',
      context: 'The emperor writing to himself. Memento mori as not morbid but clarifying — the awareness of death stripping away what does not matter.',
      why: 'The structurally identical move to Patañjali\'s abhiniveśa: loosening the unconscious clinging to life that distorts every other choice.',
      prompts: [
        'If today were the last, what would I refuse to spend it on?',
        'What am I postponing as if I had infinite time?',
      ],
    },
    {
      text: 'It is not death that a man should fear, but he should fear never beginning to live.',
      attr: 'Marcus Aurelius, Meditations (frequently attributed; see also 12.1)',
      tradition: 'Stoic',
      context: 'Marcus on the structural error of the postponed life. The fear is misplaced: the danger is not the ending, it is the never-beginning.',
      why: 'The diagnosis of the comfortably numb life. The cold shower this morning was a small refusal of the never-beginning.',
      prompts: [
        'What have I postponed beginning?',
        'What would beginning, today, look like in concrete form?',
      ],
    },
    {
      text: 'Character is fate.',
      attr: 'Heraclitus, Fragment B119',
      tradition: 'Pre-Socratic',
      context: 'Three Greek words: ēthos anthrōpōi daimōn. The daimōn — your guiding spirit, your fate — is your ethos, your character. Not external. Internal.',
      why: 'The five-year question. The character built by this year\'s abhyāsa is the fate of next year\'s practice.',
      prompts: [
        'What did today\'s actions tell me about my character?',
        'If today were five years repeated, what fate does it shape?',
      ],
    },
    {
      text: 'Be like water — find the lowest place; nothing is softer, yet nothing wears the hard down.',
      attr: 'Lao Tzu, Tao Te Ching 78 (paraphrased)',
      tradition: 'Taoist',
      context: 'Lao Tzu\'s recurring image: water as the model of effective action. Yielding, persistent, unforced, ultimately irresistible.',
      why: 'A corrective to the all-tapas distortion of the practice. Not everything is overcome by force. Some things are overcome by persistence and yielding.',
      prompts: [
        'Where am I trying to force what water would wear down?',
        'Where could I yield without abandoning?',
      ],
    },
    {
      text: 'The obstacle is the way.',
      attr: 'Marcus Aurelius, Meditations 5.20',
      tradition: 'Stoic',
      context: 'Marcus: what stands in the way becomes the way. The impediment to action advances action; the obstacle becomes the path.',
      why: 'The aMCC\'s working principle in five words. The resistance score is the metric of how much of the way you walked today.',
      prompts: [
        'What did I treat as an obstacle that was actually the path?',
        'Where am I waiting for the path to clear before walking it?',
      ],
    },
    {
      text: 'What stands in the way becomes the way.',
      attr: 'Ryan Holiday, after Marcus',
      tradition: 'Stoic',
      context: 'The modern restatement, sharper. Same teaching, no Latin.',
      why: 'Held alongside Marcus to mark the distance and the closeness of the two formulations. Same arrow, two thousand years.',
      prompts: [
        'What stood in the way today, and what did I make of it?',
      ],
    },
    {
      text: 'Sit, walk, or run, but do not wobble.',
      attr: 'Zen proverb (attrib. various, often Yún Mén)',
      tradition: 'Zen',
      context: 'The Zen direction toward decisive action in any posture. Indecision is the only forbidden state. The action chosen is less important than the wobbling refused.',
      why: 'Resistance task as decisive cut. Maintenance task as decisive cut. The wobbling between is where the day disappears.',
      prompts: [
        'Where did I wobble today instead of choosing?',
        'What would the non-wobbling version of this hour look like?',
      ],
    },
    {
      text: 'Practice is the path. Practice is not preparation for the path.',
      attr: 'Adapted from Dōgen, Genjō-kōan',
      tradition: 'Zen',
      context: 'Dōgen\'s formulation: enlightenment is not after practice; it is practice. Practice-realization (shushō-ichinyo) is the technical phrase.',
      why: 'A corrective to the agent\'s temptation to treat the practice as preparation for some later, better practice. There is no later, better. There is only today, examined.',
      prompts: [
        'Did I do today\'s practice as itself, or as a rehearsal?',
      ],
    },
    {
      text: 'I am time, the destroyer of worlds.',
      attr: 'Bhagavad Gītā 11.32 — kālo \'smi loka-kṣaya-kṛt',
      tradition: 'Gītā',
      context: 'Krishna\'s theophany in chapter 11, revealing his cosmic form to Arjuna. The verse Oppenheimer quoted at Trinity. Time as the field of all action and the end of all action.',
      why: 'The schedule is kāla made local. The Sunday weekly review is the small instantiation of the same gaze: what time consumed this week, what survived.',
      prompts: [
        'What did time consume this week that I was holding onto?',
        'What survived, and why did it survive?',
      ],
    },
    {
      text: 'That which does not kill me makes me stronger.',
      attr: 'Nietzsche, Twilight of the Idols I.8',
      tradition: 'Nietzsche',
      context: 'Nietzsche\'s most famous aphorism, frequently misread. Not every suffering strengthens. The aphorism describes a *capacity* — that which is survived, integrated, made part of the person, strengthens.',
      why: 'The sparring corollary. The shot you take and keep going from teaches you what no unstruck body knows. The shot that breaks you breaks you. The distinction is the work of svādhyāya.',
      prompts: [
        'What did I survive this week that strengthened me?',
        'What did I survive that did not strengthen me, and why not?',
      ],
    },
  ];

  function random() {
    return CONTEMPLATIONS[Math.floor(Math.random() * CONTEMPLATIONS.length)];
  }
  function byIndex(i) {
    return CONTEMPLATIONS[((i % CONTEMPLATIONS.length) + CONTEMPLATIONS.length) % CONTEMPLATIONS.length];
  }
  function dailyIndex(date = new Date()) {
    // Stable per local day: rotates one per six hours, so users who reload during
    // the day see the same quote unless six hours have elapsed.
    return Math.floor(date.getTime() / (1000 * 60 * 60 * 6)) % CONTEMPLATIONS.length;
  }

  global.SadhanaContemplation = { CONTEMPLATIONS, random, byIndex, dailyIndex };
})(typeof window !== 'undefined' ? window : globalThis);
