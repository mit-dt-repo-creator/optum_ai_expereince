import EditableText from './EditableText.jsx';

/**
 * Edit-mode view of the simulated call / chat script: greeting, each
 * question with its scripted answer, the fallback reply and the labels.
 */
export default function SimScript({ kind, categoryId, agentName, greeting, persona, ui }) {
  const base = `persona.${persona.id}`;
  const isCall = kind === 'simCall';

  return (
    <div className="sim-script">
      <EditableText
        as="h2"
        className="sim-title"
        k={`cat.${categoryId}.agentName`}
        value={agentName}
        label="agent name"
      />
      <EditableText
        as="p"
        className="sim-badge"
        k={isCall ? 'ui.simCallBadge' : 'ui.simChatBadge'}
        value={isCall ? ui.simCallBadge : ui.simChatBadge}
        label="simulation label"
      />

      <section className="script-block">
        <p className="mono-label">Greeting (all personas in this category)</p>
        <EditableText
          as="p"
          className="script-agent"
          k={`cat.${categoryId}.greeting`}
          value={greeting}
          label="greeting"
        />
        <p className="script-tip">{'{name}'} is replaced with the persona&apos;s first name.</p>
      </section>

      <section className="script-block">
        <p className="mono-label">Questions and scripted answers ({persona.name})</p>
        <ol className="script-pairs">
          {persona.prompts.map((p, i) => (
            <li key={i}>
              <EditableText
                as="p"
                className="script-user"
                k={`${base}.prompts.${i}`}
                value={p}
                label={`question ${i + 1}`}
              />
              <EditableText
                as="p"
                className="script-agent"
                k={`${base}.answers.${i}`}
                value={persona.answers[i]}
                label={`answer ${i + 1}`}
              />
            </li>
          ))}
        </ol>
      </section>

      <section className="script-block">
        <p className="mono-label">Reply when a typed message matches no question</p>
        <EditableText as="p" className="script-agent" k="ui.simFallback" value={ui.simFallback} label="fallback reply" />
      </section>

      <section className="script-block script-labels">
        <p className="mono-label">Labels</p>
        <p>
          <EditableText k="ui.tryAsking" value={ui.tryAsking} label="prompts heading" /> ·{' '}
          <EditableText k="ui.simSuggestions" value={ui.simSuggestions} label="suggestions heading" /> ·{' '}
          <EditableText k="ui.simConnecting" value={ui.simConnecting} label="connecting status" /> ·{' '}
          <EditableText k="ui.simSpeaking" value={ui.simSpeaking} label="speaking status" /> ·{' '}
          <EditableText k="ui.simListening" value={ui.simListening} label="listening status" /> ·{' '}
          <EditableText k="ui.simAgent" value={ui.simAgent} label="agent caption label" /> ·{' '}
          <EditableText k="ui.simYou" value={ui.simYou} label="user caption label" />
        </p>
      </section>
    </div>
  );
}
