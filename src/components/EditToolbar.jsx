import { useId } from 'react';
import { Pencil, Check, RotateCcw, Download } from 'lucide-react';

const VIEWS = [
  { value: '', label: 'Edit: card' },
  { value: 'cues', label: 'Edit: call cues' },
  { value: 'simCall', label: 'Edit: simulated call script' },
  { value: 'simChat', label: 'Edit: simulated chat script' },
  { value: 'handoff', label: 'Edit: live-agent handoff and agent assist' },
];

/** Header controls for Edit mode. */
export default function EditToolbar({ editing, onToggle, panelKind, onPreview, onReset, onExport, editCount }) {
  const selectId = useId();

  if (!editing) {
    return (
      <button type="button" className="tool-btn" onClick={onToggle}>
        <Pencil size={16} aria-hidden="true" />
        Edit text
      </button>
    );
  }

  return (
    <div className="edit-toolbar" role="toolbar" aria-label="Text editing">
      <label htmlFor={selectId} className="visually-hidden">
        Which view to edit
      </label>
      <select
        id={selectId}
        className="tool-btn tool-select"
        value={panelKind ?? ''}
        onChange={(e) => onPreview(e.target.value || null)}
      >
        {VIEWS.map((v) => (
          <option key={v.value} value={v.value}>
            {v.label}
          </option>
        ))}
      </select>
      <button type="button" className="tool-btn" onClick={onExport}>
        <Download size={16} aria-hidden="true" />
        Export
      </button>
      <button type="button" className="tool-btn" onClick={onReset} disabled={editCount === 0}>
        <RotateCcw size={16} aria-hidden="true" />
        Reset
      </button>
      <button type="button" className="tool-btn tool-btn-primary" onClick={onToggle}>
        <Check size={16} aria-hidden="true" />
        Done
      </button>
    </div>
  );
}
