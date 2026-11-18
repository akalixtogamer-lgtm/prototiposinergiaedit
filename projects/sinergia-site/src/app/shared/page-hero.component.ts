import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KxParallaxDirective, KxPathPipe, KxRevealDirective, KxSplitTextDirective, KxTranslatePipe } from 'kalixto-ui';

export interface Crumb {
  /** id da página (link) ou null para a página atual */
  page: string | null;
  /** chave do dicionário */
  label: string;
}

/**
 * Topo das páginas internas: trilha (breadcrumb), eyebrow, H1 com Text Reveal,
 * texto de apoio e imagem opcional com Image Reveal + parallax discreto.
 */
@Component({
  selector: 'sn-page-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, KxPathPipe, KxTranslatePipe, KxRevealDirective, KxSplitTextDirective, KxParallaxDirective],
  template: `
    <header class="sn-page-hero">
      <div class="kx-container inner">
        <div class="copy">
          <nav [attr.aria-label]="'a11y.breadcrumb' | kxT">
            <ol class="sn-crumbs">
              @for (c of crumbs(); track c.label) {
                <li>
                  @if (c.page) {
                    <a [routerLink]="c.page | kxPath">{{ c.label | kxT }}</a>
                  } @else {
                    <span aria-current="page">{{ c.label | kxT }}</span>
                  }
                </li>
              }
            </ol>
          </nav>
          <span class="kx-eyebrow" kxReveal="fade-in">{{ eyebrow() }}</span>
          <h1 [kxSplitText]="title()"></h1>
          @if (text()) {
            <p class="kx-lead" kxReveal [kxRevealDelay]="200">{{ text() }}</p>
          }
          <ng-content />
        </div>
        @if (image()) {
          <figure class="media" kxReveal="image" [kxRevealDelay]="150">
            <img kxParallax [kxParallaxSpeed]="0.06" [src]="image()" [alt]="imageAlt()" width="1200" height="900" fetchpriority="high" />
          </figure>
        }
      </div>
    </header>
  `,
  styles: `
    figure { margin: 0; }
    .media img { transform-origin: center; scale: 1.2; }
  `,
})
export class PageHeroComponent {
  readonly crumbs = input.required<Crumb[]>();
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly text = input('');
  readonly image = input('');
  readonly imageAlt = input('');
}
