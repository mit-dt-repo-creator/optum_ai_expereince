import { Pencil, Check, RotateCcw, Download, MessageSquareText } from 'lucide-react';

/** Header controls for Edit mode. */
export default function EditToolbar({ editing, onToggle, cuesOpen, onToggleCues, onReset, onExport, editCount }) {
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
      <button type="button" className="tool-btn" onClick={onToggleCues} aria-pressed={cuesOpen}>
        <MessageSquareText size={16} aria-hidden="true" />
        {cuesOpen ? 'Hide call cues' : 'Show call cues'}
      </button>
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
