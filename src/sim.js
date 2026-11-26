/**
 * Helpers for the simulated voice and chat demo.
 *
 * Everything here is scripted: replies come from `answers` in data.js (or
 * edits made on the page). Nothing is sent anywhere, and no AI service is
 * involved. Voice uses the browser's built-in speech synthesis.
 */

const STOP_WORDS = new Set(
  'a an the i im my me to of for is are am do does did can could you your yours what whats how and or on in at be it its this that with there any about please would like will get need'.split(
    ' ',
  ),
);

function keywords(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

/**
 * Find the scripted prompt that best matches free text, by shared keywords.
 * Returns its index, or -1 when nothing matches (use the fallback reply).
 */
export function matchPrompt(text, prompts) {
  const asked = new Set(keywords(text));
  let best = -1;
  let bestScore = 0;
  prompts.forEach((prompt, i) => {
    const score = keywords(prompt).filter((w) => asked.has(w)).length;
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  });
  return best;
}

/**
 * Does free text ask for a human? ("live agent", "real person",
 * "representative", "talk to someone", ...)
 */
export function isLiveAgentRequest(text) {
  const t = String(text).toLowerCase();
  return (
    /\b(live|real|human)\s+(agent|person|rep|representative|being)\b/.test(t) ||
    /\b(representative|operator|human)\b/.test(t) ||
    /\b(speak|talk)\s+(to|with)\s+(a\s+)?(someone|somebody|person|agent|specialist)\b/.test(t)
  );
}

/** How the agent addresses the persona: first name, or "Dr. Lastname". */
export function addressName(fullName) {
  const parts = String(fullName).trim().split(/\s+/);
  if (/^dr\.?$/i.test(parts[0]) && parts.length > 1) return `Dr. ${parts[parts.length - 1]}`;
  return parts[0] ?? '';
}

/** Fill {name} in a greeting. */
export function personalize(template, fullName) {
  return String(template).replaceAll('{name}', addressName(fullName));
}

/** Rough reading time, used for the typing indicator and silent playback. */
export function readingTime(text) {
  return Math.min(7000, Math.max(1200, String(text).length * 55));
}

export function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

let cachedVoice;
function pickVoice() {
  if (cachedVoice !== undefined) return cachedVoice;
  const voices = window.speechSynthesis?.getVoices?.() ?? [];
  if (!voices.length) return null; // voices load lazily; try again next time
  cachedVoice =
    voices.find((v) => v.lang === 'en-US' && /natural|neural|aria|jenny|google us/i.test(v.name)) ??
    voices.find((v) => v.lang === 'en-US') ??
    voices.find((v) => v.lang?.startsWith('en')) ??
    null;
  return cachedVoice;
}

/**
 * Speak text aloud with the browser's built-in voice and call onDone when
 * finished. When muted, or when speech isn't available, it just waits for
 * roughly the reading time so the call still moves along.
 * Returns a cancel function.
 */
export function speak(text, { muted, onDone }) {
  let finished = false;
  const timers = [];
  const done = () => {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    onDone?.();
  };

  const synth = window.speechSynthesis;
  if (muted || !synth || typeof window.SpeechSynthesisUtterance === 'undefined') {
    timers.push(setTimeout(done, readingTime(text)));
    return () => {
      finished = true;
      timers.forEach(clearTimeout);
    };
  }

  synth.cancel();
  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 1;
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  utterance.onend = done;
  utterance.onerror = done;
  synth.speak(utterance);
  // Safety net: some browsers occasionally never fire onend.
  timers.push(setTimeout(done, readingTime(text) * 2 + 4000));

  return () => {
    finished = true;
    timers.forEach(clearTimeout);
    synth.cancel();
  };
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel();
}
