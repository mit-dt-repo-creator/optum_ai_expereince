/**
 * Text content and edits.
 *
 * Every piece of text in the two cards has a key (for example
 * "cat.payer.title" or "persona.payer-1.prompts.0"). The text shown is, in
 * order of priority:
 *   1. edits made on the page in Edit mode (saved in this browser only),
 *   2. src/contentOverrides.json (shared defaults; replace it with a file
 *      exported from Edit mode and rebuild to give everyone the edits),
 *   3. the sample content in src/data.js and UI_DEFAULTS below.
 */
import { categories as baseCategories } from './data.js';
import fileOverridesJson from './contentOverrides.json';

/** Interface text inside the cards. */
export const UI_DEFAULTS = {
  callLabel: 'Call AI Agent',
  chatLabel: 'Chat with AI Agent',
  openHint: 'Agents open outside this page.',
  callStatus: 'The voice agent opened in a separate window.',
  tryAsking: 'Try asking',
  aboutLabel: 'About',
  demoIdPrefix: 'Demo ID',
  // Simulated demo (used when no GECX link is configured)
  simHint: 'No live agent links are set, so Call and Chat open a simulated demo.',
  simCallBadge: 'Simulated call · scripted responses',
  simChatBadge: 'Simulated chat · scripted responses',
  simFallback:
    "I'm a simulated demo, so I can only answer a few sample questions. Try one of the suggestions below.",
  simSuggestions: 'Suggested questions',
  simConnecting: 'Connecting…',
  simSpeaking: 'Agent is speaking',
  simListening: 'Your turn: pick a question below',
  simYou: 'You',
  simAgent: 'Agent',
  // Live-agent handoff and agent assist panel
  liveAgentPrompt: 'Can I speak to a live agent?',
  handoffLine:
    "Of course. I'm connecting you with a specialist now. I've shared our conversation, so you won't need to repeat anything.",
  transferring: 'Transferring to a live agent',
  transferWaiting: 'Waiting for the next available specialist…',
  connectedTo: 'Connected to',
  assistTitle: 'Agent assist',
  assistBadge: 'Simulated',
  assistWaiting: 'Waiting',
  assistConnected: 'Connected',
  assistAccept: 'Accept transfer',
  assistReason: 'Reason: asked for a person',
  assistIntent: 'Intent',
  assistSentiment: 'Sentiment',
  assistSummary: 'AI handoff summary',
  assistSteps: 'Suggested next steps',
  assistKnowledge: 'Knowledge',
  assistOpening: 'Suggested opening',
  assistTranscript: 'Recent transcript',
  assistVia: 'via',
  assistViaVoice: 'voice AI agent',
  assistViaChat: 'chat AI agent',
  assistPoweredBy: 'Powered by Optum.ai · fictional data',
  assistCaseNote: 'Add case note',
  assistWrapUp: 'Wrap up',
  assistNoteLabel: 'Case note',
};

const STORAGE_KEY = 'optum-ai-experience:text-edits:v1';

/** Single-text fields of a persona's agent assist data that can be edited. */
const ASSIST_TEXT_FIELDS = ['segment', 'verification', 'intent', 'sentiment', 'summary', 'opening'];
const MAX_LENGTH = 2000;

/** Keep only string values under string keys, trimmed to a sane length. */
function sanitize(map) {
  if (!map || typeof map !== 'object' || Array.isArray(map)) return {};
  const out = {};
  for (const [k, v] of Object.entries(map)) {
    if (typeof v === 'string') out[k] = v.slice(0, MAX_LENGTH);
  }
  return out;
}

export const FILE_OVERRIDES = sanitize(fileOverridesJson);

