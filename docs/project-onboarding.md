# Project Onboarding

Authoring guide for `docs/spec/ROOT_SPEC.md` and its addenda. Continuum v1 and FantasyBoy are accepted; BeamVM’s content is accepted but paused while the user prepares its code release. The user also authorized a [six-project parallel draft batch](projects/batch-draft-review.md), now prepared with Astra agents and media gaps recorded. Draft metadata is visible before publication; unknown values remain pending. User assessment still precedes public selection.

## Maintainer prompt

Copy this paragraph to a project's maintainer LLM, replacing the project name:

> We are preparing a portfolio entry for **[project name]** on whatclaudemade.com, a site showcasing projects made by Claude and/or Codex under the guidance of BishopDynamics. Help me plan a small set of excellent, truthful screenshots that show what makes this project useful and distinctive. First establish whether the project's code is public or private, then inspect its current implementation/release and existing media, then discuss the best scenes or workflows with me before capturing anything. We need one strong landscape cover (ideally suitable for a 16:9 crop) and a few supporting images that remain readable when enlarged; preserve uncropped high-resolution originals and identify any small UI text or content that must remain visible. Prefer a clean, repeatable demo with prepared data, tidy windows, and no notifications, private information, or diagnostic overlays. For each proposed image, explain what it demonstrates, how to reproduce and capture it on a supported platform, and suggest a caption and useful alt text. Identify existing media we can reuse and its provenance. Also help establish the project's actual languages, a concise description, and an outline of its motivation, implementation decisions, and Claude/Codex contribution. Use Git/release evidence to suggest the first project-specific work date and completion/release date, accounting for upstream history, submodules, and later maintenance; record relevant commit/release evidence, linking publicly only when available and call out ambiguity rather than guessing. Return the capture plan and factual notes for discussion first; publication and final copy will be reviewed separately.

## Intake and preparation

1. Confirm the canonical project name and whether its source is `public` or `private`. For public source, verify its public repository and any release links; private projects omit the repository URL and need no public code release. Inspect related repositories when the supplied repository is an umbrella.
2. Agree on the project's story and intended audience. Gather evidence for claims rather than copying a README wholesale or inventing performance figures/model attribution.
3. Select a representative cover and supporting images with the user. Record source, capture method, version, captions, alt text, and any planned crop. Preserve meaningful content in the enlarged view.
4. Review the development start and completion dates against project-specific Git/release history. Record selected dates and evidence links in `docs/projects/<slug>.md`. Keep portfolio publication date and later updates distinct.
5. Choose useful tags and accurate languages, including exactly one reserved `public` / `private` source-availability tag before publication. Unknown drafts can leave this choice pending; never assign both. Update other canonical taxonomy values only as needed by reviewed content.
6. Prepare the Markdown article and copied, versioned local assets as a draft. Once implemented, use `make run` for draft review and `npm run preview` after a production build to verify exactly what would publish. A draft flag controls website visibility; it does not hide committed files in the public source repository.

## Article starting outline

- What it does, who it is for, and how it is used. Include instructions to try it when a public release exists.
- Why the project was worth making and the original problem.
- The important design and implementation decisions, with representative code where useful.
- What Claude and/or Codex contributed under BishopDynamics' guidance, using only verified attribution.
- What the result demonstrates and any relevant limitations. Include source/release links where publicly available; personal-use projects can be discussed without a code release.

The actual narrative and section titles should suit each project. Screenshots should help explain the story, not just decorate it.

## Publication review

Every published entry needs its cover image, gallery alt text, title/description, tags/languages, reviewed development dates, and article. Exactly one source-availability tag is required: `public` requires a verified public repository link; `private` omits it. These tags do not control article visibility. Review prose and images for accuracy and privacy, run `make check`, inspect mobile/desktop cards and the expanded gallery, and obtain the user's content assessment before marking the draft public. Confirm all intended external links. Push to the publication branch only as the final authorized publication step.

## Updating an existing article

Use `updatedOn` for later revisions, whether the code is public or private. Preserve the original `publishedOn` and reviewed development span; updates may be frequent without changing homepage recency. Review changed prose/media and rerun the normal checks.

## Continuum starting evidence

- Active intake and evidence record: [Half-Life: Continuum Edition onboarding](projects/half-life-continuum-edition.md). A [tailored maintainer brief](projects/half-life-continuum-edition-maintainer-brief.md) is ready for capture/story discussion.
- Public repository: <https://github.com/bishopdynamics/Continuum>.
- Existing menu tour: [menu documentation](https://github.com/bishopdynamics/Continuum/blob/main/doc/menu.md). The GIF is 640×360; useful as a reference, with higher-resolution captures preferred for enlarged views.
- Linked gameplay video: <https://youtu.be/DVSHgFvknj0>; embedded on the project page via `videoUrl` on 2026-09-10 (see `docs/spec/FEATURE_SPEC_project_video.md`).
- Release [v1.0.0.0](https://github.com/bishopdynamics/Continuum/releases/tag/v1.0.0.0) was published 2026-06-22. This is a candidate completion reference; the start date and exact development endpoint still need review.
- The engine, menu, and game SDK live in related forks. Account for those when collecting history and language evidence.
