import { createContext, useContext } from 'react';

/** { editing: boolean, setText(key, text) } provided by App. */
export const EditContext = createContext({ editing: false, setText: () => {} });

/**
 * Text that becomes click-to-edit in Edit mode.
 *
 * - Enter saves, Escape undoes the current change, clicking away saves.
 * - Clearing the text restores the default.
 * Outside Edit mode it renders as plain text.
 */
export default function EditableText({ k, value, as: Tag = 'span', className = '', label, ...rest }) {
  const { editing, setText } = useContext(EditContext);

  if (!editing) {
    return (
      <Tag className={className || undefined} {...rest}>
        {value}
      </Tag>
    );
  }

  return (
    <Tag
      // Remount when the saved value changes so React never fights the
      // browser over text the user typed.
      key={value}
      {...rest}
      className={`${className} editable`.trim()}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      role="textbox"
      aria-label={label ? `Edit ${label}` : 'Edit text'}
      spellCheck
      tabIndex={0}
      onBlur={(e) => setText(k, e.currentTarget.textContent)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation(); // don't also close the call cues
          e.currentTarget.textContent = value;
          e.currentTarget.blur();
        }
      }}
    >
      {value}
    </Tag>
  );
}
