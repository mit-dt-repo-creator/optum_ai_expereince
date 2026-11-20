import Avatar from './Avatar.jsx';

export default function PersonaSelector({ personas, selectedId, onSelect }) {
  return (
    <div className="persona-picker">
      <div className="persona-selector" role="group" aria-label="Choose a fictional persona">
        {personas.map((p, i) => {
          const selected = p.id === selectedId;
          return (
            <button
              key={p.id}
              type="button"
              className={`persona-chip${selected ? ' is-selected' : ''}`}
              aria-pressed={selected}
              aria-label={p.name}
              title={p.name}
              onClick={() => onSelect(p.id)}
            >
              <Avatar name={p.name} photo={p.photo} tone={i} />
            </button>
          );
        })}
      </div>

      {/* Decorative hint, as in the reference design. */}
      <div className="pick-hint" aria-hidden="true">
        <span>Pick your character</span>
        <svg viewBox="0 0 80 60" width="64" height="48" fill="none">
          <path
            d="M74 6 C 58 30, 38 44, 8 50"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M20 41 L 7 50 L 21 56"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
