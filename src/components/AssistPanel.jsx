import { useContext, useEffect, useId, useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import EditableText, { EditContext } from './EditableText.jsx';
import Avatar from './Avatar.jsx';
import Logo from './Logo.jsx';
import { formatElapsed } from './CallCues.jsx';
import { addressName } from '../sim.js';

/**
 * Right card during a simulated live-agent handoff: what the human agent sees.
 * All content is fictional and comes from the persona's `assist` data plus the
 * transcript of the simulated conversation.
 *
 * Styling is deliberately quiet: brand color is limited to the Optum.ai
 * wordmark, a thin orange top line and the Accept transfer button.
 */
export default function AssistPanel({ category, persona, tone, ui, panel, onAccept, onEnd }) {
  const { editing } = useContext(EditContext);
  const [now, setNow] = useState(() => Date.now());
  const [done, setDone] = useState([]);
  const [copied, setCopied] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState('');
  const titleId = useId();
  const noteId = useId();
  const a = persona.assist;
  const base = `persona.${persona.id}.assist`;
  const accepted = Boolean(panel.acceptedAt);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  const copyOpening = async () => {
    try {
      await navigator.clipboard.writeText(a.opening);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked; the text is still on screen to read out.
    }
  };

  const toggleNote = () => {
    // Start the note from the AI summary so the agent only has to add to it.
    if (!noteOpen && !note) setNote(a.summary);
    setNoteOpen((o) => !o);
  };

  const toggleStep = (i) => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));
  const transcript = (panel.transcript ?? []).slice(-3);
  const sentimentDot = { warning: 'dot-warning', success: 'dot-success' }[a.tone];

  return (
    <article className="assist-panel" aria-labelledby={titleId}>
      <header className="assist-head">
        <div className="assist-title-row">
          <span className="assist-logo">
            <Logo />
          </span>
          <span className="assist-divider" aria-hidden="true" />
          <EditableText as="h2" id={titleId} className="assist-title" k="ui.assistTitle" value={ui.assistTitle} label="panel title" />
          <EditableText as="span" className="assist-badge" k="ui.assistBadge" value={ui.assistBadge} label="panel label" />
        </div>
        <div className="assist-status">
          <span className="assist-timer" role="timer">
            <EditableText
              k={accepted ? 'ui.assistConnected' : 'ui.assistWaiting'}
              value={accepted ? ui.assistConnected : ui.assistWaiting}
              label="timer label"
            />{' '}
            {formatElapsed(now - (accepted ? panel.acceptedAt : panel.startedAt))}
          </span>
          {!accepted &&
            (editing ? (
              <span className="assist-accept is-editing">
                <EditableText k="ui.assistAccept" value={ui.assistAccept} label="accept button label" />
              </span>
            ) : (
              <button type="button" className="assist-accept" onClick={onAccept}>
                {ui.assistAccept}
              </button>
            ))}
        </div>
      </header>

      <div className="assist-customer">
        <Avatar name={persona.name} photo={persona.photo} tone={tone} />
        <div className="assist-customer-text">
          <p className="assist-name">{persona.name}</p>
          <p className="assist-meta">
            {persona.demoId} · <EditableText k={`${base}.segment`} value={a.segment} label="customer segment" /> ·{' '}
            <EditableText k="ui.assistVia" value={ui.assistVia} label="via label" />{' '}
            {panel.channel === 'voice' ? (
              <EditableText k="ui.assistViaVoice" value={ui.assistViaVoice} label="voice channel label" />
            ) : (
              <EditableText k="ui.assistViaChat" value={ui.assistViaChat} label="chat channel label" />
            )}
          </p>
        </div>
      </div>

      <ul className="assist-chips" aria-label="Customer status">
        <li className="chip">
          <span className="chip-dot dot-success" aria-hidden="true" />
          <EditableText k={`${base}.verification`} value={a.verification} label="verification status" />
        </li>
        <li className="chip">
          <span>
            <EditableText k="ui.assistIntent" value={ui.assistIntent} label="intent label" />:{' '}
            <EditableText k={`${base}.intent`} value={a.intent} label="intent" />
          </span>
        </li>
        <li className="chip">
          {sentimentDot && <span className={`chip-dot ${sentimentDot}`} aria-hidden="true" />}
          <span>
            <EditableText k="ui.assistSentiment" value={ui.assistSentiment} label="sentiment label" />:{' '}
            <EditableText k={`${base}.sentiment`} value={a.sentiment} label="sentiment" />
          </span>
        </li>
        <li className="chip">
          <EditableText k="ui.assistReason" value={ui.assistReason} label="transfer reason" />
        </li>
      </ul>

      <section className="assist-section">
        <h3 className="assist-label">
          <EditableText k="ui.assistSummary" value={ui.assistSummary} label="summary heading" />
        </h3>
        <EditableText as="p" className="assist-summary" k={`${base}.summary`} value={a.summary} label="handoff summary" />
      </section>

      <div className="assist-grid">
        <section className="assist-section">
          <h3 className="assist-label">
            <EditableText k="ui.assistSteps" value={ui.assistSteps} label="next steps heading" />
          </h3>
          <ul className="assist-steps">
            {a.steps.map((step, i) => (
              <li key={i}>
                {editing ? (
                  <EditableText k={`${base}.steps.${i}`} value={step} label={`next step ${i + 1}`} />
                ) : (
                  <label className={done.includes(i) ? 'is-done' : undefined}>
                    <input type="checkbox" checked={done.includes(i)} onChange={() => toggleStep(i)} />
                    <span>{step}</span>
                  </label>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="assist-section">
          <h3 className="assist-label">
            <EditableText k="ui.assistKnowledge" value={ui.assistKnowledge} label="knowledge heading" />
          </h3>
          <ul className="assist-knowledge">
            {a.knowledge.map((title, i) => (
              <li key={i}>
                <FileText size={15} aria-hidden="true" />
                <EditableText k={`${base}.knowledge.${i}`} value={title} label={`knowledge article ${i + 1}`} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="assist-section">
        <div className="assist-opening-head">
          <h3 className="assist-label">
            <EditableText k="ui.assistOpening" value={ui.assistOpening} label="opening heading" />
          </h3>
          {!editing && (
            <button type="button" className="assist-copy" onClick={copyOpening}>
              {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
        <p className="assist-opening">
          “<EditableText k={`${base}.opening`} value={a.opening} label="suggested opening" />”
        </p>
      </section>

      <section className="assist-section">
        <h3 className="assist-label">
          <EditableText k="ui.assistTranscript" value={ui.assistTranscript} label="transcript heading" />
        </h3>
        <div className="assist-transcript">
          {transcript.map((line, i) => (
            <p key={i}>
              <span className="assist-who">{line.who === 'agent' ? category.agentName : addressName(persona.name)}</span>
              {line.text}
            </p>
          ))}
        </div>
      </section>

      {noteOpen && !editing && (
        <section className="assist-section">
          <label htmlFor={noteId} className="assist-label">
            {ui.assistNoteLabel}
          </label>
          <textarea
            id={noteId}
            className="assist-note"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </section>
      )}

      <footer className="assist-foot">
        <EditableText as="span" className="assist-powered" k="ui.assistPoweredBy" value={ui.assistPoweredBy} label="footer text" />
        <div className="assist-foot-actions">
          {editing ? (
            <>
              <span className="assist-ghost">
                <EditableText k="ui.assistCaseNote" value={ui.assistCaseNote} label="case note button label" />
              </span>
              <span className="assist-ghost">
                <EditableText k="ui.assistWrapUp" value={ui.assistWrapUp} label="wrap up button label" />
              </span>
            </>
          ) : (
            <>
              <button type="button" className="assist-ghost" onClick={toggleNote} aria-expanded={noteOpen}>
                {ui.assistCaseNote}
              </button>
              <button type="button" className="assist-ghost" onClick={onEnd}>
                {ui.assistWrapUp}
              </button>
            </>
          )}
        </div>
      </footer>
    </article>
  );
}
