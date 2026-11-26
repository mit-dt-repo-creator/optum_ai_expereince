import { useState } from 'react';

/** Two-letter initials, ignoring a leading "Dr.". */
export function initials(name) {
  const parts = name.replace(/^Dr\.\s+/, '').split(/\s+/).filter(Boolean);
  if (parts.length < 2) return (parts[0]?.[0] ?? '').toUpperCase(); // single name: one letter
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Persona image. Decorative: the persona name is always shown as text nearby.
 *
 * - With a `photo` path (a licensed portrait in public/personas/), it shows the
 *   photo. `variant="cover"` fills the portrait panel; otherwise it's a circle.
 * - Without a photo, or if the file fails to load, it falls back to a polished
 *   initials avatar, so a missing file never shows as a broken image.
 */
export default function Avatar({ name, photo, size = 'sm', tone = 0, variant = 'circle' }) {
  const [failedSrc, setFailedSrc] = useState(null);

  if (photo && failedSrc !== photo) {
    return (
      <img
        className={variant === 'cover' ? 'persona-photo' : `avatar avatar-${size} avatar-photo`}
        src={photo}
        alt=""
        aria-hidden="true"
        draggable="false"
        onError={() => setFailedSrc(photo)}
      />
    );
  }

  return (
    <span className={`avatar avatar-${size} avatar-tone-${tone % 3}`} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
