# Buzzer Klip · 100-Day Instagram Queue

Cloud-hosted daily Instagram publishing queue for Buzzer Klip.

## Editorial system

**Potong. Posting. Cuan.** remains the umbrella idea. The queue now uses a cinematic mixed-abstract system: anonymous figures, creator objects, editing symbols, portals, devices, energy forms, and atmospheric scenes. Neon lime/cyan/magenta/lavender light, volumetric smoke, strong editorial typography, and the transparent Buzzer Klip PNG logo keep the feed cohesive without repeating one subject.

This is intentionally separate from the Lajora visual system.

- 100 consecutive posts: 2026-08-01 through 2026-11-08
- Every complete seven-day campaign week: exactly 3 five-slide carousels and 4 single-image posts
- Carousel/single order is deterministically randomized per week, so rerunning the generator keeps the same approved schedule
- Total across 100 days: 43 carousels and 57 singles
- Total production artwork: 272 final 1080×1350 JPG files
- The 97 queued posts mix 39 human, 38 object, and 20 scene-led concepts
- Nine editorial themes rotate across education, mindset, relatable creator life, community, brand, challenge, story, motivation, and clipper culture
- Education is limited to 19 of the 97 future posts; the other 78 posts use non-educational themes
- Twelve original electronic audio cues rotate across the 100-day plan
- One approved post daily, targeted for 09:07 WIB via GitHub-hosted Actions
- An early no-op probe covers delayed GitHub schedules; idempotency keeps publication at one post per day
- Public assets: GitHub Pages
- Captions: Indonesian, practical, energetic, CTA-led
- Instagram account: supplied through `INSTAGRAM_USER_ID` and `META_ACCESS_TOKEN` repository secrets

## Local checks

```bash
npm run campaign
npm run validate
npm run build
npm run validate:assets
```

`npm run campaign` regenerates the original audio pack, deterministic content plan,
all mixed-abstract artwork, validation, and the public preview dashboard.

`npm run validate` checks the 100-day editorial structure before artwork production.
`npm run validate:assets` additionally requires every single image and every carousel slide to exist.
`npm run plan` preserves matching approval and Instagram publication ledger fields, so regenerating
the deterministic plan does not reopen already-published posts.

Every publishable item must have `approval_required: true`, `approval_status: "approved"`, and
`status: "queued_auto"`. Draft/review items are ignored by the cloud publisher.

## Audio policy

The queue preserves the requested feed formats: real Instagram carousels and real single-photo posts. Each item includes a selected original preview cue, BPM, mood, and native Instagram search direction.

- Original cues: `assets/audio/abstract-human-v1/*.m4a`
- Audio manifest: `assets/audio/abstract-human-v1/manifest.json`
- The public dashboard exposes an audio player for every scheduled post.

- Instagram's native app offers music for feed photos and photo carousels.
- Meta's Instagram Audio API can retrieve trending music when `search_query` is omitted, but the API attaches that audio through `audio_configuration` when creating **Reels**.
- GitHub Actions publishes the approved feed image/carousel. The plan records `selection: "trending"`, the original preview cue, BPM, mood, and `native_search` so the matching music can be applied in Instagram's native feed composer.
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
