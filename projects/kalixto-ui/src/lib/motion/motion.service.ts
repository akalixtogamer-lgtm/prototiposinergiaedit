import { DOCUMENT, Injectable, NgZone, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { KX_MOTION } from './motion.config';

type Callback = (entry: IntersectionObserverEntry) => void;

/**
 * Serviço central de motion:
 * - um único IntersectionObserver para todos os reveals (performance);
 * - um único listener de scroll (passivo, com rAF) para parallax e progresso;
 * - respeita prefers-reduced-motion e reage se a preferência mudar.
 */
@Injectable({ providedIn: 'root' })
export class KxMotionService implements OnDestroy {
  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly config = inject(KX_MOTION);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** true quando o usuário pediu menos movimento no sistema. */
  readonly reducedMotion = signal(false);

  private io?: IntersectionObserver;
  private readonly targets = new Map<Element, Callback>();
  private readonly scrollSubs = new Set<() => void>();
  private ticking = false;
  private mql?: MediaQueryList;

  constructor() {
    if (!this.isBrowser) return;
    this.mql = this.doc.defaultView?.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion.set(!!this.mql?.matches);
    this.mql?.addEventListener('change', this.onMotionPref);
    // Marca o documento: só a partir daqui os estados iniciais (opacity 0…) valem.
    this.doc.documentElement.classList.add('kx-motion-ready');
    this.zone.runOutsideAngular(() => {
      this.doc.defaultView?.addEventListener('scroll', this.onScroll, { passive: true });
      this.doc.defaultView?.addEventListener('resize', this.onScroll, { passive: true });
    });
  }

  private readonly onMotionPref = (e: MediaQueryListEvent) => this.reducedMotion.set(e.matches);

  /** Observa um elemento; o callback roda quando ele entra/sai do viewport. */
  observe(el: Element, cb: Callback): void {
    if (!this.isBrowser) return;
    if (typeof IntersectionObserver === 'undefined') {
      cb({ isIntersecting: true, target: el } as IntersectionObserverEntry);
      return;
    }
    this.io ??= new IntersectionObserver(
      (entries) => entries.forEach((e) => this.targets.get(e.target)?.(e)),
      { threshold: this.config.threshold, rootMargin: this.config.rootMargin },
    );
    this.targets.set(el, cb);
    this.io.observe(el);
  }

  unobserve(el: Element): void {
    this.targets.delete(el);
    this.io?.unobserve(el);
  }

  /** Inscreve uma função no laço de scroll (executada fora do Angular, em rAF). */
  onScrollFrame(fn: () => void): () => void {
    this.scrollSubs.add(fn);
    if (this.isBrowser) fn();
    return () => this.scrollSubs.delete(fn);
  }

  private readonly onScroll = () => {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      this.ticking = false;
      this.scrollSubs.forEach((fn) => fn());
    });
  };

  ngOnDestroy(): void {
    this.io?.disconnect();
    this.mql?.removeEventListener('change', this.onMotionPref);
    this.doc.defaultView?.removeEventListener('scroll', this.onScroll);
    this.doc.defaultView?.removeEventListener('resize', this.onScroll);
  }
}
