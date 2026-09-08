/** Native links remain usable until this progressively enhanced element connects. */
class ProjectGallery extends HTMLElement {
  private cleanup?: () => void;

  connectedCallback() {
    if (this.cleanup) return;
    const dialog = this.querySelector<HTMLDialogElement>(
      '[data-gallery-dialog]',
    );
    const strip = this.querySelector<HTMLElement>('[data-gallery-strip]');
    const links = Array.from(
      this.querySelectorAll<HTMLAnchorElement>('[data-gallery-image]'),
    );
    if (
      !dialog ||
      !strip ||
      !links.length ||
      typeof dialog.showModal !== 'function'
    )
      return;

    const close = dialog.querySelector<HTMLButtonElement>(
      '[data-gallery-close]',
    )!;
    const previous = dialog.querySelector<HTMLButtonElement>(
      '[data-gallery-previous]',
    );
    const next = dialog.querySelector<HTMLButtonElement>('[data-gallery-next]');
    const stage = dialog.querySelector<HTMLElement>('[data-gallery-stage]')!;
    const caption = dialog.querySelector<HTMLElement>(
      '[data-gallery-caption]',
    )!;
    const position = dialog.querySelector<HTMLElement>(
      '[data-gallery-position]',
    )!;
    const status = dialog.querySelector<HTMLElement>('[data-gallery-status]')!;
    const original = dialog.querySelector<HTMLAnchorElement>(
      '[data-gallery-original]',
    )!;
    const stripControls = this.querySelector<HTMLElement>(
      '[data-strip-controls]',
    );
    const stripPrevious = this.querySelector<HTMLButtonElement>(
      '[data-strip-previous]',
    );
    const stripNext =
      this.querySelector<HTMLButtonElement>('[data-strip-next]');
    const controller = new AbortController();
    const { signal } = controller;
    let current = 0;
    let origin: HTMLAnchorElement | undefined;
    let unlock: (() => void) | undefined;
    let pendingImage: HTMLImageElement | undefined;

    const lockScroll = () => {
      const x = window.scrollX;
      const y = window.scrollY;
      const body = document.body;
      const html = document.documentElement;
      const saved: Array<[CSSStyleDeclaration, string, string, string]> = [];
      const set = (
        style: CSSStyleDeclaration,
        property: string,
        value: string,
      ) => {
        saved.push([
          style,
          property,
          style.getPropertyValue(property),
          style.getPropertyPriority(property),
        ]);
        style.setProperty(property, value, 'important');
      };
      const scrollbar = window.innerWidth - html.clientWidth;
      if (scrollbar > 0)
        set(
          body.style,
          'padding-right',
          `${parseFloat(getComputedStyle(body).paddingRight) + scrollbar}px`,
        );
      set(html.style, 'overflow', 'hidden');
      set(body.style, 'position', 'fixed');
      set(body.style, 'top', `${-y}px`);
      set(body.style, 'left', `${-x}px`);
      set(body.style, 'width', '100%');
      set(body.style, 'overflow', 'hidden');
      return () => {
        for (const [style, property, value, priority] of saved.reverse()) {
          if (value) style.setProperty(property, value, priority);
          else style.removeProperty(property);
        }
        // Restore the exact position even on pages opting into smooth scrolling.
        const behavior = html.style.getPropertyValue('scroll-behavior');
        const priority = html.style.getPropertyPriority('scroll-behavior');
        html.style.setProperty('scroll-behavior', 'auto', 'important');
        window.scrollTo(x, y);
        if (behavior)
          html.style.setProperty('scroll-behavior', behavior, priority);
        else html.style.removeProperty('scroll-behavior');
      };
    };

    const clearImage = () => {
      if (pendingImage) {
        pendingImage.onload = null;
        pendingImage.onerror = null;
        pendingImage = undefined;
      }
      stage.replaceChildren();
    };
    const select = (index: number) => {
      current = Math.max(0, Math.min(links.length - 1, index));
      const link = links[current]!;
      const thumbnail = link.querySelector('img')!;
      // Browsers can drop focus to the body as soon as a focused button is disabled.
      const focusedNavigation =
        document.activeElement === previous
          ? previous
          : document.activeElement === next
            ? next
            : null;
      clearImage();
      caption.textContent = link.dataset.caption ?? '';
      caption.hidden = !caption.textContent;
      caption.scrollTop = 0;
      position.textContent = `${current + 1} / ${links.length}`;
      original.href = link.href;
      if (previous) previous.disabled = current === 0;
      if (next) next.disabled = current === links.length - 1;
      if (focusedNavigation?.disabled) {
        const destination =
          previous && !previous.disabled
            ? previous
            : next && !next.disabled
              ? next
              : close;
        destination.focus({ preventScroll: true });
      }
      status.textContent = 'Loading image…';
      const image = new Image();
      pendingImage = image;
      image.alt = thumbnail.alt;
      image.width = Number(link.dataset.imageWidth);
      image.height = Number(link.dataset.imageHeight);
      image.decoding = 'async';
      image.onload = () => {
        if (pendingImage !== image || !dialog.open) return;
        status.textContent = '';
        stage.replaceChildren(image);
      };
      image.onerror = () => {
        if (pendingImage !== image || !dialog.open) return;
        status.textContent =
          'This image could not be loaded. Try opening the full image.';
      };
      // No other full-size image is requested or inserted into the document.
      image.src = link.href;
    };

    const finishClose = () => {
      clearImage();
      unlock?.();
      unlock = undefined;
      if (origin?.isConnected) origin.focus({ preventScroll: true });
      origin = undefined;
    };
    for (const [index, link] of links.entries()) {
      link.addEventListener(
        'click',
        (event) => {
          if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          )
            return;
          // If the API fails, keep the browser's ordinary link navigation.
          try {
            dialog.showModal();
          } catch {
            return;
          }
          event.preventDefault();
          origin = link;
          unlock = lockScroll();
          select(index);
          close.focus({ preventScroll: true });
        },
        { signal },
      );
    }
    close.addEventListener('click', () => dialog.close(), { signal });
    dialog.addEventListener(
      'close',
      () => {
        if (!dialog.open) finishClose();
      },
      { signal },
    );
    previous?.addEventListener('click', () => select(current - 1), { signal });
    next?.addEventListener('click', () => select(current + 1), { signal });
    dialog.addEventListener(
      'keydown',
      (event) => {
        if (
          !dialog.open ||
          event.defaultPrevented ||
          event.altKey ||
          event.ctrlKey ||
          event.metaKey
        )
          return;
        if (event.key === 'Tab') {
          const controls = Array.from(
            dialog.querySelectorAll<HTMLElement>('button, a[href], [tabindex]'),
          ).filter(
            (control) =>
              control.tabIndex >= 0 &&
              !control.matches(':disabled') &&
              control.getClientRects().length > 0 &&
              getComputedStyle(control).visibility !== 'hidden',
          );
          const first = controls[0];
          const last = controls.at(-1);
          const focused = document.activeElement;
          const outside = focused === dialog || !dialog.contains(focused);
          const destination = event.shiftKey
            ? outside || focused === first
              ? last
              : undefined
            : outside || focused === last
              ? first
              : undefined;
          if (destination) {
            event.preventDefault();
            destination.focus({ preventScroll: true });
          }
          return;
        }
        if (event.shiftKey) return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          const index = current + (event.key === 'ArrowRight' ? 1 : -1);
          if (index >= 0 && index < links.length) select(index);
        }
      },
      { signal },
    );

    const updateStrip = () => {
      // Snap positions and padding can leave a nonzero scrollLeft at a visible end.
      // The strip is borderless; compare visual bounds so CSS zoom scales both sides.
      const { left, right } = strip.getBoundingClientRect();
      const atStart = links[0]!.getBoundingClientRect().left >= left - 1;
      const atEnd = links.at(-1)!.getBoundingClientRect().right <= right + 1;
      if (stripControls) stripControls.hidden = atStart && atEnd;
      if (stripPrevious) stripPrevious.disabled = atStart;
      if (stripNext) stripNext.disabled = atEnd;
    };
    const scrollStrip = (direction: number) => {
      strip.scrollBy({
        left: direction * strip.clientWidth * 0.8,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      });
    };
    stripPrevious?.addEventListener('click', () => scrollStrip(-1), { signal });
    stripNext?.addEventListener('click', () => scrollStrip(1), { signal });
    strip.addEventListener('scroll', updateStrip, { signal, passive: true });
    window.addEventListener('resize', updateStrip, { signal });
    const observer =
      typeof ResizeObserver === 'function'
        ? new ResizeObserver(updateStrip)
        : undefined;
    observer?.observe(strip);
    updateStrip();

    this.cleanup = () => {
      controller.abort();
      observer?.disconnect();
      if (dialog.open) dialog.close();
      finishClose();
      if (stripControls) stripControls.hidden = true;
    };
  }

  disconnectedCallback() {
    this.cleanup?.();
    this.cleanup = undefined;
  }
}

if (!customElements.get('project-gallery'))
  customElements.define('project-gallery', ProjectGallery);
