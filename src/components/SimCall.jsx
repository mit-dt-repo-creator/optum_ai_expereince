import { useEffect, useRef, useState } from 'react';
import { PhoneOff, Volume2, VolumeX } from 'lucide-react';
import { personalize, speak, stopSpeaking } from '../sim.js';
import { formatElapsed } from './CallCues.jsx';

/**
 * Simulated voice call: the agent's scripted lines are spoken with the
 * browser's built-in voice and shown as captions; the presenter picks the
 * questions. Shown when no GECX voice link is configured, and labelled as a
 * simulation. Asking for a live agent hands the call to
 * `onHandoff(transcript)`.
 */
export default function SimCall({ agentName, persona, greeting, ui, startedAt, onEnd, onHandoff }) {
  const [phase, setPhase] = useState('connecting'); // connecting | speaking | listening | handoff
  const [lines, setLines] = useState([]);
  const [muted, setMuted] = useState(false);
  const [asked, setAsked] = useState([]);
  const [now, setNow] = useState(() => Date.now());
  const mutedRef = useRef(false);
  const cancelSpeech = useRef(null);
  const timers = useRef([]);
  const endRef = useRef(null);
  const transcript = useRef([]);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const addLine = (who, text) => {
    transcript.current = [...transcript.current, { who, text }];
    setLines((l) => [...l, { who, text }]);
  };

  const say = (text, then) => {
    addLine('agent', text);
    setPhase('speaking');
    cancelSpeech.current = speak(text, {
      muted: mutedRef.current,
      onDone: () => (then ? then() : setPhase('listening')),
    });
  };

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    later(() => say(personalize(greeting, persona.name)), 1100);
    endRef.current?.focus({ preventScroll: true });
    const pending = timers.current;
    return () => {
      clearInterval(tick);
      pending.forEach(clearTimeout);
      cancelSpeech.current?.();
      stopSpeaking();
    };
    // One call per mount; the parent remounts it for a new persona.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onEnd();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onEnd]);

  const ask = (i) => {
    if (phase !== 'listening') return;
    setAsked((a) => (a.includes(i) ? a : [...a, i]));
    addLine('user', persona.prompts[i]);
    setPhase('speaking');
    later(() => say(persona.answers[i]), 700);
  };

  const askForPerson = () => {
    if (phase !== 'listening') return;
    addLine('user', ui.liveAgentPrompt);
    setPhase('speaking');
    later(
      () =>
        say(ui.handoffLine, () => {
          setPhase('handoff');
          later(() => onHandoff?.(transcript.current), 600);
        }),
      700,
    );
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    mutedRef.current = next;
    if (next) stopSpeaking(); // silence the current line; captions continue
  };

  const status =
    phase === 'connecting'
      ? ui.simConnecting
      : phase === 'listening'
        ? ui.simListening
        : phase === 'handoff'
          ? ui.transferring
          : ui.simSpeaking;
  const recent = lines.slice(-3);

  return (
    <div className="sim-call">
      <div className={`call-orb${phase === 'speaking' ? ' is-speaking' : ''}`} aria-hidden="true">
        <span className="call-orb-sheen" />
      </div>

      <h2 className="call-title">{agentName}</h2>
      <p className="sim-badge sim-badge-center">{ui.simCallBadge}</p>
      <p className="sim-status" role="status">
        {status}
      </p>

      <div className="sim-captions" aria-live="polite">
        {recent.map((line, idx) => (
          <p key={lines.length - recent.length + idx} className={`caption caption-${line.who}`}>
            <span className="caption-who">{line.who === 'agent' ? ui.simAgent : ui.simYou}</span>
            {line.text}
          </p>
        ))}
      </div>

      <div className="call-prompts sim-call-prompts">
        <p className="mono-label call-prompts-label">{ui.tryAsking}</p>
        <div className="sim-chips">
          {persona.prompts.map((p, i) => (
            <button
              key={i}
              type="button"
              className={`sim-chip${asked.includes(i) ? ' is-asked' : ''}`}
              disabled={phase !== 'listening'}
              onClick={() => ask(i)}
            >
              {p}
            </button>
          ))}
          {onHandoff && (
            <button
              type="button"
              className="sim-chip sim-chip-live"
              disabled={phase !== 'listening'}
              onClick={askForPerson}
            >
              {ui.liveAgentPrompt}
            </button>
          )}
        </div>
      </div>

      <div className="call-footer">
        <div className="call-bar">
          <span className="call-timer" role="timer" aria-label="Call length">
            {formatElapsed(now - startedAt)}
          </span>
          <button
            type="button"
            className="call-close"
            onClick={toggleMute}
            aria-pressed={muted}
            aria-label={muted ? 'Unmute agent voice' : 'Mute agent voice'}
          >
            {muted ? <VolumeX size={20} aria-hidden="true" /> : <Volume2 size={20} aria-hidden="true" />}
          </button>
          <button
            ref={endRef}
            type="button"
            className="call-end"
            onClick={onEnd}
            aria-label="End simulated call"
          >
            <PhoneOff size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
