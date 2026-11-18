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
  KxSplitTextDirective,
  KxStaggerDirective,
  KxTranslatePipe,
} from 'kalixto-ui';
import { Dict } from '../../core/i18n/pt';
import { PageHeroComponent } from '../../shared/page-hero.component';

/**
 * Serviços › Estações CATI próprias (mapa: estrutura das estações, o que
 * oferecemos, características e diferenciais comprovados, imagens, ícones, CTA).
 * Detalhes da estrutura (posições, horários, capacidade) aguardam a cliente.
 */
@Component({
  selector: 'sn-cati',
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
    KxSplitTextDirective,
    KxStaggerDirective,
    KxTranslatePipe,
    PageHeroComponent,
  ],
  template: `
    <sn-page-hero
      [crumbs]="[{ page: 'home', label: 'nav.home' }, { page: 'services', label: 'nav.services' }, { page: null, label: 'nav.cati' }]"
      [eyebrow]="'cati.hero.eyebrow' | kxT"
      [title]="'cati.hero.title' | kxT"
      [text]="'cati.hero.text' | kxT"
      image="images/cati-stations.svg"
      [imageAlt]="'cati.hero.imageAlt' | kxT"
    />

    <section class="kx-section" aria-labelledby="off-h">
      <div class="kx-container">
        <kx-section-header id="off-h" [eyebrow]="'cati.offerEyebrow' | kxT" [title]="'cati.offerTitle' | kxT" />
        <div class="kx-grid kx-grid--3" kxStagger>
          @for (o of offer(); track o.title) {
            <kx-card kxReveal [icon]="o.icon" [title]="o.title" [text]="o.text" />
          }
        </div>
      </div>
    </section>

    <section class="kx-section kx-section--subtle" aria-labelledby="str-h">
      <div class="kx-container kx-split">
        <figure class="art" kxReveal="image">
          <img src="images/cati-stations.svg" alt="" width="1600" height="900" loading="lazy" />
        </figure>
        <div class="kx-stack kx-stack--lg">
          <span class="kx-eyebrow" kxReveal="fade-in">{{ 'cati.structureEyebrow' | kxT }}</span>
          <h2 id="str-h" [kxSplitText]="'cati.structureTitle' | kxT"></h2>
          <p class="kx-muted" kxReveal>{{ 'cati.structureText' | kxT }}</p>
          @if (structure().length) {
            <dl class="structure">
              @for (s of structure(); track s.title) {
                <div kxReveal><dt>{{ s.title }}</dt><dd>{{ s.text }}</dd></div>
              }
            </dl>
          } @else {
            <p class="sn-pending kx-small" kxReveal>{{ 'cati.structureEmpty' | kxT }}</p>
          }
        </div>
      </div>
    </section>

    <section class="kx-section" aria-labelledby="dif-h">
      <div class="kx-container">
        <kx-section-header id="dif-h" [eyebrow]="'cati.diffEyebrow' | kxT" [title]="'cati.diffTitle' | kxT" />
        <div class="kx-grid kx-grid--3" kxStagger>
          @for (d of diff(); track d.title) {
            <kx-card kxReveal variant="feature" [icon]="d.icon" [title]="d.title" [text]="d.text" />
          }
        </div>
      </div>
    </section>

    <kx-cta-band [title]="'cati.band.title' | kxT" [text]="'cati.band.text' | kxT">
      <a kxButton="accent" kxSize="lg" [routerLink]="'contact' | kxPath">
        {{ 'common.talkToSpecialist' | kxT }}
        <kx-icon name="arrow-right" class="kx-btn__icon kx-btn__icon--trail" [size]="18" />
      </a>
    </kx-cta-band>
  `,
  styles: `
    .art { margin: 0; border-radius: var(--kx-radius-xl); overflow: hidden; aspect-ratio: 4 / 3; }
    .art img { width: 100%; height: 100%; object-fit: cover; }
    .structure { display: grid; gap: var(--kx-space-2); margin: 0; }
    .structure dt { font-weight: 600; }
    .structure dd { margin: 0; color: var(--kx-color-fg-muted); }
  `,
})
export class CatiPage {
  private readonly i18n = inject(KxI18nService);
  protected readonly offer = computed(() => this.i18n.get<Dict['cati']['offer']>('cati.offer'));
  protected readonly structure = computed(() => this.i18n.get<Dict['cati']['structure']>('cati.structure'));
  protected readonly diff = computed(() => this.i18n.get<Dict['cati']['diff']>('cati.diff'));
}
