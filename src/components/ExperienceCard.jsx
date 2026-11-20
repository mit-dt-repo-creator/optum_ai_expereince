import { useContext, useEffect, useRef } from 'react';
import { ShieldPlus, Stethoscope, FlaskConical, ExternalLink } from 'lucide-react';
import AgentAction from './AgentAction.jsx';
import CallCues from './CallCues.jsx';
import EditableText, { EditContext } from './EditableText.jsx';

const ICONS = { payer: ShieldPlus, provider: Stethoscope, lifeSciences: FlaskConical };

export default function ExperienceCard({
  category,
  persona,
  ui,
  voice,
  chat,
  call,
  onLaunchVoice,
  onCloseCall,
}) {
  const Icon = ICONS[category.icon] ?? Stethoscope;
  const anyLive = voice.status === 'ok' || chat.status === 'ok';
  const { editing } = useContext(EditContext);
  const cardRef = useRef(null);
  const wasInCall = useRef(false);

  // When the cues close, put keyboard focus back on the Call button.
  useEffect(() => {
    if (wasInCall.current && !call) {
      cardRef.current?.querySelector('a[data-channel="voice"]')?.focus({ preventScroll: true });
    }
    wasInCall.current = Boolean(call);
  }, [call]);

  return (
    <article
      ref={cardRef}
      className={`experience-card${call ? ' is-call' : ''}`}
      aria-labelledby={call ? undefined : 'experience-title'}
      aria-label={call ? `${category.agentName} suggestions` : undefined}
    >
      {call ? (
        <CallCues
          categoryId={category.id}
          agentName={category.agentName}
          persona={persona}
          ui={ui}
          startedAt={call.startedAt}
          onClose={onCloseCall}
        />
      ) : (
        <>
          <div className={`experience-hero hero-${category.id}`} aria-hidden="true">
            <Icon className="hero-icon" size={72} strokeWidth={1.4} />
          </div>

          <div className="experience-body">
            <EditableText
              as="h2"
              id="experience-title"
              className="experience-title"
              k={`cat.${category.id}.title`}
              value={category.title}
              label="card title"
            />
            <EditableText
              as="p"
              className="experience-desc"
              k={`cat.${category.id}.description`}
              value={category.description}
              label="card description"
            />

            <div className="experience-footer">
              <div className="experience-actions">
                <AgentAction
                  channel="voice"
                  destination={voice}
                  label={ui.callLabel}
                  onLaunch={onLaunchVoice}
                />
                <AgentAction channel="chat" destination={chat} label={ui.chatLabel} />
              </div>
              {(anyLive || editing) && (
                <p className="experience-hint">
                  <ExternalLink size={14} aria-hidden="true" />
                  <EditableText k="ui.openHint" value={ui.openHint} label="new window note" />
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </article>
  );
}
