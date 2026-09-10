# SPEC: Project video embeds and the first published-article update

- **Status:** approved
- **Request:** On 2026-09-10 the user accepted the website launch and asked to test the project-update cycle using `docs/TODO.md`: embed their public Continuum video at https://www.youtube.com/watch?v=DVSHgFvknj0.
- **Presentation preference:** The user requested the cleanest, most minimal player achievable with YouTube's supported parameters.
- **Approval:** On 2026-09-10 the user approved this spec, including the minimal-player refinement, and requested wrapping the session. Implementation is ready for the next session; publication follows review of the rendered update.

## Summary

Add an optional YouTube player to project detail pages using the existing `videoUrl` field, then update the published Half-Life: Continuum Edition article with the user's video. Exercise the normal revision cycle: prepare locally, verify, review the rendered result, then publish the approved update through Actions.

## Goals

- Visitors can play the supplied video on the Continuum page.
- The player fits the existing theme on desktop and mobile, supports ordinary keyboard/fullscreen controls, and starts only when requested.
- Projects without supported video URLs keep their existing presentation; other HTTPS video links remain usable as links.
- Keep the existing cover, gallery, animated tour, accepted prose, development dates, and first-publication date.
- Record the revision with `updatedOn` and verify the approved update after deployment.

## Non-Goals

- Other video providers, playlists, multiple videos, a video gallery, arbitrary author-supplied iframe HTML, or self-hosted video files.
- Downloading/rehosting the YouTube video or its thumbnail, adding dependencies, an API key, analytics, or a custom playback API.
- New project publication, BeamVM changes, a new release of Continuum itself, or changes to project recency ordering.

## Key Decisions

| Decision | Choice | Rationale / alternatives considered |
| --- | --- | --- |
| Data | Reuse optional `videoUrl` | It already exists in schema/types and supplies the header's Video link. A second provider/ID field would duplicate the URL. |
| Placement | Video section between the image gallery and the article | Keeps project media together; avoids inserting special markup into the accepted Markdown story. |
| Appearance | Full available prose width, normally 16:9, dark surface/border matching the gallery | Native controls remain recognizable. Keep height at least 200px on narrow screens and prevent horizontal overflow. |
| Provider | Standard YouTube iframe using `www.youtube-nocookie.com` | YouTube's documented privacy-enhanced embed; no promise of zero third-party requests. A separate consent or click-to-load interface is outside this focused update. |
| Loading | Lazy iframe, no autoplay, inline mobile playback, native keyboard/fullscreen controls | Supports deliberate playback without adding client-side application code. |
| Minimal player | White progress bar, annotations hidden where supported, related videos limited to the same channel | Keep playback, seeking, volume and fullscreen usable. Hiding all controls would remove those visible controls; deprecated branding options cannot simplify the player. |
| Fallback | Keep the header Video link; include Watch on YouTube beside the player | The destination stays available if embedding is blocked or unavailable. |
| Revision dates | Preserve `publishedOn: 2026-09-10`; set `updatedOn` to the actual approved update date | Updating an article does not make it a newly published project. Both dates may legitimately be September 10. |

## Design

### URL handling and component

- Add a small pure helper, `youtubeVideoId(url)`, returning a validated ID or `undefined`.
- Support HTTPS `youtube.com/watch?v=…`, `www.youtube.com/watch?v=…`, `m.youtube.com/watch?v=…`, and `youtu.be/<id>` URLs. Require an exact allowed hostname, no credentials/nonstandard port, and one unambiguous 11-character ID containing only letters, digits, `_` or `-`. Do not treat a host suffix or a URL embedded inside a query as a provider match.
- Ignore sharing parameters for playback; this feature starts at the beginning. Unsupported forms remain external Video links rather than becoming an iframe or making otherwise valid content fail schema validation.
- Render `ProjectVideo.astro` only for a recognized URL. Construct its iframe URL from the validated ID and fixed options; never pass the full author URL into `src` or render returned oEmbed HTML.
- Use a `Video` heading, a descriptive iframe title derived from the project title, `loading="lazy"`, `referrerpolicy="strict-origin-when-cross-origin"`, and fullscreen support. Fixed playback options are `autoplay=0`, `playsinline=1`, `controls=1`, `disablekb=0`, `fs=1`, `rel=0`, `iv_load_policy=3`, and `color=white`. Avoid a referrer policy that suppresses the origin.
- Add styles to `src/styles/project.css`; reserve player space before it loads. The website's own copied media remains local. Assets served inside the explicitly requested YouTube player are provider-managed; no external thumbnail is added as a site-owned image.
- No YouTube requests at build time. Automated checks use synthetic fixture IDs/markup; real playback is a browser review step.

