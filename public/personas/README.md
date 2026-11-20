# Persona portraits

Put **licensed** portrait images here, one per persona. They must be cleared for internal presentation use, and must not show real members or patients.

- Format: JPG or WebP, at least 900 × 900 px, with the face in the upper-middle of the frame. The portrait panel crops to fill and is roughly 3:2 landscape on desktop.
- Name each file after the persona, for example `jordan-ellis.jpg`.
- In `src/data.js`, set that persona's `photo` to the path, for example `photo: '/personas/jordan-ellis.jpg'`.

A persona with `photo: null`, or whose file is missing, shows an initials avatar instead of a broken image.
