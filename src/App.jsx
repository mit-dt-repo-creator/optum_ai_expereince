import { useCallback, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  FILE_OVERRIDES,
  applyEdit,
  buildContent,
  exportOverrides,
  loadLocalEdits,
  saveLocalEdits,
} from './content.js';
import { getAgentDestination } from './agentConfig.js';
import Logo from './components/Logo.jsx';
import SideNav from './components/SideNav.jsx';
import ExperienceCard from './components/ExperienceCard.jsx';
import PersonaCard from './components/PersonaCard.jsx';
import PersonaSelector from './components/PersonaSelector.jsx';
import EditToolbar from './components/EditToolbar.jsx';
import { EditContext } from './components/EditableText.jsx';

function downloadJson(filename, data) {
  const blob = new Blob([`${JSON.stringify(data, null, 2)}\n`], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

let activeTransition = null;
let queuedTransition = null;

/**
 * Run a state update inside a View Transition so the change cross-fades.
 * `kind` ('category' | 'persona') lets the CSS animate only what changes.
 * Falls back to an instant update without browser support or when the
 * viewer prefers reduced motion.
 *
 * Transitions never overlap: starting one while another is still pending can
 * leave the second stuck in Chromium. A click during a transition ends the
 * running one immediately, then plays the newest request.
 */
function withTransition(kind, update) {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduce) {
    update();
    return;
  }
  if (activeTransition) {
    queuedTransition = { kind, update };
    activeTransition.skipTransition();
    return;
  }
  runTransition(kind, update);
}

function runTransition(kind, update) {
  const root = document.documentElement;
  root.dataset.vt = kind;
  const transition = document.startViewTransition(() => flushSync(update));
  activeTransition = transition;
  // Skipping a transition rejects `ready`; that's expected here.
  transition.ready.catch(() => {});
  transition.finished.finally(() => {
    activeTransition = null;
    delete root.dataset.vt;
    if (queuedTransition) {
      const next = queuedTransition;
      queuedTransition = null;
      runTransition(next.kind, next.update);
    }
  });
}

export default function App() {
  // Text edits made on the page (Edit mode), saved in this browser.
  const [edits, setEdits] = useState(loadLocalEdits);
  const [editing, setEditing] = useState(false);
  const { categories, ui } = useMemo(() => buildContent({ ...FILE_OVERRIDES, ...edits }), [edits]);

  const setText = useCallback((key, text) => {
    setEdits((prev) => {
      const next = applyEdit(prev, key, text);
      saveLocalEdits(next);
      return next;
    });
  }, []);
  const editContext = useMemo(() => ({ editing, setText }), [editing, setText]);

  const [categoryId, setCategoryId] = useState(categories[0].id);
  // Remember the chosen persona per category so switching back keeps it.
  const [personaByCategory, setPersonaByCategory] = useState(() =>
    Object.fromEntries(categories.map((c) => [c.id, c.personas[0].id])),
  );

  const category = categories.find((c) => c.id === categoryId);
  const personaIndex = Math.max(
    0,
    category.personas.findIndex((p) => p.id === personaByCategory[categoryId]),
  );
  const persona = category.personas[personaIndex];

  const voice = getAgentDestination(categoryId, 'voice');
  const chat = getAgentDestination(categoryId, 'chat');

  // What the left card shows instead of its normal view:
  //   'cues'    "Try asking" cues after launching the real GECX voice agent
  //   'simCall' / 'simChat'  the simulated demo, when no GECX link is set
  const [panel, setPanel] = useState(null);
  const activePanel = panel?.categoryId === categoryId ? panel : null;

  const openPanel = (kind) =>
    withTransition('card', () => setPanel({ categoryId, kind, startedAt: Date.now() }));
  const closePanel = useCallback(() => withTransition('card', () => setPanel(null)), []);

  const selectCategory = (id) => {
    if (id !== categoryId) {
      withTransition('category', () => {
        setPanel(null);
        setCategoryId(id);
      });
    }
  };
  // Edit mode: choose which view of the card to edit.
  const previewPanel = (kind) => (kind ? openPanel(kind) : closePanel());

  const resetEdits = () => {
    const ok = window.confirm(
      'Discard all text edits made in this browser? The cards will go back to their default text.',
    );
    if (ok) {
      setEdits({});
      saveLocalEdits({});
    }
  };

  const selectPersona = (id) => {
    if (id !== persona.id) {
      withTransition('persona', () =>
        setPersonaByCategory((prev) => ({ ...prev, [categoryId]: id })),
      );
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <Logo />
        <div className="header-tools">
          <span className="badge">Interactive experience</span>
          <EditToolbar
            editing={editing}
            onToggle={() => setEditing((v) => !v)}
            panelKind={activePanel?.kind ?? null}
            onPreview={previewPanel}
            onReset={resetEdits}
            onExport={() => downloadJson('contentOverrides.json', exportOverrides(edits))}
            editCount={Object.keys(edits).length}
          />
        </div>
      </header>

      <div className="app-shell">
        <SideNav categories={categories} activeId={categoryId} onSelect={selectCategory} />

        <main className="app-main">
          <h1 className="page-title">Try an AI agent by selecting voice or chat</h1>

          {editing && (
            <p className="edit-banner" role="status">
              Editing: click any text in the two cards to change it. Enter saves, Esc undoes. Clear a
              field to restore its default. Use the “Edit” menu to reach the call cues and the
              simulated call and chat scripts. Edits are saved in this browser; use Export to share
              them.
            </p>
          )}

          <EditContext.Provider value={editContext}>
            <div className={`stage${editing ? ' is-editing' : ''}`}>
              <ExperienceCard
                category={category}
                persona={persona}
                ui={ui}
                voice={voice}
                chat={chat}
                panel={activePanel}
                onLaunchVoice={() => openPanel('cues')}
                onSimulate={openPanel}
                onClosePanel={closePanel}
              />

              <section className="persona-area" aria-label="Fictional demo persona">
                <PersonaCard
                  persona={persona}
                  tone={personaIndex}
                  heading={category.profileHeading}
                  ui={ui}
                />
                <PersonaSelector
                  personas={category.personas}
                  selectedId={persona.id}
                  onSelect={selectPersona}
                />
              </section>
            </div>
          </EditContext.Provider>

          <p className="disclaimer">
            All personas and profile information shown on this page are fictional.
          </p>
        </main>
      </div>
    </div>
  );
}