/** Apply a flat { key: text } map of overrides to the sample content. */
export function buildContent(overrides = {}) {
  const pick = (key, fallback) => (typeof overrides[key] === 'string' ? overrides[key] : fallback);

  const ui = Object.fromEntries(
    Object.entries(UI_DEFAULTS).map(([k, v]) => [k, pick(`ui.${k}`, v)]),
  );

  const categories = baseCategories.map((c) => ({
    ...c,
    title: pick(`cat.${c.id}.title`, c.title),
    description: pick(`cat.${c.id}.description`, c.description),
    agentName: pick(`cat.${c.id}.agentName`, c.agentName),
    greeting: pick(`cat.${c.id}.greeting`, c.greeting),
    specialist: pick(`cat.${c.id}.specialist`, c.specialist),
    personas: c.personas.map((p) => {
      const base = `persona.${p.id}`;
      return {
        ...p,
        name: pick(`${base}.name`, p.name),
        demoId: pick(`${base}.demoId`, p.demoId),
        about: pick(`${base}.about`, p.about),
        prompts: p.prompts.map((t, i) => pick(`${base}.prompts.${i}`, t)),
        answers: p.answers.map((t, i) => pick(`${base}.answers.${i}`, t)),
        assist: {
          ...p.assist,
          ...Object.fromEntries(
            ASSIST_TEXT_FIELDS.map((k) => [k, pick(`${base}.assist.${k}`, p.assist[k])]),
          ),
          steps: p.assist.steps.map((t, i) => pick(`${base}.assist.steps.${i}`, t)),
          knowledge: p.assist.knowledge.map((t, i) => pick(`${base}.assist.knowledge.${i}`, t)),
        },
        details: p.details.map((d, i) => ({
          ...d,
          label: pick(`${base}.details.${i}.label`, d.label),
          value: pick(`${base}.details.${i}.value`, d.value),
        })),
      };
    }),
  }));

  return { ui, categories };
}

/** Flatten content back to { key: text }, for comparing against defaults. */
function flatten({ ui, categories }) {
  const out = {};
  for (const [k, v] of Object.entries(ui)) out[`ui.${k}`] = v;
  for (const c of categories) {
    out[`cat.${c.id}.title`] = c.title;
    out[`cat.${c.id}.description`] = c.description;
    out[`cat.${c.id}.agentName`] = c.agentName;
    out[`cat.${c.id}.greeting`] = c.greeting;
    out[`cat.${c.id}.specialist`] = c.specialist;
    for (const p of c.personas) {
      const base = `persona.${p.id}`;
      out[`${base}.name`] = p.name;
      out[`${base}.demoId`] = p.demoId;
      out[`${base}.about`] = p.about;
      p.prompts.forEach((t, i) => (out[`${base}.prompts.${i}`] = t));
      p.answers.forEach((t, i) => (out[`${base}.answers.${i}`] = t));
      ASSIST_TEXT_FIELDS.forEach((k) => (out[`${base}.assist.${k}`] = p.assist[k]));
      p.assist.steps.forEach((t, i) => (out[`${base}.assist.steps.${i}`] = t));
      p.assist.knowledge.forEach((t, i) => (out[`${base}.assist.knowledge.${i}`] = t));
      p.details.forEach((d, i) => {
        out[`${base}.details.${i}.label`] = d.label;
        out[`${base}.details.${i}.value`] = d.value;
      });
    }
  }
  return out;
}

/** What everyone sees before any edits in this browser. */
const SHARED_DEFAULTS = flatten(buildContent(FILE_OVERRIDES));
/** The untouched sample content from data.js. */
const SAMPLE_DEFAULTS = flatten(buildContent({}));

/** Normalise typed text: single line, trimmed. */
export function normalizeText(text) {
  return String(text ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_LENGTH);
}

/**
 * Apply one edit to the local edits map. Clearing a field, or typing the
 * default back in, removes the edit so the default shows again.
 */
export function applyEdit(edits, key, text) {
  const next = { ...edits };
  const value = normalizeText(text);
  if (!value || value === SHARED_DEFAULTS[key]) delete next[key];
  else next[key] = value;
  return next;
}

export function loadLocalEdits() {
  try {
    return sanitize(JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}'));
  } catch {
    return {};
  }
}

export function saveLocalEdits(edits) {
  try {
    if (Object.keys(edits).length) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode, blocked site data).
    // Edits still apply for this visit.
  }
}

/**
 * The full set of differences from data.js (shared file + local edits), as a
 * contentOverrides.json the team can commit.
 */
export function exportOverrides(edits) {
  const merged = { ...FILE_OVERRIDES, ...edits };
  const out = {};
  for (const key of Object.keys(merged).sort()) {
    if (key in SAMPLE_DEFAULTS && merged[key] !== SAMPLE_DEFAULTS[key]) out[key] = merged[key];
  }
  return out;
}
