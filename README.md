# Buzzer Klip · 100-Day Instagram Queue

Cloud-hosted daily Instagram publishing queue for Buzzer Klip.

## Editorial system

**Potong. Posting. Cuan.** is the umbrella idea: clipping is treated as a creator skill, a repeatable workflow, and a route to measurable payout. The feed uses Buzzer Klip's own neo-brutalist creator-economy language: lime, pink, lavender, cyan, heavy black borders, sticker labels, timeline marks, screen cards, streetwear energy, and Indonesian headlines.

This is intentionally separate from the Lajora visual system.

- 100 consecutive posts: 2026-08-01 through 2026-11-08
- Every complete seven-day campaign week: exactly 3 five-slide carousels and 4 single-image posts
- Carousel/single order is deterministically randomized per week, so rerunning the generator keeps the same approved schedule
- Total across 100 days: 43 carousels and 57 singles
- One approved post daily, targeted for 09:07 WIB via GitHub-hosted Actions
- An early no-op probe covers delayed GitHub schedules; idempotency keeps publication at one post per day
- Public assets: GitHub Pages
- Captions: Indonesian, practical, energetic, CTA-led
- Instagram account: supplied through `INSTAGRAM_USER_ID` and `META_ACCESS_TOKEN` repository secrets

## Local checks

```bash
npm run plan
npm run validate
npm run build
npm run validate:assets
```

`npm run validate` checks the 100-day editorial structure before artwork production.
`npm run validate:assets` additionally requires every single image and every carousel slide to exist.
`npm run plan` preserves matching approval and Instagram publication ledger fields, so regenerating
the deterministic plan does not reopen already-published posts.

Every publishable item must have `approval_required: true`, `approval_status: "approved"`, and
`status: "queued_auto"`. Draft/review items are ignored by the cloud publisher.

## Audio policy

The queue preserves the requested feed formats: real Instagram carousels and real single-photo posts.

- Instagram's native app offers music for feed photos and photo carousels.
- Meta's Instagram Audio API can retrieve trending music when `search_query` is omitted, but the API attaches that audio through `audio_configuration` when creating **Reels**.
- GitHub Actions therefore publishes these feed images/carousels without an API-attached track. The content plan records `selection: "trending"` so a native-app music selection can be applied when a mobile-assisted publishing step is used.
- If a future campaign item is intentionally changed to a Reel, the Audio API can select trending music automatically before the Reel container is created.

Official references:

- https://developers.facebook.com/documentation/instagram-platform/content-publishing
- https://developers.facebook.com/documentation/instagram-platform/content-publishing/audio-api

## Cloud setup

GitHub Actions expects these repository secrets:

- `INSTAGRAM_USER_ID`
- `META_ACCESS_TOKEN`
- `META_TOKEN_ENCRYPTION_KEY`
- `PUBLIC_ASSET_BASE_URL`

The public asset host is `https://catzrecord.github.io/buzzer-klip-social-100d`.

After a successful Instagram run, the publisher commits the media ledger and explicitly dispatches
the Pages workflow so the public dashboard reflects the latest published state.
