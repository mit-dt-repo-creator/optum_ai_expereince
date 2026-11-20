/**
 * GECX virtual agent launch destinations.
 *
 * This is the only place launch URLs are read. Values come from Vite
 * environment variables (see .env.example). They are public: they are
 * compiled into the browser bundle, so they must never contain secrets.
 *
 * Each `import.meta.env.VITE_*` reference must stay written out in full
 * so Vite can substitute it at build time.
 *
 * Nothing about the selected persona is ever added to these URLs.
 */
const RAW_DESTINATIONS = {
  payer: {
    voice: import.meta.env.VITE_GECX_PAYER_VOICE_URL,
    chat: import.meta.env.VITE_GECX_PAYER_CHAT_URL,
  },
  provider: {
    voice: import.meta.env.VITE_GECX_PROVIDER_VOICE_URL,
    chat: import.meta.env.VITE_GECX_PROVIDER_CHAT_URL,
  },
  lifeSciences: {
    voice: import.meta.env.VITE_GECX_LIFE_SCIENCES_VOICE_URL,
    chat: import.meta.env.VITE_GECX_LIFE_SCIENCES_CHAT_URL,
  },
};

const CHANNEL_LABEL = { voice: 'Voice', chat: 'Chat' };

/** Size of the separate window the voice agent opens in. */
export const VOICE_WINDOW = { width: 520, height: 820 };

/**
 * Open a launch URL in a separate window docked to the right of the screen,
 * so the "Try asking" cues on this page stay visible during the call.
 *
 * The window starts at about:blank so its opener can be cut before the agent
 * loads (same effect as rel="noopener"); index.html sets a no-referrer policy
 * (same effect as rel="noreferrer"). Returns false if a pop-up blocker
 * stopped it, so the caller can fall back to a normal new tab.
 */
export function openInSideWindow(href) {
  const { width, height } = VOICE_WINDOW;
  const scr = window.screen ?? {};
  const availW = scr.availWidth ?? 1440;
  const availH = scr.availHeight ?? 900;
  const left = (scr.availLeft ?? 0) + Math.max(0, availW - width - 24);
  const top = (scr.availTop ?? 0) + Math.max(0, Math.round((availH - height) / 2));
  const features = `popup=yes,width=${width},height=${height},left=${left},top=${top}`;

  // A unique name gives a fresh about:blank window every time, so cutting the
  // opener below always works.
  const win = window.open('about:blank', `gecx-voice-${Date.now()}`, features);
  if (!win) return false;
  try {
    win.opener = null;
  } catch {
    win.close();
    return false;
  }
  win.location.replace(href);
  return true;
}

/** Accept only absolute https:// URLs with a host. */
export function validateHttpsUrl(value) {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  if (!trimmed) return { status: 'missing' };
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'https:' || !url.hostname) return { status: 'invalid' };
    return { status: 'ok', href: url.href };
  } catch {
    return { status: 'invalid' };
  }
}

/**
 * Resolve the launch destination for a category ("payer", "provider",
 * "lifeSciences") and channel ("voice" | "chat").
 * Returns { status: 'ok', href } or { status: 'missing' | 'invalid', message }.
 */
export function getAgentDestination(categoryId, channel) {
  const result = validateHttpsUrl(RAW_DESTINATIONS[categoryId]?.[channel]);
  if (result.status === 'ok') return result;
  const label = CHANNEL_LABEL[channel] ?? 'Agent';
  return {
    status: result.status,
    message:
      result.status === 'missing'
        ? `${label} agent link not configured.`
        : `${label} agent link is invalid (an https:// URL is required).`,
  };
}
