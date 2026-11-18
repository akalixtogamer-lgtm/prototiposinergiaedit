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
  KxStaggerDirective,
  KxTranslatePipe,
} from 'kalixto-ui';
import { Dict } from '../../core/i18n/pt';
import { PageHeroComponent } from '../../shared/page-hero.component';

/** Serviços › Cinema (mapa: o que oferecemos em cards, imagens, ícones, CTA contato). */
@Component({
  selector: 'sn-cinema',
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
    KxStaggerDirective,
    KxTranslatePipe,
    PageHeroComponent,
  ],
  template: `
    <sn-page-hero
      [crumbs]="[{ page: 'home', label: 'nav.home' }, { page: 'services', label: 'nav.services' }, { page: null, label: 'nav.cinema' }]"
      [eyebrow]="'cinema.hero.eyebrow' | kxT"
      [title]="'cinema.hero.title' | kxT"
      [text]="'cinema.hero.text' | kxT"
      image="images/cinema-hall.svg"
      [imageAlt]="'cinema.hero.imageAlt' | kxT"
    >
      @if (seals().length) {
        <ul class="sn-seals" role="list" style="margin-top: 8px">
          @for (s of seals(); track s.k) { <li><i>{{ s.k }}</i>{{ s.label }}</li> }
        </ul>
      }
    </sn-page-hero>

    <section class="kx-section" aria-labelledby="off-h">
      <div class="kx-container">
        <kx-section-header id="off-h" [eyebrow]="'cinema.offerEyebrow' | kxT" [title]="'cinema.offerTitle' | kxT" />
        <ol class="kx-grid kx-grid--3 phases" role="list" kxStagger>
          @for (p of phases(); track p.label) {
            <li class="sn-phase" kxReveal>
              <span class="num">{{ p.label }}</span>
              <h3>{{ p.title }}</h3>
              <span class="service">{{ p.service }}</span>
              <p>{{ p.text }}</p>
            </li>
          }
        </ol>
        <div class="fg" kxReveal>
          <kx-card
            variant="feature"
            icon="users"
            [eyebrow]="'nav.focusGroup' | kxT"
            [title]="'cinema.focus.title' | kxT"
            [text]="'cinema.focus.text' | kxT"
            [link]="'services' | kxPath"
            fragment="focus-group"
            [cta]="'cinema.focus.cta' | kxT"
          />
        </div>
      </div>
    </section>

    <section class="kx-section kx-section--subtle" aria-labelledby="prot-h">
      <div class="kx-container">
        <kx-section-header id="prot-h" [eyebrow]="'cinema.protectEyebrow' | kxT" [title]="'cinema.protectTitle' | kxT" />
        <div class="kx-grid kx-grid--3" kxStagger>
          @for (p of protect(); track p.title) {
            <kx-card kxReveal [icon]="p.icon" [title]="p.title" [text]="p.text" />
          }
        </div>
      </div>
    </section>

    <kx-cta-band [title]="'cinema.band.title' | kxT" [text]="'cinema.band.text' | kxT">
      <a kxButton="accent" kxSize="lg" [routerLink]="'contact' | kxPath">
        {{ 'common.talkToSpecialist' | kxT }}
        <kx-icon name="arrow-right" class="kx-btn__icon kx-btn__icon--trail" [size]="18" />
      </a>
    </kx-cta-band>
  `,
  styles: `
    .phases { margin: 0; padding: 0; }
    .fg { margin-top: var(--kx-space-4); }
  `,
})
export class CinemaPage {
  private readonly i18n = inject(KxI18nService);
  protected readonly seals = computed(() => this.i18n.get<Dict['common']['seals']>('common.seals'));
  protected readonly phases = computed(() => this.i18n.get<Dict['phases']>('phases'));
  protected readonly protect = computed(() => this.i18n.get<Dict['cinema']['protect']>('cinema.protect'));
}
