# Vedanshi & Bhavya — wedding invitation

A mobile-first animated wedding invitation website for **Sunday, 28 February 2027**.
It is served by GitHub Pages from the `docs/` folder.

## What's inside

- **Palace-door cover** with a wax seal. Tapping it opens the doors, showers petals and starts soft music.
- **Personal greeting.** `…/?to=Patel%20family` shows "Dear Patel family," on the cover.
  `personalize.html` makes these links and the WhatsApp message for you. It is not linked from the invitation.
- Swinging marigold toran, rotating mandala, gold-foil names and an arch photo frame.
- **Scratch card** that reveals the date, plus a live countdown.
- **Events** go from a sunrise sky (Ganesh Sthapana, Mandap Muhurat, Haldi) to a starry night with floating lanterns and diyas (the wedding).
  Each event has an "Add to calendar" button (Google, Apple, Outlook).
- Photo reel and gallery with a swipeable full-screen viewer.
- **Venue** card with directions, a QR code (with a wax-seal centre) and a downloadable QR card image; every event card also gets a Directions button.
- **RSVP** form that sends a ready-made message on WhatsApp.
- Bottom navigation dock, share button and a WhatsApp/Instagram link preview image (`img/og.jpg`).
- The music is generated live in the browser (santoor and tanpura in Raag Bhoopali), so there is no audio file and no copyright issue.
- Respects "reduce motion" settings.

## Editing

| What | Where |
|---|---|
| Ceremony times | `docs/index.html`: the `data-start`/`data-end` attributes and the visible time on each `.event` card |
| Venue, map link, RSVP WhatsApp number | `CONFIG` at the top of `docs/app.js` |
| Venue QR code + shareable QR card | `node tools/make-qr.cjs "<map link>" "<venue name>"` |
| Wording | `docs/index.html` |
| Photos | `tools/photos.json`, then `node tools/build-images.cjs` |

The link preview uses the absolute URL in the `og:*` tags in `index.html`. Update it if the site address changes.
