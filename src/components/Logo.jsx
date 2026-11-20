import { useState } from 'react';

/**
 * Optum.ai logo.
 *
 * No approved Optum.ai logo asset has been supplied yet, so this renders an
 * isolated text fallback. To use the approved logo:
 *   1. Place the approved file at public/brand/optum-ai-logo.svg (or .png).
 *   2. Set LOGO_SRC below to '/brand/optum-ai-logo.svg'.
 * If the file is missing or fails to load, the text fallback is shown instead.
 */
const LOGO_SRC = null;

export default function Logo() {
  const [failed, setFailed] = useState(false);

  if (LOGO_SRC && !failed) {
    return <img className="logo-img" src={LOGO_SRC} alt="Optum.ai" onError={() => setFailed(true)} />;
  }
  return (
    <span className="logo-text" role="img" aria-label="Optum.ai">
      Optum<span className="logo-text-suffix">.ai</span>
    </span>
  );
}
