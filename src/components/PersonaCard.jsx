import { useContext } from 'react';
import Avatar from './Avatar.jsx';
import EditableText, { EditContext } from './EditableText.jsx';

export default function PersonaCard({ persona, tone, heading, ui }) {
  const { editing } = useContext(EditContext);
  const base = `persona.${persona.id}`;

  return (
    <article
      className="persona-card"
      aria-label={`${heading}: ${persona.name}`}
      // Announce persona changes, but not every keystroke while editing.
      aria-live={editing ? 'off' : 'polite'}
    >
      <div className={`persona-portrait portrait-tone-${tone % 3}${persona.photo ? ' has-photo' : ''}`}>
        <Avatar
          key={persona.id}
          name={persona.name}
          photo={persona.photo}
          size="lg"
          tone={tone}
          variant="cover"
        />
        <div className="persona-identity">
          <EditableText as="h2" className="persona-name" k={`${base}.name`} value={persona.name} label="persona name" />
          <p className="persona-id">
            <EditableText k="ui.demoIdPrefix" value={ui.demoIdPrefix} label="demo ID prefix" />{' '}
            <EditableText k={`${base}.demoId`} value={persona.demoId} label="demo ID" />
          </p>
        </div>
      </div>

      <div className="persona-body">
        <EditableText as="p" className="mono-label" k="ui.aboutLabel" value={ui.aboutLabel} label="About heading" />
        <EditableText as="p" className="persona-about" k={`${base}.about`} value={persona.about} label="persona summary" />

        <dl className="persona-details">
          {persona.details.map((d, i) => (
            <div key={i} className="detail">
              <EditableText
                as="dt"
                className="mono-label"
                k={`${base}.details.${i}.label`}
                value={d.label}
                label={`detail ${i + 1} label`}
              />
              <EditableText as="dd" k={`${base}.details.${i}.value`} value={d.value} label={`detail ${i + 1} value`} />
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
