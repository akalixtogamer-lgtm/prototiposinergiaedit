import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  KxButtonDirective,
  KxChapterComponent,
  KxCountUpDirective,
  KxCtaBandComponent,
  KxI18nService,
  KxIconComponent,
  KxPathPipe,
  KxRevealDirective,
  KxServiceCardComponent,
  KxServiceRailComponent,
  KxSplitTextDirective,
  KxStaggerDirective,
  KxTranslatePipe,
  KxVideoBgComponent,
  KxVideoSource,
} from 'kalixto-ui';
import { Dict } from '../../core/i18n/pt';
import { SignupLinkComponent } from '../../shared/signup-link.component';

/**
 * Splash / Home (mapa: header, banner de destaque, apresentação institucional,
 * CTA Cinema e CATI, atalhos para as seções, PT/EN, footer, WhatsApp).
 */
@Component({
  selector: 'sn-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    KxButtonDirective,
    KxChapterComponent,
    KxCountUpDirective,
    KxCtaBandComponent,
    KxIconComponent,
    KxPathPipe,
    KxRevealDirective,
    KxServiceCardComponent,
    KxServiceRailComponent,
    KxSplitTextDirective,
    KxStaggerDirective,
    KxTranslatePipe,
    SignupLinkComponent,
    KxVideoBgComponent,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {
  protected readonly i18n = inject(KxI18nService);
  /** Vídeo do hero: versão leve no celular; WebM (menor) com MP4 de reserva. */
  protected readonly videoSources: KxVideoSource[] = [
    { src: 'video/hero-cinema-960.mp4', type: 'video/mp4', media: '(max-width: 767px)' },
    { src: 'video/hero-cinema.webm', type: 'video/webm' },
    { src: 'video/hero-cinema.mp4', type: 'video/mp4' },
  ];
  protected readonly seals = computed(() => this.i18n.get<Dict['common']['seals']>('common.seals'));
  protected readonly shortcuts = computed(() => this.i18n.get<Dict['home']['shortcuts']['items']>('home.shortcuts.items'));
  protected readonly stats = computed(() => this.i18n.get<Dict['home']['stats']>('home.stats'));
  protected readonly services = computed(() => this.i18n.get<Dict['home']['services']['items']>('home.services.items'));
}
