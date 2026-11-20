# Deployment guide

This is a **static website**: HTML, CSS and JavaScript only. There is no server code, database or login. You build it once and serve the resulting `dist/` folder from any HTTPS web host.

- **Developer?** Start with [README.md](README.md) (structure, content editing, brand assets), then the "Local development" section below.
- **Deployer?** Follow steps 1 to 6 below.

---

## What you need

| Requirement | Notes |
| --- | --- |
| Node.js **18.18 or later** (20 LTS or 22 LTS recommended) | Only needed to build. The live site does not run Node. |
| npm (comes with Node) | |
| The six **GECX launch URLs** from the GECX team | One voice and one chat URL per category. All must be `https://`. |
| An **HTTPS** static host | Any web server or static hosting service. |

## 1. Unzip and install

Unzip the file (on Windows: right-click, then **Extract All**), then from a terminal:

```bash
cd optum-ai-experience
npm ci
```

`npm ci` installs the exact dependency versions recorded in `package-lock.json`. Use it rather than `npm install` for builds.

## 2. Set the GECX launch URLs

The app reads six environment variables **at build time** and bakes them into the JavaScript. Changing them later means rebuilding.

| Variable | Button it powers |
| --- | --- |
| `VITE_GECX_PAYER_VOICE_URL` | Payer, Call AI Agent |
| `VITE_GECX_PAYER_CHAT_URL` | Payer, Chat with AI Agent |
| `VITE_GECX_PROVIDER_VOICE_URL` | Provider, Call AI Agent |
| `VITE_GECX_PROVIDER_CHAT_URL` | Provider, Chat with AI Agent |
| `VITE_GECX_LIFE_SCIENCES_VOICE_URL` | Life Sciences, Call AI Agent |
| `VITE_GECX_LIFE_SCIENCES_CHAT_URL` | Life Sciences, Chat with AI Agent |

Set them in **one** of these ways:

- **CI/CD pipeline (recommended):** define them as build environment variables in the pipeline.
- **File on the build machine:** copy `.env.example` to `.env.production.local` and fill in the values. Never commit this file; `.gitignore` already excludes it.

Rules:
- Each value must be a full `https://` URL. Anything else (empty, `http://`, malformed) shows that button as disabled with "link not configured" or "link is invalid".
- If one agent serves several categories, use the same URL for each.
- **These values are public.** Anyone can read them in the browser. Never put API keys, tokens or other secrets in any `VITE_*` variable.

## 3. Build

```bash
npm run build
```

The output goes to `dist/`:

```
dist/
  index.html
  assets/      (hashed JS and CSS files)
  brand/       (logo and font slots)
  personas/    (portrait slots)
```

To preview the production build locally before deploying:

```bash
npm run preview
```

This serves it at http://localhost:4173.

## 4. Deploy `dist/`

Upload the **contents** of `dist/` to the web root of your host. Requirements:

- **HTTPS** is required.
- **No server-side routing is needed.** It's a single page at `/`.
- It can live at the site root (`https://ai-demo.example.com/`). To serve it from a sub-path such as `/ai-demo/`, add `base: '/ai-demo/'` to `vite.config.js` and rebuild.

### Recommended caching

| Path | Cache header |
| --- | --- |
| `/index.html` | `Cache-Control: no-cache` (so new deploys show up right away) |
| `/assets/*` | `Cache-Control: public, max-age=31536000, immutable` (file names change on every build) |

### Example: nginx

```nginx
server {
    listen 443 ssl;
    server_name ai-demo.example.com;
    # ssl_certificate / ssl_certificate_key ...

    root /var/www/optum-ai-experience;   # contents of dist/
    index index.html;

    location = /index.html {
        add_header Cache-Control "no-cache";
    }

    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Other static hosts

Any static host works the same way. Set the build command to `npm ci && npm run build` and the output folder to `dist`, set the six variables in the host's build settings, and turn on HTTPS. Examples: Azure Static Web Apps, AWS S3 with CloudFront, Netlify, and internal static hosting.

## 5. Network and security notes

- **External requests:** the page loads fonts from Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`). If your network or Content Security Policy blocks them, the page falls back to system fonts. To avoid the external call, install the licensed Optum Sans files (see `public/brand/README.md`) and remove the Google Fonts `<link>` tags from `index.html`.
- **GECX links:** the voice agent opens in a pop-up window docked to the right of the screen, and chat opens in a new tab. If a browser blocks the pop-up, voice also opens in a new tab. Both are opened with no opener and no referrer, and no persona or user data is added to the URLs.
- **Content Security Policy (optional):** if you add one, a starting point is below. Test it before enforcing it.

  ```
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data:;
  connect-src 'self';
  frame-ancestors 'none';
  ```

  The app needs no `connect-src` beyond `'self'`: it makes no API calls.

## 6. Check the deployment

Open the deployed URL and confirm:

- [ ] The page loads over HTTPS with no errors in the browser console.
- [ ] The left navigation shows Payer, Provider and Life Sciences, and switching them updates both cards.
- [ ] In each category, **Call AI Agent** and **Chat with AI Agent** are active, not grey "not configured" buttons.
- [ ] **Call AI Agent** opens the GECX voice agent in a side window (or a new tab), and the card switches to "Try asking" cues.
- [ ] **Chat with AI Agent** opens the GECX chat agent in a new tab.
- [ ] The phone layout works (narrow the window or use a phone).
- [ ] **End to end:** place a real call and start a real chat with each GECX agent. This app only launches them; the agents themselves have not been tested as part of this build.

---

## Updating the site later

| Change | What to do |
| --- | --- |
| GECX URLs | Update the variables, rebuild, redeploy. |
| Card text edited on the page | In the app, click **Edit text**, then **Export**. Replace `src/contentOverrides.json` with the exported file, rebuild, redeploy. (Edits made on the page are otherwise saved only in that one browser.) |
| Approved logo, fonts, portraits | See `public/brand/README.md` and `public/personas/README.md`, then rebuild and redeploy. |
| Brand colors | Edit the variables at the top of `src/App.css`, rebuild, redeploy. |

## Local development

```bash
npm ci
cp .env.example .env.local   # optional: add GECX URLs to make the buttons live
npm run dev                  # http://localhost:5173
```

Restart `npm run dev` after changing `.env.local`.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| Buttons say "link not configured" | The variable wasn't set at **build** time, or the build ran before it was set. Rebuild. |
| Buttons say "link is invalid" | The URL isn't a full `https://` address. |
| Old content still showing after a deploy | `index.html` is being cached. Apply the `no-cache` header above. |
| Blank page at a sub-path | Set `base` in `vite.config.js` to that sub-path and rebuild. |
| Fonts look different from the demo | Google Fonts is blocked. See "Network and security notes". |
| `npm ci` fails | Node is older than 18.18, or `package-lock.json` is missing. |
| `npm warn install-scripts ... esbuild (postinstall)` | Newer npm versions skip install scripts by default. Harmless: the build still works. |
