import {
  filterProjects,
  parseProjectSearch,
  projectFilterOptions,
  serializeProjectSearch,
} from '../lib/project-search.ts';
import type {
  ProjectFilterOptions,
  ProjectSearchRecord,
  ProjectSearchState,
} from '../types/projects.ts';

class ProjectIndex extends HTMLElement {
  private cleanup?: () => void;

  connectedCallback() {
    if (this.cleanup) return;
    const form = this.querySelector<HTMLFormElement>('[data-project-filters]');
    const source = this.querySelector<HTMLScriptElement>(
      '[data-project-records]',
    );
    const count = this.querySelector<HTMLElement>('[data-project-count]');
    const announcement = this.querySelector<HTMLElement>(
      '[data-project-announcement]',
    );
    const empty = this.querySelector<HTMLElement>('[data-project-no-results]');
    const items = Array.from(
      this.querySelectorAll<HTMLElement>('[data-project-result]'),
    );
    const query = form?.elements.namedItem('q');
    const tag = form?.elements.namedItem('tag');
    const language = form?.elements.namedItem('language');
    const year = form?.elements.namedItem('year');
    if (
      !form ||
      !source ||
      !count ||
      !announcement ||
      !empty ||
      !(query instanceof HTMLInputElement) ||
      !(tag instanceof HTMLSelectElement) ||
      !(language instanceof HTMLSelectElement) ||
      !(year instanceof HTMLSelectElement)
    )
      return;

    let records: ProjectSearchRecord[];
    let options: ProjectFilterOptions;
    try {
      records = JSON.parse(source.textContent ?? '');
      if (
        !Array.isArray(records) ||
        !records.length ||
        records.length !== items.length
      )
        return;
      const slugs = new Set(records.map(({ slug }) => slug));
      if (
        slugs.size !== items.length ||
        items.some((item) => !slugs.has(item.dataset.projectSlug ?? ''))
      )
        return;
      options = projectFilterOptions(records);
    } catch {
      // A malformed or incomplete index must leave the static listing intact.
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;
    let pendingAnnouncement: ReturnType<typeof setTimeout> | undefined;
    const total = records.length;
    const totalLabel = `${total} ${total === 1 ? 'project' : 'projects'}`;
    const hydrate = (state: ProjectSearchState) => {
      query.value = state.q;
      tag.value = state.tag;
      language.value = state.language;
      year.value = state.year;
    };
    const readForm = () =>
      parseProjectSearch(
        new URLSearchParams({
          q: query.value,
          tag: tag.value,
          language: language.value,
          year: year.value,
        }),
        options,
      );
    const updateUrl = (state: ProjectSearchState) => {
      const url = new URL(window.location.href);
      for (const name of ['q', 'tag', 'language', 'year'])
        url.searchParams.delete(name);
      for (const [name, value] of serializeProjectSearch(state, options))
        url.searchParams.set(name, value);
      if (url.href !== window.location.href) {
        // Retain other components' history state, unrelated parameters, and the hash.
        try {
          history.replaceState(history.state, '', url);
        } catch {
          // Local filtering still works if the browser restricts History API writes.
        }
      }
    };
    const apply = (state: ProjectSearchState, announce = true) => {
      const matches = filterProjects(records, state);
      const slugs = new Set(matches.map(({ slug }) => slug));
      for (const item of items)
        item.hidden = !slugs.has(item.dataset.projectSlug ?? '');
      const message =
        matches.length === total
          ? totalLabel
          : `${matches.length} of ${total} projects`;
      count.textContent = message;
      empty.hidden = matches.length > 0;
      updateUrl(state);
      clearTimeout(pendingAnnouncement);
      if (announce)
        pendingAnnouncement = setTimeout(() => {
          announcement.textContent = message;
        }, 200);
    };
    const restore = (announce = true) => {
      const state = parseProjectSearch(
        new URLSearchParams(window.location.search),
        options,
      );
      hydrate(state);
      apply(state, announce);
    };
    const clear = () => {
      const state = parseProjectSearch(new URLSearchParams(), options);
      hydrate(state);
      apply(state);
      query.focus({ preventScroll: true });
    };
    const cleanup = () => {
      controller.abort();
      clearTimeout(pendingAnnouncement);
      form.hidden = true;
      for (const item of items) item.hidden = false;
      count.textContent = totalLabel;
      empty.hidden = true;
      announcement.textContent = '';
    };
    try {
      restore(false);
    } catch {
      cleanup();
      return;
    }

    // Never hydrate while typing: trailing spaces, IME text, and the caret belong to the user.
    form.addEventListener(
      'input',
      (event) => {
        if (event.target === query) apply(readForm());
      },
      { signal },
    );
    form.addEventListener(
      'change',
      (event) => {
        if (event.target !== query) apply(readForm());
      },
      { signal },
    );
    form.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();
        apply(readForm());
      },
      { signal },
    );
    form.addEventListener(
      'reset',
      (event) => {
        event.preventDefault();
        clear();
      },
      { signal },
    );
    this.querySelector('[data-project-clear]')?.addEventListener(
      'click',
      clear,
      { signal },
    );
    window.addEventListener('popstate', () => restore(), { signal });
    window.addEventListener(
      'pageshow',
      (event) => {
        if (event.persisted) restore(false);
      },
      { signal },
    );
    this.cleanup = cleanup;
    form.hidden = false;
  }

  disconnectedCallback() {
    this.cleanup?.();
    this.cleanup = undefined;
  }
}

if (!customElements.get('project-index'))
  customElements.define('project-index', ProjectIndex);
