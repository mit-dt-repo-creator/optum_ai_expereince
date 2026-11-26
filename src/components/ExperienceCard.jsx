import { useContext, useEffect, useRef } from 'react';
import { ShieldPlus, Stethoscope, FlaskConical, ExternalLink, Info } from 'lucide-react';
import AgentAction from './AgentAction.jsx';
import CallCues from './CallCues.jsx';
import SimCall from './SimCall.jsx';
import SimChat from './SimChat.jsx';
import SimScript from './SimScript.jsx';
import EditableText, { EditContext } from './EditableText.jsx';

const ICONS = { payer: ShieldPlus, provider: Stethoscope, lifeSciences: FlaskConical };

/**
 * The left card. `panel.kind` selects what it shows:
 *   null       the category card with Call / Chat buttons
 *   'cues'     "Try asking" cues after launching the real GECX voice agent
 *   'simCall'  simulated voice call (no GECX voice link configured)
 *   'simChat'  simulated chat (no GECX chat link configured)
 */
export default function ExperienceCard({
  category,
  persona,
  ui,
  voice,
  chat,
  panel,
  onLaunchVoice,
  onSimulate,
  onClosePanel,
}) {
  const Icon = ICONS[category.icon] ?? Stethoscope;
  const anyLive = voice.status === 'ok' || chat.status === 'ok';
  const anySim = voice.status === 'missing' || chat.status === 'missing';
  const { editing } = useContext(EditContext);
  const cardRef = useRef(null);
  const lastPanel = useRef(null);

  // When a panel closes, put keyboard focus back on the button that opened it.
  useEffect(() => {
    if (lastPanel.current && !panel) {
      const channel = lastPanel.current === 'simChat' ? 'chat' : 'voice';
      cardRef.current?.querySelector(`[data-channel="${channel}"]`)?.focus({ preventScroll: true });
    }
    lastPanel.current = panel?.kind ?? null;
  }, [panel]);

  const kind = panel?.kind ?? null;
  const simProps = {
    agentName: category.agentName,
    persona,
    greeting: category.greeting,
    ui,
  };

  let content;
  if (kind === 'cues') {
    content = (
      <CallCues
        categoryId={category.id}
        agentName={category.agentName}
        persona={persona}
        ui={ui}
        startedAt={panel.startedAt}
        onClose={onClosePanel}
      />
    );
  } else if ((kind === 'simCall' || kind === 'simChat') && editing) {
    content = <SimScript kind={kind} categoryId={category.id} {...simProps} />;
  } else if (kind === 'simCall') {
    // Keyed by persona so picking another persona starts a fresh call.
    content = (
      <SimCall key={persona.id} {...simProps} startedAt={panel.startedAt} onEnd={onClosePanel} />
    );
  } else if (kind === 'simChat') {
    content = <SimChat key={persona.id} {...simProps} onClose={onClosePanel} />;
  } else {
    content = (
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
                onSimulate={() => onSimulate('simCall')}
              />
              <AgentAction
                channel="chat"
                destination={chat}
                label={ui.chatLabel}
                onSimulate={() => onSimulate('simChat')}
              />
            </div>
            {(anyLive || editing) && (
              <p className="experience-hint">
                <ExternalLink size={14} aria-hidden="true" />
                <EditableText k="ui.openHint" value={ui.openHint} label="new window note" />
              </p>
            )}
            {(anySim || editing) && (
              <p className="experience-hint">
                <Info size={14} aria-hidden="true" />
                <EditableText k="ui.simHint" value={ui.simHint} label="simulated demo note" />
              </p>
            )}
          </div>
        </div>
      </>
    );
  }

  const labels = {
    cues: `${category.agentName} suggestions`,
    simCall: `${category.agentName}, simulated call`,
    simChat: `${category.agentName}, simulated chat`,
  };

  return (
    <article
      ref={cardRef}
      className={`experience-card${kind ? ` is-panel is-${kind}` : ''}`}
      aria-labelledby={kind ? undefined : 'experience-title'}
      aria-label={kind ? labels[kind] : undefined}
    >
      {content}
    </article>
  );
}
