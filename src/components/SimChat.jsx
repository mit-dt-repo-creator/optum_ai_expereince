import { useEffect, useId, useRef, useState } from 'react';
import { Send, X } from 'lucide-react';
import { matchPrompt, personalize, prefersReducedMotion, readingTime } from '../sim.js';

/**
 * Simulated chat: scripted replies only (see sim.js). Shown when no GECX chat
 * link is configured, and labelled as a simulation.
 */
export default function SimChat({ agentName, persona, greeting, ui, onClose }) {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState('');
  const [asked, setAsked] = useState([]);
  const timers = useRef([]);
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const inputId = useId();
  const nextId = useRef(0);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const add = (who, text) => setMessages((m) => [...m, { id: nextId.current++, who, text }]);

  const agentSays = (text) => {
    setTyping(true);
    const delay = prefersReducedMotion() ? 300 : Math.min(1800, 500 + readingTime(text) / 4);
    later(() => {
      setTyping(false);
      add('agent', text);
    }, delay);
  };

  useEffect(() => {
    agentSays(personalize(greeting, persona.name));
    inputRef.current?.focus({ preventScroll: true });
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
    // Runs once per conversation; the parent remounts it for a new persona.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, typing]);

  const ask = (text, index) => {
    const question = text.trim();
    if (!question || typing) return;
    add('user', question);
    const i = index ?? matchPrompt(question, persona.prompts);
    if (i >= 0) setAsked((a) => (a.includes(i) ? a : [...a, i]));
    agentSays(i >= 0 ? persona.answers[i] : ui.simFallback);
  };

  const suggestions = persona.prompts
    .map((p, i) => ({ p, i }))
    .filter(({ i }) => !asked.includes(i));

  return (
    <div className="sim-chat">
      <div className="sim-head">
        <div>
          <h2 className="sim-title">{agentName}</h2>
          <p className="sim-badge">{ui.simChatBadge}</p>
        </div>
        <button type="button" className="sim-icon-btn" onClick={onClose} aria-label="Close simulated chat">
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="sim-log" ref={logRef} role="log" aria-live="polite" aria-label="Conversation">
        {messages.map((m) => (
          <div key={m.id} className={`bubble bubble-${m.who}`}>
            <span className="visually-hidden">{m.who === 'agent' ? ui.simAgent : ui.simYou}: </span>
            {m.text}
          </div>
        ))}
        {typing && (
          <div className="bubble bubble-agent bubble-typing" aria-label="Agent is typing">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="sim-suggest">
          <p className="mono-label">{ui.simSuggestions}</p>
          <div className="sim-chips">
            {suggestions.map(({ p, i }) => (
              <button key={i} type="button" className="sim-chip" disabled={typing} onClick={() => ask(p, i)}>
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      <form
        className="sim-input"
        onSubmit={(e) => {
          e.preventDefault();
          ask(draft);
          setDraft('');
        }}
      >
        <label htmlFor={inputId} className="visually-hidden">
          Message
        </label>
        <input
          id={inputId}
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message"
          autoComplete="off"
          maxLength={300}
        />
        <button type="submit" className="sim-send" disabled={!draft.trim() || typing} aria-label="Send">
          <Send size={18} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
