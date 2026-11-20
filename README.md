# Optum.ai Interactive Experience

A lightweight React + Vite frontend that **launches existing GECX virtual agents**: one voice agent and one chat agent per category (Payer, Provider, Life Sciences). It has no voice engine, chatbot, backend, authentication, or database, and it does not simulate calls or conversations.

> **Deploying?** See [DEPLOY.md](DEPLOY.md) for step-by-step build, hosting and verification instructions.

## Setup

Requires Node 18.18 or later.

```bash
npm ci
cp .env.example .env.local   # then paste your GECX launch URLs
npm run dev                  # http://localhost:5173
npm run build                # production build in dist/
```

### Configuring GECX destinations

All launch links are read in one place, [`src/agentConfig.js`](src/agentConfig.js), from these variables:

| Variable | Used by |
| --- | --- |
| `VITE_GECX_PAYER_VOICE_URL` | Payer → Call AI Agent |
| `VITE_GECX_PAYER_CHAT_URL` | Payer → Chat with AI Agent |
| `VITE_GECX_PROVIDER_VOICE_URL` | Provider → Call AI Agent |
| `VITE_GECX_PROVIDER_CHAT_URL` | Provider → Chat with AI Agent |
| `VITE_GECX_LIFE_SCIENCES_VOICE_URL` | Life Sciences → Call AI Agent |
| `VITE_GECX_LIFE_SCIENCES_CHAT_URL` | Life Sciences → Chat with AI Agent |

- Each value must be a full `https://` URL. Anything else (empty, `http://`, malformed) disables that button and shows a short message such as "Voice agent link not configured."
- If one agent serves several categories, put the same URL in each variable.
- Values are baked in at build time. Rebuild (or restart `npm run dev`) after changing them.
- Configured actions are regular links that open in a new tab with `rel="noopener noreferrer"`.
- **Frontend environment variables are public.** Everything in `VITE_*` ends up in the shipped JavaScript. Never put API keys, tokens or other secrets there.
- No persona or user data is added to the URLs. Persona selection only changes what this page displays; the launched agent knows nothing about it.

## Brand assets to request

These need to come from the brand team. Every slot is already wired; each one shows a clean fallback until its file arrives, so nothing ever appears broken.

| Asset | Where it goes | How to switch it on | Fallback today |
| --- | --- | --- | --- |
| Optum.ai logo (SVG, light-background version) | `public/brand/optum-ai-logo.svg` | Set `LOGO_SRC` in [`src/components/Logo.jsx`](src/components/Logo.jsx) | "Optum.ai" text |
| Optum Sans web fonts (`.woff2`, 400/500/600/700) | `public/brand/fonts/` | Uncomment the `@font-face` block at the top of [`src/App.css`](src/App.css) | DM Sans (Google Fonts) |
| 9 licensed persona portraits (≥ 900 × 900 px) | `public/personas/` | Set each persona's `photo` in [`src/data.js`](src/data.js) | Initials avatars |
| Approved color values | — | Edit the variables at the top of [`src/App.css`](src/App.css) | Approximate placeholders |

See `public/brand/README.md` and `public/personas/README.md` for the details. A portrait that fails to load falls back to initials, and a logo that fails to load falls back to text.

Notes:
- **Colors** approximate the Optum palette and are **placeholders pending approved brand values**. `--color-orange-strong` is a darker orange chosen so white button text meets WCAG AA contrast.
- **Fonts**: DM Sans, DM Mono and Caveat (for the "Pick your character" note) load from Google Fonts in `index.html`. If they can't load, the page falls back to system fonts.

## Editing the text on the page

Every piece of text in the two cards can be changed on the page, with no code:

1. Click **Edit text** in the header. Each editable piece of text gets a dashed outline.
2. Click any text and type. **Enter** saves, **Esc** undoes the current change, and clicking elsewhere also saves. Clearing a field brings back its default.
3. Switch category or persona to edit their text too. Use **Show call cues** to edit the agent name, the "Try asking" heading and the prompts.
4. Click **Done** when finished.

This covers the card title and description, the Call and Chat button labels, the "Agents open outside this page" note, each persona's name, demo ID, About text and detail labels and values, and everything on the call-cue screen.

**Where edits are kept**
- Edits are saved **in this browser only** (local storage). They survive reloads, but other people and other browsers don't see them. Clearing site data removes them.
- **Reset** discards this browser's edits, after asking first.
- **Export** downloads `contentOverrides.json` with all text that differs from the sample content. To give everyone the edits, replace [`src/contentOverrides.json`](src/contentOverrides.json) with that file and rebuild (`npm run build`). Those become the new defaults.

Text priority: edits in this browser, then `src/contentOverrides.json`, then the samples in [`src/data.js`](src/data.js) and `UI_DEFAULTS` in [`src/content.js`](src/content.js).

## "Try asking" cues after Call AI Agent

Clicking **Call AI Agent** opens the GECX voice agent in a separate window docked to the right of the screen (520 × 820, set by `VOICE_WINDOW` in [`src/agentConfig.js`](src/agentConfig.js)), so this page stays visible beside it. If a pop-up blocker stops the window, the agent opens in a new tab instead. Ctrl/Cmd-click or middle-click opens it however the browser normally would.

The experience card then shows the agent's name and three "Try asking" prompts for the selected persona (edit them under `prompts` in [`src/data.js`](src/data.js)), with a timer and a close (✕) button. Escape also closes them.

These cues are presenter support only, not a simulated call:
- This page cannot see or control the GECX call. The timer counts from when the agent was opened, not from a connected call.
- ✕ only closes the suggestions. It does not hang up; end the call in the GECX window.
- No persona data is passed to the agent.

## Motion

- **Entrance**: on load, the header, navigation, title, cards and persona picker rise in one after another.
- **Switching**: changing category or persona cross-fades with a slight slide, using the browser's View Transitions API (Chrome, Edge and Safari 18+). In other browsers the content switches instantly. Transitions never overlap: a click during one ends it at once, then plays the newest change.
- **Ambient**: the hero gradient drifts very slowly, and a warm glow moves gently behind initials avatars.
- **Reduced motion**: if the viewer's system is set to reduce motion, all of the above is turned off.

All motion lives in the "Motion" section at the end of [`src/App.css`](src/App.css); the transition logic is `withTransition` in [`src/App.jsx`](src/App.jsx).

## Content

[`src/data.js`](src/data.js) holds the editable category copy and three fictional personas per category. The copy is sample content, not a verified description of any agent's capabilities. All personas and their details are fictional.

## Project layout

```
src/
  App.jsx            page layout and local state
  App.css            styles and brand tokens
  data.js            categories and fictional personas
  agentConfig.js     GECX launch-URL config and validation
  components/        Logo, SideNav, ExperienceCard, AgentAction, PersonaCard, PersonaSelector, Avatar
public/              place approved logo / licensed portrait assets here
.env.example         template for the six launch URLs
```
