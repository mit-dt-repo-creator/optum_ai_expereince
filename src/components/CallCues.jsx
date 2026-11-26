import { useContext, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import EditableText, { EditContext } from './EditableText.jsx';

export function formatElapsed(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Shown in the experience card after the voice agent is launched.
 *
 * This is presenter support only: the call itself runs in the GECX window.
 * This page cannot see or control that call, so the timer counts from when
 * the agent was opened (not from a connected call), and the button closes
 * these suggestions rather than hanging up.
 */
export default function CallCues({ categoryId, agentName, persona, ui, startedAt, onClose }) {
  const [now, setNow] = useState(() => Date.now());
  const headingRef = useRef(null);
  const { editing } = useContext(EditContext);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // Move focus here so keyboard and screen-reader users land on the new view.
    // This does not pull the GECX window to the background.
    // Skipped in Edit mode, where the presenter opened the cues to edit them.
    if (!editing) headingRef.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="call-view" ref={headingRef} tabIndex={-1}>
      <div className="call-orb" aria-hidden="true">
        <span className="call-orb-sheen" />
      </div>

      <EditableText
        as="h2"
        className="call-title"
        k={`cat.${categoryId}.agentName`}
        value={agentName}
        label="agent name"
      />
      <EditableText
        as="p"
        className="call-status"
        k="ui.callStatus"
        value={ui.callStatus}
        label="agent window note"
      />

      <div className="call-prompts">
        <EditableText
          as="p"
          className="mono-label call-prompts-label"
          k="ui.tryAsking"
          value={ui.tryAsking}
          label="prompts heading"
        />
        <ul>
          {persona.prompts.map((p, i) => (
            <li key={i}>
              “
              <EditableText
                k={`persona.${persona.id}.prompts.${i}`}
                value={p}
                label={`prompt ${i + 1}`}
              />
              ”
            </li>
          ))}
        </ul>
      </div>

      <div className="call-footer">
        <div className="call-bar">
          <span className="call-timer" role="timer" aria-label="Time since the agent opened">
            {formatElapsed(now - startedAt)}
          </span>
          <button type="button" className="call-close" onClick={onClose} aria-label="Close suggestions">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
