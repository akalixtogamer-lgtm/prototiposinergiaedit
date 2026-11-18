import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  KxButtonDirective,
  KxCardComponent,
  KxI18nService,
  KxIconComponent,
  KxRevealDirective,
  KxSectionHeaderComponent,
  KxStaggerDirective,
  KxTranslatePipe,
} from 'kalixto-ui';
import { Dict } from '../../core/i18n/pt';
import { Localized } from '../../core/models/open-research.model';
import { SignupLinkComponent } from '../../shared/signup-link.component';
import { OpenResearchService } from '../../core/services/open-research.service';
import { PageHeroComponent } from '../../shared/page-hero.component';

/**
 * Pesquisa aberta (mapa: listagem das pesquisas abertas e como participar;
 * CTA para cadastro como participante).
 * Lê public/data/open-research.json; nunca mostra estudos internos/sigilosos
 * nem resultados. Sem pesquisas publicadas, mostra estado vazio + cadastro.
 */
@Component({
  selector: 'sn-open-research',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    KxButtonDirective,
    KxCardComponent,
    KxIconComponent,
    KxRevealDirective,
    KxSectionHeaderComponent,
    KxStaggerDirective,
    KxTranslatePipe,
    PageHeroComponent,
    SignupLinkComponent,
  ],
  template: `
    <sn-page-hero
      [crumbs]="[{ page: 'home', label: 'nav.home' }, { page: null, label: 'nav.research' }]"
      [eyebrow]="'research.hero.eyebrow' | kxT"
      [title]="'research.hero.title' | kxT"
      [text]="'research.hero.text' | kxT"
      image="images/open-research.svg"
      imageAlt=""
    >
      <div class="kx-row" style="margin-top: 8px"><sn-signup-link /></div>
    </sn-page-hero>

    <section class="kx-section" aria-labelledby="list-h" aria-live="polite" [attr.aria-busy]="svc.state() === 'loading'">
      <div class="kx-container">
        <h2 id="list-h" class="list-title">{{ 'research.listTitle' | kxT }}</h2>

        @switch (svc.state()) {
          @case ('loading') {
            <div class="skeletons" aria-hidden="true">
              @for (i of [1, 2, 3]; track i) { <div class="skeleton"></div> }
            </div>
            <p class="kx-sr-only">{{ 'research.loading' | kxT }}</p>
          }
          @case ('error') {
            <div class="sn-pending" role="alert">
              <p>{{ 'research.error' | kxT }}</p>
              <div><button type="button" kxButton="ghost" (click)="svc.load()">{{ 'research.retry' | kxT }}</button></div>
            </div>
          }
          @default {
            @if (svc.items().length) {
              <ul class="kx-grid kx-grid--3 list" role="list" kxStagger>
                @for (r of svc.items(); track r.id) {
                  <li class="item" kxReveal>
                    <span class="status" [class.is-open]="r.status === 'open'">{{ 'research.status.' + r.status | kxT }}</span>
                    <h3>{{ loc(r.title) }}</h3>
                    <p class="kx-muted">{{ loc(r.description) }}</p>
                    <dl>
                      <div><dt>{{ 'research.fields.audience' | kxT }}</dt><dd>{{ loc(r.audience) }}</dd></div>
                      @if (r.requirements) { <div><dt>{{ 'research.fields.requirements' | kxT }}</dt><dd>{{ loc(r.requirements) }}</dd></div> }
                      @if (r.duration) { <div><dt>{{ 'research.fields.duration' | kxT }}</dt><dd>{{ loc(r.duration) }}</dd></div> }
                      @if (r.deadline) { <div><dt>{{ 'research.fields.deadline' | kxT }}</dt><dd>{{ r.deadline | date: 'longDate' : undefined : i18n.language().locale }}</dd></div> }
                    </dl>
                    @if (r.status === 'open') {
                      <a kxButton="primary" [href]="r.url" target="_blank" rel="noopener">
                        {{ 'research.participate' | kxT }}<span class="kx-sr-only">: {{ loc(r.title) }} ({{ 'a11y.newTab' | kxT }})</span>
                      </a>
                    }
                  </li>
                }
              </ul>
            } @else {
              <div class="empty" kxReveal>
                <kx-icon name="clipboard" [size]="40" />
                <h3>{{ 'research.emptyTitle' | kxT }}</h3>
                <p class="kx-muted">{{ 'research.emptyText' | kxT }}</p>
                <sn-signup-link />
              </div>
            }
          }
        }
        <p class="kx-small kx-muted privacy">{{ 'research.privacy' | kxT }}</p>
      </div>
    </section>

    <section class="kx-section kx-section--subtle" aria-labelledby="how-h">
      <div class="kx-container">
        <kx-section-header id="how-h" [eyebrow]="'nav.research' | kxT" [title]="'research.signupTitle' | kxT" [lead]="'research.signupText' | kxT" />
        <ol class="kx-grid kx-grid--3 how" role="list" kxStagger>
          @for (h of how(); track h.title; let i = $index) {
            <li kxReveal><kx-card [icon]="h.icon" [eyebrow]="'0' + (i + 1)" [title]="h.title" [text]="h.text" /></li>
          }
        </ol>
        <div class="kx-row cta" kxReveal>
          <sn-signup-link variant="accent" size="lg" />
        </div>
      </div>
    </section>
  `,
  styles: `
    .list-title { margin-bottom: var(--kx-space-4); font-size: var(--kx-text-h2); }
    .list, .how { margin: 0; padding: 0; }
    .item { display: grid; gap: var(--kx-space-2); align-content: start; padding: var(--kx-space-3); border: var(--kx-border); border-radius: var(--kx-radius-lg); }
    .item dl { margin: 0; display: grid; gap: var(--kx-space-1); }
    .item dt { font: 500 var(--kx-text-xs) / 1.3 var(--kx-font-mono); letter-spacing: var(--kx-tracking-label); text-transform: uppercase; color: var(--kx-color-fg-subtle); }
    .item dd { margin: 0; }
    .status { justify-self: start; padding: 4px 10px; border-radius: var(--kx-radius-pill); background: var(--kx-color-warning-bg); color: var(--kx-color-warning-fg); font: 600 var(--kx-text-xs) / 1.3 var(--kx-font-body); }
    .status.is-open { background: var(--kx-color-success-bg); color: var(--kx-color-success-fg); }
    .empty { display: grid; justify-items: start; gap: var(--kx-space-2); padding: var(--kx-space-6); border: 1px dashed var(--kx-color-line-strong); border-radius: var(--kx-radius-lg); max-width: 760px; color: var(--kx-color-brand); }
    .empty h3, .empty p { color: var(--kx-color-fg); }
    .empty p { color: var(--kx-color-fg-muted); }
    .skeletons { display: grid; gap: var(--kx-grid-gap); grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); }
    .skeleton { height: 260px; border-radius: var(--kx-radius-lg); background: linear-gradient(90deg, var(--kx-color-bg-subtle), var(--kx-color-line), var(--kx-color-bg-subtle)); background-size: 200% 100%; animation: sk 1.4s linear infinite; }
    @keyframes sk { to { background-position: -200% 0; } }
    @media (prefers-reduced-motion: reduce) { .skeleton { animation: none; } }
    .privacy { margin-top: var(--kx-space-4); max-width: 70ch; }
    .cta { margin-top: var(--kx-space-6); }
  `,
})
export class OpenResearchPage {
  protected readonly svc = inject(OpenResearchService);
  protected readonly i18n = inject(KxI18nService);
  protected readonly how = computed(() => this.i18n.get<Dict['research']['how']>('research.how'));

  constructor() {
    this.svc.load();
  }

  protected loc(v: Localized): string {
    return this.i18n.lang() === 'en' ? v.en : v.pt;
  }
}

