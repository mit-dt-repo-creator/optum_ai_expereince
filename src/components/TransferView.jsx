import { useContext, useEffect, useState } from 'react';
import { PhoneOff, X } from 'lucide-react';
import EditableText, { EditContext } from './EditableText.jsx';
import { formatElapsed } from './CallCues.jsx';
import { initials } from './Avatar.jsx';
import { speak, stopSpeaking } from '../sim.js';

/**
 * Left card during a simulated live-agent handoff: "Transferring…" with a
 * hold timer, then "Connected to <specialist>" with their opening line once
 * the presenter accepts the transfer in the agent assist panel.
 */
export default function TransferView({ category, persona, ui, panel, onEnd }) {
  const { editing } = useContext(EditContext);
  const [now, setNow] = useState(() => Date.now());
  const accepted = Boolean(panel.acceptedAt);
  const isVoice = panel.channel === 'voice';

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  // On a voice handoff, the specialist's opening line is spoken when connected.
  useEffect(() => {
    if (!accepted || !isVoice || editing) return undefined;
    const cancel = speak(persona.assist.opening, { muted: false });
    return () => {
      cancel();
      stopSpeaking();
    };
    // Speak once per accept.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accepted]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !editing) onEnd();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onEnd, editing]);

  const specialistName = category.specialist.split('·')[0].trim();
  const elapsed = formatElapsed(now - (accepted ? panel.acceptedAt : panel.startedAt));

  return (
    <div className="transfer-view">
      {accepted ? (
        <>
          <span className="specialist-avatar" aria-hidden="true">
            {initials(specialistName)}
          </span>
          <p className="transfer-kicker">
            <EditableText k="ui.connectedTo" value={ui.connectedTo} label="connected label" />
          </p>
          <EditableText
            as="h2"
            className="call-title"
            k={`cat.${category.id}.specialist`}
            value={category.specialist}
            label="specialist name"
          />
          <p className="sim-badge sim-badge-center">{ui.assistBadge}</p>
          <div className="transfer-bubble" role="status">
            <span className="caption-who">{specialistName}</span>
            {persona.assist.opening}
          </div>
        </>
      ) : (
        <>
          <div className="call-orb is-waiting" aria-hidden="true">
            <span className="call-orb-sheen" />
          </div>
          <EditableText
            as="h2"
            className="call-title"
            k="ui.transferring"
            value={ui.transferring}
            label="transferring heading"
          />
          <p className="sim-badge sim-badge-center">{isVoice ? ui.simCallBadge : ui.simChatBadge}</p>
          <EditableText
            as="p"
            className="sim-status"
            k="ui.transferWaiting"
            value={ui.transferWaiting}
            label="waiting message"
            role="status"
          />
          {editing && (
            <p className="transfer-kicker">
              <EditableText k="ui.connectedTo" value={ui.connectedTo} label="connected label" />{' '}
              <EditableText
                k={`cat.${category.id}.specialist`}
                value={category.specialist}
                label="specialist name"
              />
            </p>
          )}
        </>
      )}

      <div className="call-footer">
        <div className="call-bar">
          <span
            className="call-timer"
            role="timer"
            aria-label={accepted ? 'Time connected' : 'Time on hold'}
          >
            {elapsed}
          </span>
          <button
            type="button"
            className="call-end"
            onClick={onEnd}
            aria-label={isVoice ? 'End simulated call' : 'End simulated chat'}
          >
            {isVoice ? <PhoneOff size={20} aria-hidden="true" /> : <X size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </div>
  );
}
