import { useContext, useId } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { openInSideWindow } from '../agentConfig.js';
import EditableText, { EditContext } from './EditableText.jsx';

/**
 * A real launch link to a GECX agent, or a clearly disabled control when the
 * destination is missing or invalid. Never renders href="#".
 *
 * Voice: a plain click opens the agent in a separate window beside this page
 * (falling back to a new tab if pop-ups are blocked) and calls `onLaunch` so
 * the card can show "Try asking" cues. Ctrl/Cmd/Shift-click or middle-click
 * keep the browser's normal link behaviour.
 * Chat: always opens in a new tab.
 */
export default function AgentAction({ channel, destination, label, onLaunch }) {
  const noteId = useId();
  const { editing } = useContext(EditContext);
  const isVoice = channel === 'voice';
  const Icon = isVoice ? Phone : MessageCircle;
  // The call button shows its label by default; the chat button is a circle
  // that expands to show its label on hover or keyboard focus (App.css).
  const className = isVoice ? 'action-primary' : 'action-round';

  // Edit mode: show the button (chat expanded) with an editable label, and
  // don't launch anything.
  if (editing) {
    return (
      <span className="action-wrap">
        <span
          className={`${className} is-editing${destination.status === 'ok' ? '' : ' is-disabled'}`}
          data-channel={channel}
        >
          <Icon className="action-icon" size={isVoice ? 20 : 22} aria-hidden="true" />
          <EditableText
            k={isVoice ? 'ui.callLabel' : 'ui.chatLabel'}
            value={label}
            className="action-label"
            label={isVoice ? 'call button label' : 'chat button label'}
          />
        </span>
        {destination.status !== 'ok' && <span className="action-note">{destination.message}</span>}
      </span>
    );
  }

  const content = (
    <>
      <Icon className="action-icon" size={isVoice ? 20 : 22} aria-hidden="true" />
      <span className="action-label" aria-hidden="true">
        {label}
      </span>
    </>
  );

  if (destination.status === 'ok') {
    const handleClick = (e) => {
      if (!isVoice) return;
      const modified = e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
      try {
        if (!modified && openInSideWindow(destination.href)) e.preventDefault();
      } finally {
        // Show the cues whichever way the agent opened.
        onLaunch?.();
      }
    };

    return (
      <a
        className={className}
        href={destination.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} (opens in a new ${isVoice ? 'window' : 'tab'})`}
        data-channel={channel}
        onClick={handleClick}
      >
        {content}
      </a>
    );
  }

  return (
    <span className="action-wrap">
      <button
        type="button"
        className={`${className} is-disabled`}
        disabled
        aria-label={`${label} (unavailable)`}
        aria-describedby={noteId}
        data-channel={channel}
      >
        {content}
      </button>
      <span id={noteId} className="action-note">
        {destination.message}
      </span>
    </span>
  );
}
