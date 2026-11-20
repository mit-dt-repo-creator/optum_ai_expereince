# Brand assets

Put approved Optum brand files here. Nothing in this folder is loaded until it is wired up, so an empty folder never causes broken images or failed requests.

## Logo

1. Save the approved Optum.ai logo as `optum-ai-logo.svg` (preferred) or `.png`, in the version meant for light backgrounds.
2. In `src/components/Logo.jsx`, set `LOGO_SRC = '/brand/optum-ai-logo.svg'`.

## Typeface

1. Save the licensed Optum Sans web fonts in `fonts/`, for example `OptumSans-Regular.woff2`, `-Medium`, `-SemiBold`, `-Bold`.
2. In `src/App.css`, uncomment the `@font-face` block near the top and check that the file names match.

`--font-sans` already lists "Optum Sans" first, so it is used as soon as the font is available.
