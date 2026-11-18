import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  KxButtonDirective,
  KxCardComponent,
  KxCountUpDirective,
  KxCtaBandComponent,
  KxI18nService,
  KxPathPipe,
  KxRevealDirective,
  KxSectionHeaderComponent,
  KxSectionNavComponent,
  KxSplitTextDirective,
  KxStaggerDirective,
  KxTranslatePipe,
} from 'kalixto-ui';
import { Dict } from '../../core/i18n/pt';
import { PageHeroComponent } from '../../shared/page-hero.component';

/**
 * A Empresa (mapa: texto de apresentação, experiência internacional, números em
 * destaque, imagens, CTA contato/serviços; subáreas Áreas de atuação e
 * Experiência com produtos e serviços).
 */
@Component({
  selector: 'sn-company',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    KxButtonDirective,
    KxCardComponent,
    KxCountUpDirective,
    KxCtaBandComponent,
    KxPathPipe,
    KxRevealDirective,
    KxSectionHeaderComponent,
    KxSectionNavComponent,
    KxSplitTextDirective,
    KxStaggerDirective,
    KxTranslatePipe,
    PageHeroComponent,
  ],
  template: `
    <sn-page-hero
      [crumbs]="[{ page: 'home', label: 'nav.home' }, { page: null, label: 'nav.company' }]"
      [eyebrow]="'company.hero.eyebrow' | kxT"
      [title]="'company.hero.title' | kxT"
      [text]="'company.hero.text' | kxT"
      image="images/full-service.svg"
      [imageAlt]="'company.about.imageAlt' | kxT"
    >
      <div class="kx-row" style="margin-top: 8px">
        <a kxButton="primary" [routerLink]="'contact' | kxPath">{{ 'common.contactUs' | kxT }}</a>
        <a kxButton="ghost" [routerLink]="'services' | kxPath">{{ 'common.seeServices' | kxT }}</a>
      </div>
    </sn-page-hero>

    <kx-section-nav [links]="sections()" [label]="'a11y.onThisPage' | kxT" />

    <!-- Apresentação -->
    <section id="sobre" class="kx-section" aria-labelledby="sobre-h">
      <div class="kx-container kx-split">
        <div class="kx-stack kx-stack--lg">
          <span class="kx-eyebrow" kxReveal="fade-in">{{ 'company.about.eyebrow' | kxT }}</span>
          <h2 id="sobre-h" [kxSplitText]="'company.about.title' | kxT"></h2>
          <p class="kx-muted" kxReveal>{{ 'company.about.p1' | kxT }}</p>
          <p class="kx-muted" kxReveal>{{ 'company.about.p2' | kxT }}</p>
          @if (seals().length) {
            <ul class="sn-seals" role="list" kxStagger>
              @for (s of seals(); track s.k) {
                <li kxReveal="fade-up"><i>{{ s.k }}</i>{{ s.label }}</li>
              }
            </ul>
          }
        </div>
        <figure class="art" kxReveal="image">
          <img src="images/focus-group.svg" alt="" width="1600" height="900" loading="lazy" />
        </figure>
      </div>
    </section>

    <!-- Experiência internacional -->
    <section id="internacional" class="kx-section kx-section--subtle" aria-labelledby="intl-h">
      <div class="kx-container">
        <kx-section-header
          id="intl-h"
          [eyebrow]="'company.international.eyebrow' | kxT"
          [title]="'company.international.title' | kxT"
          [lead]="'company.international.text' | kxT"
        />
        <div class="kx-grid kx-grid--3" kxStagger>
          @for (it of intl(); track it.title) {
            <kx-card kxReveal variant="default" [icon]="it.icon" [title]="it.title" [text]="it.text" />
          }
        </div>
      </div>
    </section>

    <!-- Números -->
    <section id="numeros" class="kx-section" aria-labelledby="num-h">
      <div class="kx-container">
        <kx-section-header id="num-h" [eyebrow]="'company.numbers.eyebrow' | kxT" [title]="'company.numbers.title' | kxT" />
        <dl class="stats" kxStagger>
          @for (st of stats(); track st.label) {
            <div class="sn-stat" kxReveal="fade-up">
              <dt class="label">{{ st.label }}</dt>
              <dd class="value">
                <span [kxCountUp]="st.value" [kxCountFrom]="st.from" [kxCountPlain]="st.plain" [kxCountLocale]="i18n.language().locale"></span>{{ st.suffix }}
              </dd>
            </div>
          }
        </dl>
      </div>
    </section>

    <!-- Áreas de atuação -->
    <section id="areas" class="kx-section kx-section--subtle" aria-labelledby="areas-h">
      <div class="kx-container">
        <kx-section-header
          id="areas-h"
          [eyebrow]="'company.areas.eyebrow' | kxT"
          [title]="'company.areas.title' | kxT"
          [lead]="'company.areas.lead' | kxT"
        />
        <div class="kx-grid kx-grid--3" kxStagger>
          @for (a of areas(); track a.title) {
            <kx-card kxReveal [icon]="a.icon" [title]="a.title" [text]="a.text" [link]="a.page | kxPath" [cta]="a.cta" />
          }
        </div>
      </div>
    </section>

    <!-- Experiência com produtos e serviços -->
    <section id="experiencia" class="kx-section" aria-labelledby="exp-h">
      <div class="kx-container">
        <kx-section-header
          id="exp-h"
          [eyebrow]="'company.experience.eyebrow' | kxT"
          [title]="'company.experience.title' | kxT"
          [lead]="'company.experience.lead' | kxT"
        />
        <div class="kx-grid kx-grid--2" kxStagger>
          @for (p of paths(); track p.title) {
            <kx-card kxReveal variant="feature" [icon]="p.icon" [title]="p.title" [text]="p.text" [link]="p.page | kxPath" [cta]="p.cta" />
          }
        </div>
        <div class="cats" kxReveal>
          <h3>{{ 'company.experience.categoriesTitle' | kxT }}</h3>
          <ul class="sn-tags" role="list">
            @for (c of categories(); track c) { <li>{{ c }}</li> }
          </ul>
        </div>
      </div>
    </section>

    <kx-cta-band [title]="'company.band.title' | kxT" [text]="'company.band.text' | kxT">
      <a kxButton="accent" kxSize="lg" [routerLink]="'contact' | kxPath">{{ 'common.talkToSpecialist' | kxT }}</a>
      <a kxButton="ghost-inverse" kxSize="lg" [routerLink]="'services' | kxPath">{{ 'common.seeServices' | kxT }}</a>
    </kx-cta-band>
  `,
  styles: `
    .art { margin: 0; border-radius: var(--kx-radius-xl); overflow: hidden; aspect-ratio: 4 / 3; }
    .art img { width: 100%; height: 100%; object-fit: cover; }
    .stats { display: grid; gap: var(--kx-space-2); margin: 0; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); }
    .stats dd { margin: 0; }
    .stats .sn-stat { display: flex; flex-direction: column-reverse; justify-content: flex-end; }
    .cats { display: grid; gap: var(--kx-space-2); margin-top: var(--kx-space-8); }
  `,
})
export class CompanyPage {
  protected readonly i18n = inject(KxI18nService);
  protected readonly sections = computed(() => this.i18n.get<Dict['company']['sections']>('company.sections'));
  protected readonly seals = computed(() => this.i18n.get<Dict['common']['seals']>('common.seals'));
  protected readonly intl = computed(() => this.i18n.get<Dict['company']['international']['items']>('company.international.items'));
  protected readonly stats = computed(() => this.i18n.get<Dict['home']['stats']>('home.stats'));
  protected readonly areas = computed(() => this.i18n.get<Dict['company']['areas']['items']>('company.areas.items'));
  protected readonly paths = computed(() => this.i18n.get<Dict['company']['experience']['paths']>('company.experience.paths'));
  protected readonly categories = computed(() => this.i18n.get<string[]>('company.experience.categories'));
}