### Minimal-player limits

`rel=0` limits recommendations to the video's channel; it does not remove them. `iv_load_policy=3` requests hidden annotations where applicable. YouTube no longer honors `modestbranding`, `showinfo`, `autohide`, or `theme`; do not add these as cosmetic no-ops. Branding/title overlays remain provider-controlled. Use the supported settings above and verify the actual appearance; do not crop or cover the iframe to conceal its interface. See the official player-parameter reference below.

### Continuum revision

Add the supplied canonical watch URL to `videoUrl`. Add `updatedOn` when preparing the approved revision, and reconcile it before publication if review spans dates. Keep `draft: false`: local edits to an already published article are reviewed before the next push. Do not create a duplicate article or change its slug, first-publication date, development span, cover/GIF, or accepted writing.

The existing metadata component displays Updated and Video automatically; sitemap `lastmod` already prefers `updatedOn`. Existing homepage/catalog ordering continues to use `publishedOn`.

### Verification and release

- Extend existing actual-page build fixtures to cover a recognized YouTube embed, no video, an unsupported provider's preserved link, and a draft with a video ID absent from public output. Assert provider/ID, title, the specified minimal-player options, no deprecated parameters, referrer policy, fallback, and existing date/link behavior.
- Add focused helper tests for supported forms and malformed/lookalike URLs. Reuse existing metadata-order and sitemap tests rather than reproducing their implementations.
- Run `make check`. Parent reviews desktop/mobile layout, keyboard access, no autoplay, actual playback after user interaction, fullscreen, fallback link, preserved GIF/gallery, and the local production artifact.
- Review the rendered update with the user before publishing. After approval, push to `github/main`, follow Actions through deployment, and verify the live HTTPS page, playback, metadata and continued draft exclusion. Mark the TODO done only after the requested update is delivered; user owns pruning it.

## Implementation Plan

1. **YouTube embed and Continuum revision — (M), [serial].** One native `gpt-6-astra`/high worker after spec approval, using a self-contained task brief. A lone worker may use the main checkout; no concurrent write workers.
   - **Worker-owned files:** `src/lib/project-video.ts` (new), `src/components/ProjectVideo.astro` (new), `src/layouts/Project.astro`, `src/styles/project.css`, `src/content/projects/half-life-continuum-edition.md` (only `videoUrl`/`updatedOn`), `tests/project-video.test.ts` (new), `tests/project-pages.test.ts`, `tests/fixtures/projects/page-fixtures.ts`.
   - **Orchestrator-owned files:** this spec, root addendum, task queue, handoff/memory, `PROJECT.md`, `docs/development.md`, `docs/project-onboarding.md`, `docs/projects/half-life-continuum-edition.md`, `docs/DEFERRED.md`; TODO completion marking only. Parent owns browser verification, content review, commits/integration and the approved publication.
   - **Worker verification:** focused helper/page tests, `make check`, `git diff --check`. No external-service-dependent CI tests. Report real output and leave publication to the parent.

## Open Questions

None. Actual embedded playback remains an implementation verification requirement; successful oEmbed metadata is not proof of playback.

## Deferred / Follow-ups

- Other video providers, multiple videos/playlists, and richer comparison media remain future work.
- Additional Continuum still images remain the existing gallery-v2 follow-up.

## Research

- [User's video](https://www.youtube.com/watch?v=DVSHgFvknj0). YouTube oEmbed returned HTTP 200 on 2026-09-10, with title “Half-Life: Continuum Edition - Unforeseen Consequences” and an embed for the supplied ID. Do not infer additional feature coverage from the title.
- [YouTube player parameters](https://developers.google.com/youtube/player_parameters): iframe format, minimum player size, native controls and inline playback.
- [YouTube embedding help](https://support.google.com/youtube/answer/171780?hl=en): privacy-enhanced hostname and the required referring origin. Missing referrer information can block playback with error 153.

## Change Log

- 2026-09-10 — User approved the complete spec with the minimal-player refinement and requested session wrap. Implementation is queued for the next session.
- 2026-09-10 — User requested minimal player presentation. Added supported clutter-reduction parameters, retained usable playback controls, and documented current YouTube limitations. This refines the draft; implementation/publication are not yet started.
- 2026-09-10 — Prepared the first post-launch update spec from the user's TODO. Reviewed existing URL/date/layout contracts and public video metadata; implementation and publication await review.
