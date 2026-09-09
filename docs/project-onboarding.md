# Project Onboarding

Authoring guide for the approved `docs/spec/ROOT_SPEC.md` and its onboarding addenda. Add projects one at a time with the user. Half-Life: Continuum Edition v1 was accepted as release-ready on 2026-09-08; [BeamVM](projects/beamvm.md) is the user's next selected project.

## Maintainer prompt

Copy this paragraph to a project's maintainer LLM, replacing the project name:

> We are preparing a portfolio entry for **[project name]** on whatclaudemade.com, a site showcasing projects made by Claude and/or Codex under the guidance of BishopDynamics. Help me plan a small set of excellent, truthful screenshots that show what makes this project useful and distinctive. First inspect the project's current public release and existing media, then discuss the best scenes or workflows with me before capturing anything. We need one strong landscape cover (ideally suitable for a 16:9 crop) and a few supporting images that remain readable when enlarged; preserve uncropped high-resolution originals and identify any small UI text or content that must remain visible. Prefer a clean, repeatable demo with prepared data, tidy windows, and no notifications, private information, or diagnostic overlays. For each proposed image, explain what it demonstrates, how to reproduce and capture it on a supported platform, and suggest a caption and useful alt text. Identify existing media we can reuse and its provenance. Also help establish the project's actual languages, a concise description, and an outline of its motivation, implementation decisions, and Claude/Codex contribution. Use Git/release evidence to suggest the first project-specific work date and completion/release date, accounting for upstream history, submodules, and later maintenance; provide the relevant public commit/release links and call out ambiguity rather than guessing. Return the capture plan and factual notes for discussion first; publication and final copy will be reviewed separately.

## Intake and preparation

1. Confirm the canonical project name and public repository/release links with the user. Inspect related repositories when the supplied repository is an umbrella.
2. Agree on the project's story and intended audience. Gather evidence for claims rather than copying a README wholesale or inventing performance figures/model attribution.
3. Select a representative cover and supporting images with the user. Record source, capture method, version, captions, alt text, and any planned crop. Preserve meaningful content in the enlarged view.
4. Review the development start and completion dates against project-specific Git/release history. Record selected dates and evidence links in `docs/projects/<slug>.md`. Keep portfolio publication date and later updates distinct.
5. Choose useful tags and accurate languages. Update the canonical taxonomy only as needed by reviewed content.
6. Prepare the Markdown article and optimized local assets as a draft. Once implemented, use `make run` for draft review and `npm run preview` after a production build to verify exactly what would publish. A draft flag controls website visibility; it does not hide committed files in the public source repository.

## Article starting outline

- What it does, who it is for, and how to try the released project.
- Why the project was worth making and the original problem.
- The important design and implementation decisions, with representative code where useful.
- What Claude and/or Codex contributed under BishopDynamics' guidance, using only verified attribution.
- What the finished result demonstrates, any relevant limitations, and links to source/releases.

The actual narrative and section titles should suit each project. Screenshots should help explain the story, not just decorate it.

## Publication review

Every published entry needs its cover image, gallery alt text, title/description, tags/languages, reviewed development dates, repository link, and article. Review prose and images for accuracy and privacy, run `make check`, inspect mobile/desktop cards and the expanded gallery, and obtain the user's content assessment before marking the draft public. Confirm all intended external links. Push to the publication branch only as the final authorized publication step.

## Continuum starting evidence

- Active intake and evidence record: [Half-Life: Continuum Edition onboarding](projects/half-life-continuum-edition.md). A [tailored maintainer brief](projects/half-life-continuum-edition-maintainer-brief.md) is ready for capture/story discussion.
- Public repository: <https://github.com/bishopdynamics/Continuum>.
- Existing menu tour: [menu documentation](https://github.com/bishopdynamics/Continuum/blob/main/doc/menu.md). The GIF is 640×360; useful as a reference, with higher-resolution captures preferred for enlarged views.
- Linked gameplay video: <https://youtu.be/DVSHgFvknj0>; not yet reviewed in this planning session.
- Release [v1.0.0.0](https://github.com/bishopdynamics/Continuum/releases/tag/v1.0.0.0) was published 2026-06-22. This is a candidate completion reference; the start date and exact development endpoint still need review.
- The engine, menu, and game SDK live in related forks. Account for those when collecting history and language evidence.
