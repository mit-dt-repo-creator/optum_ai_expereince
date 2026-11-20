export default function SideNav({ categories, activeId, onSelect }) {
  return (
    <nav className="side-nav" aria-label="Experience category">
      <ul className="side-nav-list">
        {categories.map((cat) => {
          const active = cat.id === activeId;
          return (
            <li key={cat.id}>
              <button
                type="button"
                className={`nav-pill${active ? ' is-active' : ''}`}
                aria-current={active ? 'page' : undefined}
                onClick={() => onSelect(cat.id)}
              >
                {cat.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
