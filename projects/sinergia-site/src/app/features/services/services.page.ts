import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  KxButtonDirective,
  KxCardComponent,
  KxCtaBandComponent,
  KxI18nService,
  KxIconComponent,
  KxPathPipe,
  KxRevealDirective,
  KxSectionHeaderComponent,
  KxSectionNavComponent,
  KxStaggerDirective,
  KxStickyStepsComponent,
  KxTranslatePipe,
} from 'kalixto-ui';
import { Dict } from '../../core/i18n/pt';
import { PageHeroComponent } from '../../shared/page-hero.component';

/**
 * Serviços (mapa: metodologias PITC-PATC, o que é, objetivos e metodologia de
 * cada uma; Focus group; imagens e ícones; subáreas Cinema e Estações CATI).
 * As metodologias aguardam o texto oficial da cliente: a seção mostra uma
 * mensagem honesta com CTA até os itens serem preenchidos em pt.ts/en.ts.
 */
@Component({
  selector: 'sn-services',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    KxButtonDirective,
    KxCardComponent,
    KxCtaBandComponent,
    KxIconComponent,
    KxPathPipe,
    KxRevealDirective,
    KxSectionHeaderComponent,
    KxSectionNavComponent,
    KxStaggerDirective,
    KxStickyStepsComponent,
    KxTranslatePipe,
    PageHeroComponent,
  ],
  template: `
    <sn-page-hero
      [crumbs]="[{ page: 'home', label: 'nav.home' }, { page: null, label: 'nav.services' }]"
      [eyebrow]="'services.hero.eyebrow' | kxT"
      [title]="'services.hero.title' | kxT"
      [text]="'services.hero.text' | kxT"
      image="images/focus-group.svg"
      imageAlt=""
    />

    <kx-section-nav [links]="sections()" [label]="'a11y.onThisPage' | kxT" />

    <!-- Metodologias PITC-PATC -->
    <section id="metodologias" class="kx-section" aria-labelledby="met-h">
      <div class="kx-container">
        <kx-section-header id="met-h" [eyebrow]="'services.methods.eyebrow' | kxT" [title]="'services.methods.title' | kxT" [lead]="'services.methods.lead' | kxT" />
        @if (methods().length) {
          <div class="kx-grid kx-grid--2" kxStagger>
            @for (m of methods(); track m.name) {
              <article class="method" kxReveal>
                <h3>{{ m.name }}</h3>
                <h4>{{ 'services.methods.labels.what' | kxT }}</h4>
                <p>{{ m.what }}</p>
                <h4>{{ 'services.methods.labels.goals' | kxT }}</h4>
                <ul>@for (g of m.goals; track g) { <li>{{ g }}</li> }</ul>
                <h4>{{ 'services.methods.labels.how' | kxT }}</h4>
                <ol>@for (h of m.how; track h) { <li>{{ h }}</li> }</ol>
              </article>
            }
          </div>
        } @else {
          <div class="sn-pending" kxReveal>
            <p>{{ 'services.methods.empty' | kxT }}</p>
            <div><a kxButton="primary" [routerLink]="'contact' | kxPath">{{ 'common.talkToSpecialist' | kxT }}</a></div>
          </div>
        }
      </div>
    </section>

    <!-- Focus group -->
    <section id="focus-group" class="kx-section kx-section--subtle" aria-labelledby="fg-h">
      <div class="kx-container">
        <kx-sticky-steps [steps]="focusSteps()">
          <span class="kx-eyebrow">{{ 'services.focus.eyebrow' | kxT }}</span>
          <h2 id="fg-h">{{ 'services.focus.title' | kxT }}</h2>
          <p class="kx-lead">{{ 'services.focus.lead' | kxT }}</p>
        </kx-sticky-steps>

        <h3 class="protect-title" kxReveal>{{ 'services.focus.protectTitle' | kxT }}</h3>
        <div class="kx-grid kx-grid--3" kxStagger>
          @for (p of protect(); track p.title) {
            <kx-card kxReveal [icon]="p.icon" [title]="p.title" [text]="p.text" />
          }
        </div>
        <p class="kx-small kx-muted note" kxReveal>{{ 'services.focus.note' | kxT }}</p>
      </div>
    </section>

    <!-- Linhas: Cinema e CATI -->
    <section id="linhas" class="kx-section" aria-labelledby="lin-h">
      <div class="kx-container">
        <kx-section-header id="lin-h" [eyebrow]="'services.lines.eyebrow' | kxT" [title]="'services.lines.title' | kxT" />
        <div class="kx-grid kx-grid--2" kxStagger>
          <kx-card kxReveal variant="cover" image="images/cinema-hall.svg" icon="film" [title]="'services.lines.cinema.title' | kxT" [text]="'services.lines.cinema.text' | kxT" [link]="'cinema' | kxPath" [cta]="'services.lines.cinema.cta' | kxT" />
          <kx-card kxReveal variant="cover" image="images/cati-stations.svg" icon="headset" [title]="'services.lines.cati.title' | kxT" [text]="'services.lines.cati.text' | kxT" [link]="'cati' | kxPath" [cta]="'services.lines.cati.cta' | kxT" />
        </div>
      </div>
    </section>

    <kx-cta-band [title]="'services.band.title' | kxT" [text]="'services.band.text' | kxT">
      <a kxButton="accent" kxSize="lg" [routerLink]="'contact' | kxPath">
        {{ 'common.talkToSpecialist' | kxT }}
        <kx-icon name="arrow-right" class="kx-btn__icon kx-btn__icon--trail" [size]="18" />
      </a>
    </kx-cta-band>
  `,
  styles: `
    .method { display: grid; gap: var(--kx-space-1); padding: var(--kx-space-4); border: var(--kx-border); border-radius: var(--kx-radius-lg); }
    .method h4 { margin-top: var(--kx-space-1); font: 500 var(--kx-text-xs) / 1.3 var(--kx-font-mono); letter-spacing: var(--kx-tracking-label); text-transform: uppercase; color: var(--kx-color-brand); }
    .method p, .method li { color: var(--kx-color-fg-muted); }
    .protect-title { margin: var(--kx-space-10) 0 var(--kx-space-3); font-size: var(--kx-text-h3); }
    .note { margin-top: var(--kx-space-3); max-width: 70ch; }
  `,
})
export class ServicesPage {
  private readonly i18n = inject(KxI18nService);
  protected readonly sections = computed(() => this.i18n.get<Dict['services']['sections']>('services.sections'));
  protected readonly methods = computed(() => this.i18n.get<Dict['services']['methods']['items']>('services.methods.items'));
  protected readonly focusSteps = computed(() => this.i18n.get<Dict['services']['focus']['steps']>('services.focus.steps'));
  protected readonly protect = computed(() => this.i18n.get<Dict['services']['focus']['protect']>('services.focus.protect'));
}
