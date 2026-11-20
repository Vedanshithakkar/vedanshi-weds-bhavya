# Vedanshi & Bhavya — wedding invitation

A mobile-first animated wedding invitation website for **Sunday, 28 February 2027**.
It is served by GitHub Pages from the `docs/` folder.

## What's inside

- **Palace-door cover** with a wax seal. Tapping it opens the doors, showers petals and starts soft music.
- **Personal greeting.** `…/?to=Patel%20family` shows "Dear Patel family," on the cover.
  `personalize.html` is a private invite sender (not linked from the invitation). On Android Chrome it can pick guests straight from phone contacts, using their saved names and numbers. You can also type or paste names, or import a .vcf file. Each guest gets a one-tap WhatsApp button that opens their chat with a message and their personal link, and sent invites are ticked off. The list stays in that phone's browser.
- Swinging marigold toran, rotating mandala, gold-foil names and an arch photo frame.
- **Scratch card on the first page.** The date is revealed only there. A live countdown follows further down.
- **Events** go from a sunrise sky (Ganesh Sthapana, Mandap Muhurat, Garba & Dance, Haldi) to a starry night with floating lanterns and diyas (the wedding).
  Each event has an "Add to calendar" button (Google, Apple, Outlook).
- Photo reel (gol dhana) and gallery with a swipeable full-screen viewer.
- **"A little bit filmy"**: a stack of cute, kissing and bold photos. Guests swipe or tap through the cards, and a double-tap pops a heart.
- **Venue** card with directions, a QR code (with a wax-seal centre) and a downloadable QR card image; every event card also gets a Directions button.
- **RSVP** form that sends a ready-made message on WhatsApp.
- Bottom navigation dock, share button and a WhatsApp/Instagram link preview image (`img/og.jpg`).
- The music is generated live in the browser (santoor and tanpura in Raag Bhoopali), so there is no audio file and no copyright issue.
- Respects "reduce motion" settings.

## Classic invitation (`docs/invitation/`)

A second, more formal invitation at `…/vedanshi-weds-bhavya/invitation/`. It uses everyday and family-function photos only, with no pre-wedding shoot pictures.

- Ivory, maroon and gold card style. It opens with an envelope and wax seal; tapping the seal slides the card out. `?to=Name` adds "Dear Name," and `?open` skips the envelope.
- Formal wording with the Ganesh shloka, a live countdown, the schedule as a timeline with Google Calendar links and a single .ics download, a photo gallery with a native `<dialog>` viewer, venue directions and a WhatsApp RSVP.
- Times and venue: the `.ev` items in `docs/invitation/index.html` and `CONFIG` at the top of `docs/invitation/app.js`.
- Photos: edit the list in `tools/build-invitation.cjs`, run `node tools/build-invitation.cjs`, then update the `#grid` buttons in the HTML.

## Editing

| What | Where |
|---|---|
| Ceremony times | `docs/index.html`: the `data-start`/`data-end` attributes and the visible time on each `.event` card |
| Venue, map link, RSVP WhatsApp number | `CONFIG` at the top of `docs/app.js` |
| Venue QR code + shareable QR card | `node tools/make-qr.cjs "<map link>" "<venue name>"` |
| Wording | `docs/index.html` |
| Photos (hero, reel, deck, grid) | `tools/photos.json`, then `node tools/build-images.cjs`. A deck entry can be `{ "file", "position" }` to fix a bad crop, and the hero takes `crop: [left, top, width, height]`. |

The link preview uses the absolute URL in the `og:*` tags in `index.html`. Update it if the site address changes.
